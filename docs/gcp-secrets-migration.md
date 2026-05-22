# GCP Secrets — Migración a JSON Consolidado
### Política Moderna · politicamoderna-prod

> **Propósito:** Consolidar los secretos individuales de Google Cloud Secret Manager en un único JSON secret (`APP_SECRETS`), simplificando la gestión de credenciales y reduciendo el número de secretos a administrar.

---

## Estado actual vs. estado objetivo

### Antes (secretos individuales)

```
Secret Manager:
  ├── REVALIDATE_SECRET          → "k8Jx2mPqL9..."
  └── SANITY_API_WRITE_TOKEN     → "skSanity..."

Cloud Run --update-secrets:
  REVALIDATE_SECRET=REVALIDATE_SECRET:latest,
  SANITY_API_WRITE_TOKEN=SANITY_API_WRITE_TOKEN:latest
```

### Después (JSON consolidado)

```
Secret Manager:
  └── APP_SECRETS → {
        "sanity": {
          "writeToken": "skSanity...",
          "revalidateSecret": "k8Jx2mPqL9..."
        },
        "resend": {
          "apiKey": "re_xxxx...",
          "fromAddress": "noreply@politicamoderna.info",
          "teamEmail": "equipo@politicamoderna.info"
        },
        "analytics": {
          "gaId": ""
        }
      }

Cloud Run --update-secrets:
  APP_SECRETS=APP_SECRETS:latest
```

---

## Arquitectura de carga de secretos

El módulo [`lib/secrets.ts`](../lib/secrets.ts) ya implementa la lógica completa de carga con triple fallback:

```
Prioridad 1: process.env.APP_SECRETS (JSON string montado por Cloud Run)
     ↓ si no existe
Prioridad 2: GCP Secret Manager API (via Application Default Credentials)
     ↓ si falla
Prioridad 3: Variables de entorno individuales (desarrollo local)
```

**No se requieren cambios en el código de la aplicación** — `lib/secrets.ts` ya está preparado para el JSON bundle.

---

## Plan de migración — Zero Downtime

> [!IMPORTANT]
> Esta migración es **no destructiva**. Los secretos individuales se mantienen activos durante todo el proceso hasta confirmar que el nuevo secreto funciona correctamente en producción.

### Fase 1 — Crear el nuevo secreto JSON (sin afectar producción)

**Paso 1.1** — Recolectar los valores actuales

```bash
PROJECT_ID=politicamoderna-prod

# Leer valores actuales (en entorno seguro, no loguear)
CURRENT_REVALIDATE=$(gcloud secrets versions access latest \
  --secret=REVALIDATE_SECRET --project=$PROJECT_ID)

CURRENT_SANITY_TOKEN=$(gcloud secrets versions access latest \
  --secret=SANITY_API_WRITE_TOKEN --project=$PROJECT_ID)

# El RESEND_API_KEY puede estar en .env.local local — agrégalo manualmente
CURRENT_RESEND_KEY="re_xxxxxxxxxxxxxxxxxxxx"   # ← reemplazar con el valor real
```

**Paso 1.2** — Construir el JSON

```bash
# Crear el archivo JSON temporalmente en memoria (no en disco)
APP_SECRETS_JSON=$(cat <<EOF
{
  "sanity": {
    "projectId": "33umjun9",
    "dataset": "production",
    "apiVersion": "2025-02-19",
    "writeToken": "${CURRENT_SANITY_TOKEN}",
    "revalidateSecret": "${CURRENT_REVALIDATE}"
  },
  "resend": {
    "apiKey": "${CURRENT_RESEND_KEY}",
    "fromAddress": "noreply@politicamoderna.info",
    "teamEmail": "equipo@politicamoderna.info"
  },
  "analytics": {
    "gaId": ""
  }
}
EOF
)
```

**Paso 1.3** — Crear el secreto en GCP

```bash
# Crear el secreto APP_SECRETS
echo -n "$APP_SECRETS_JSON" | \
  gcloud secrets create APP_SECRETS \
  --data-file=- \
  --project=$PROJECT_ID

# Verificar que se creó correctamente
gcloud secrets versions list APP_SECRETS --project=$PROJECT_ID
# → VERSION  STATE    CREATE_TIME
# → 1        ENABLED  2026-05-XX
```

**Paso 1.4** — Validar el JSON almacenado

```bash
gcloud secrets versions access latest \
  --secret=APP_SECRETS \
  --project=$PROJECT_ID | python3 -m json.tool

# Verificar que el JSON es válido y contiene todos los campos esperados
```

---

### Fase 2 — Desplegar con el nuevo secreto (prueba en URL *.run.app)

**Paso 2.1** — Redesplegar Cloud Run con el nuevo secreto

```bash
SA_EMAIL="politicamoderna-run@${PROJECT_ID}.iam.gserviceaccount.com"

gcloud run services update politicamoderna-web \
  --region=us-central1 \
  --project=$PROJECT_ID \
  --update-secrets="APP_SECRETS=APP_SECRETS:latest" \
  --remove-env-vars="REVALIDATE_SECRET,SANITY_API_WRITE_TOKEN"
```

> [!NOTE]
> Este comando agrega el nuevo secreto Y elimina los env vars de los secretos individuales en el mismo deploy. Cloud Run realizará un rollout gradual automático.

**Paso 2.2** — Obtener la URL de Cloud Run para pruebas

```bash
SERVICE_URL=$(gcloud run services describe politicamoderna-web \
  --region=us-central1 \
  --project=$PROJECT_ID \
  --format='value(status.url)')

echo "Test URL: $SERVICE_URL"
```

**Paso 2.3** — Validar en la URL de Cloud Run (antes de que afecte el dominio custom)

```bash
# Health check
curl -s "${SERVICE_URL}/api/health" | python3 -m json.tool
# → { "status": "ok", "sanity": "configured", "timestamp": "..." }

# Validar revalidate webhook
REVALIDATE_SECRET_VAL=$(gcloud secrets versions access latest \
  --secret=REVALIDATE_SECRET --project=$PROJECT_ID)

curl -s -X POST "${SERVICE_URL}/api/revalidate" \
  -H "Authorization: Bearer ${REVALIDATE_SECRET_VAL}" \
  -H "Content-Type: application/json" \
  -d '{"_type":"post","slug":"test"}' | python3 -m json.tool
# → { "revalidated": true }

# Validar páginas principales
for PATH in / /sobre-mi /propuestas /noticias /contacto; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${SERVICE_URL}${PATH}")
  echo "$STATUS $PATH"
done
# → Todas deben devolver 200
```

---

### Fase 3 — Confirmar en producción (dominio custom)

```bash
BASE=https://politicamoderna.info

# Smoke test completo
for PATH in / /sobre-mi /propuestas /noticias /actividades /agenda /contacto /sumate; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${BASE}${PATH}")
  echo "$STATUS $PATH"
done

curl -s "${BASE}/api/health" | python3 -m json.tool
```

---

### Fase 4 — Cleanup de secretos individuales (opcional, después de 1 semana estable)

> [!CAUTION]
> Solo ejecutar esta fase después de **al menos 1 semana** de operación estable con el nuevo secreto JSON. Destruir secretos es **irreversible**.

```bash
# Deshabilitar (reversible) — recomendado como primer paso
gcloud secrets versions disable 1 \
  --secret=REVALIDATE_SECRET \
  --project=$PROJECT_ID

gcloud secrets versions disable 1 \
  --secret=SANITY_API_WRITE_TOKEN \
  --project=$PROJECT_ID

# Eliminar completamente (irreversible) — solo si confirmado 100%
# gcloud secrets delete REVALIDATE_SECRET --project=$PROJECT_ID
# gcloud secrets delete SANITY_API_WRITE_TOKEN --project=$PROJECT_ID
```

---

## Cómo actualizar el secreto en el futuro

Para rotar o actualizar cualquier valor del JSON:

```bash
# 1. Obtener el valor actual
CURRENT=$(gcloud secrets versions access latest \
  --secret=APP_SECRETS --project=$PROJECT_ID)

# 2. Modificar el valor (editar el JSON en tu editor)
echo "$CURRENT" > /tmp/app_secrets_edit.json
# → editar el archivo
# → ADVERTENCIA: elimina /tmp/app_secrets_edit.json cuando termines

# 3. Subir la nueva versión
gcloud secrets versions add APP_SECRETS \
  --data-file=/tmp/app_secrets_edit.json \
  --project=$PROJECT_ID

# 4. Limpiar el archivo temporal
rm /tmp/app_secrets_edit.json

# 5. Redesplegar para que Cloud Run use la nueva versión
gcloud run services update politicamoderna-web \
  --region=us-central1 \
  --project=$PROJECT_ID \
  --update-secrets="APP_SECRETS=APP_SECRETS:latest"
```

---

## Checklist de migración

```
Fase 1 — Crear APP_SECRETS
□ Valores de secretos individuales recolectados de forma segura
□ JSON construido y validado con python3 -m json.tool
□ Secreto APP_SECRETS creado en GCP con estado ENABLED
□ JSON almacenado validado (acceso a la versión y verificación del formato)

Fase 2 — Deploy de prueba
□ Cloud Run actualizado con APP_SECRETS y sin secretos individuales
□ Health check: { "status": "ok", "sanity": "configured" }
□ Revalidate webhook responde { "revalidated": true }
□ Todas las páginas principales devuelven 200

Fase 3 — Producción
□ Smoke test completo en https://politicamoderna.info
□ Formulario de contacto funcional
□ Sin errores en Cloud Run logs por 24 horas

Fase 4 — Cleanup (después de 1 semana)
□ Secretos individuales deshabilitados (no eliminados aún)
□ 1 semana adicional sin incidentes
□ Secretos individuales eliminados definitivamente
```

---

*Para el procedimiento de rollback, ver [`gcp-secrets-rollback.md`](./gcp-secrets-rollback.md).*  
*Para validar el estado actual de los secretos antes de migrar, ver [`gcp-secrets-validation.md`](./gcp-secrets-validation.md).*
