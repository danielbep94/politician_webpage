# GCP Secrets — Plan de Rollback
### Política Moderna · politicamoderna-prod

> **Propósito:** Revertir a los secretos individuales si el secreto JSON consolidado (`APP_SECRETS`) causa problemas en producción después de la migración.  
> **Tiempo estimado de rollback:** 3–5 minutos.  
> **Prerequisito:** Los secretos individuales (`REVALIDATE_SECRET`, `SANITY_API_WRITE_TOKEN`) deben estar en estado `ENABLED` — no destruidos.

---

## Cuándo ejecutar el rollback

Ejecuta este plan si observas alguna de las siguientes condiciones después de la migración:

| Síntoma | Urgencia |
|---|---|
| `/api/health` devuelve `"mock-mode"` en lugar de `"configured"` | 🔴 Inmediato |
| `/api/revalidate` devuelve `401 Unauthorized` | 🔴 Inmediato |
| Formularios de contacto/voluntariado no guardan datos | 🔴 Inmediato |
| Emails transaccionales no se envían | 🟡 Dentro de 1 hora |
| Errores `[secrets]` en Cloud Run logs | 🟡 Dentro de 1 hora |
| Incremento de errores 5xx en métricas | 🔴 Inmediato |

---

## Paso 1 — Verificar el estado actual (diagnóstico rápido)

```bash
PROJECT_ID=politicamoderna-prod

# 1a. Verificar health del servicio
SERVICE_URL=$(gcloud run services describe politicamoderna-web \
  --region=us-central1 --project=$PROJECT_ID \
  --format='value(status.url)')

curl -s "${SERVICE_URL}/api/health" | python3 -m json.tool

# 1b. Ver los últimos logs de errores
gcloud logging read \
  "resource.type=cloud_run_revision \
   AND resource.labels.service_name=politicamoderna-web \
   AND severity>=ERROR" \
  --project=$PROJECT_ID \
  --limit=20 \
  --format="table(timestamp, textPayload)"
```

---

## Paso 2 — Rollback de tráfico a la revisión anterior (más rápido)

Cloud Run mantiene el historial de revisiones. Si la última revisión es problemática, puedes redirigir el 100% del tráfico a la revisión anterior en segundos.

```bash
# Listar las últimas 5 revisiones
gcloud run revisions list \
  --service=politicamoderna-web \
  --region=us-central1 \
  --project=$PROJECT_ID \
  --limit=5 \
  --format="table(name,status.conditions[0].status,createTime)"

# Identificar la revisión anterior (la que funcionaba)
# Ejemplo: politicamoderna-web-00005-abc

# Redirigir 100% del tráfico a la revisión anterior
gcloud run services update-traffic politicamoderna-web \
  --to-revisions=politicamoderna-web-00005-abc=100 \
  --region=us-central1 \
  --project=$PROJECT_ID

# Verificar
curl -s "${SERVICE_URL}/api/health" | python3 -m json.tool
# → debe devolver { "status": "ok", "sanity": "configured" }
```

> [!TIP]
> El rollback de tráfico NO requiere un nuevo deploy. Es instantáneo. Úsalo como primera respuesta.

---

## Paso 3 — Restaurar los secretos individuales en Cloud Run

Si el rollback de tráfico no es suficiente (por ejemplo, la revisión anterior también usaba `APP_SECRETS`), restaura los secretos individuales:

```bash
# Verificar que los secretos individuales aún existen y están habilitados
gcloud secrets versions list REVALIDATE_SECRET \
  --project=$PROJECT_ID \
  --format="table(name,state)"

gcloud secrets versions list SANITY_API_WRITE_TOKEN \
  --project=$PROJECT_ID \
  --format="table(name,state)"

# Si están DISABLED, re-habilitarlos primero:
gcloud secrets versions enable 1 \
  --secret=REVALIDATE_SECRET \
  --project=$PROJECT_ID

gcloud secrets versions enable 1 \
  --secret=SANITY_API_WRITE_TOKEN \
  --project=$PROJECT_ID
```

---

## Paso 4 — Redesplegar con secretos individuales

```bash
gcloud run services update politicamoderna-web \
  --region=us-central1 \
  --project=$PROJECT_ID \
  --remove-env-vars="APP_SECRETS" \
  --update-secrets="REVALIDATE_SECRET=REVALIDATE_SECRET:latest,SANITY_API_WRITE_TOKEN=SANITY_API_WRITE_TOKEN:latest"
```

> [!NOTE]
> Este comando elimina el montaje de `APP_SECRETS` y restaura los secretos individuales. Cloud Run creará una nueva revisión con la configuración anterior.

---

## Paso 5 — Validar que el rollback fue exitoso

```bash
# Health check
curl -s "${SERVICE_URL}/api/health" | python3 -m json.tool
# → { "status": "ok", "sanity": "configured" }

# Revalidate webhook
REVALIDATE_SECRET_VAL=$(gcloud secrets versions access latest \
  --secret=REVALIDATE_SECRET --project=$PROJECT_ID)

curl -s -X POST "${SERVICE_URL}/api/revalidate" \
  -H "Authorization: Bearer ${REVALIDATE_SECRET_VAL}" \
  -H "Content-Type: application/json" \
  -d '{"_type":"post","slug":"test"}' | python3 -m json.tool
# → { "revalidated": true }

# Páginas principales
for PATH in / /sobre-mi /propuestas /noticias /contacto; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://politicamoderna.info${PATH}")
  echo "$STATUS $PATH"
done
# → Todas deben ser 200
```

---

## Paso 6 — Diagnosticar el problema antes de intentar la migración de nuevo

Después de estabilizar, revisa los logs para entender qué salió mal:

```bash
# Logs de errores de secretos
gcloud logging read \
  "resource.type=cloud_run_revision \
   AND resource.labels.service_name=politicamoderna-web \
   AND textPayload=~\"secrets\"" \
  --project=$PROJECT_ID \
  --limit=30 \
  --format="table(timestamp, textPayload)"
```

**Causas comunes de fallo:**

| Causa | Diagnóstico | Solución |
|---|---|---|
| JSON malformado en `APP_SECRETS` | Error `SyntaxError` en logs | Recrear el secreto con JSON válido (`python3 -m json.tool`) |
| Falta de permisos del SA | Error `PERMISSION_DENIED` en logs | Verificar `roles/secretmanager.secretAccessor` del SA |
| Nombre del secreto incorrecto | Error `NOT_FOUND` en logs | Verificar nombre exacto con `gcloud secrets list` |
| Campo faltante en el JSON | Errores de `undefined` en handlers | Revisar el schema en `lib/secrets.ts` → `AppSecrets` |

---

## Checklist de rollback

```
□ Síntoma identificado y documentado
□ Logs revisados para diagnóstico
□ Rollback de tráfico ejecutado → health check pasó
□ Si necesario: secretos individuales re-habilitados
□ Si necesario: Cloud Run redesplegado con secretos individuales
□ Health check final: { "status": "ok", "sanity": "configured" }
□ Revalidate webhook: { "revalidated": true }
□ Páginas principales todas con 200
□ Problema documentado para próximo intento de migración
```

---

## Contactos de escalación

| Rol | Responsabilidad |
|---|---|
| Equipo técnico | Ejecutar el rollback y diagnosticar el problema |
| DevOps / GCP lead | Modificar IAM y configuración de Cloud Run |
| Comunicación | Notificar al equipo si el sitio estuvo caído más de 5 minutos |

---

*Relacionado: [`gcp-secrets-migration.md`](./gcp-secrets-migration.md) · [`gcp-secrets-validation.md`](./gcp-secrets-validation.md)*
