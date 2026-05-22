# GCP Secrets — Plan de Validación
### Política Moderna · politicamoderna-prod

> **Propósito:** Auditar y validar que todos los secretos en Google Cloud Secret Manager están correctamente configurados, son accesibles por el servicio de Cloud Run, y tienen los valores correctos antes de cualquier cambio de infraestructura.  
> **Ejecutar:** Antes y después de cada migración de secretos o redeploy significativo.

---

## Inventario de secretos esperados

### Estado actual (secretos individuales)

| Nombre del secreto | Variable que alimenta | Obligatorio | Estado esperado |
|---|---|---|---|
| `REVALIDATE_SECRET` | `REVALIDATE_SECRET` | ✅ Sí | Cadena aleatoria ≥32 caracteres |
| `SANITY_API_WRITE_TOKEN` | `SANITY_API_WRITE_TOKEN` | ✅ Sí | Token de escritura de Sanity (empieza con `sk...`) |

### Estado objetivo (JSON consolidado — ver `docs/gcp-secrets-migration.md`)

| Nombre del secreto | Formato | Obligatorio |
|---|---|---|
| `APP_SECRETS` | JSON con claves: `sanity.writeToken`, `sanity.revalidateSecret`, `resend.apiKey` | ✅ Sí |

---

## Paso 1 — Verificar que Secret Manager API está habilitada

```bash
PROJECT_ID=politicamoderna-prod

gcloud services list --enabled \
  --filter="name:secretmanager.googleapis.com" \
  --project=$PROJECT_ID

# Salida esperada:
# NAME                              TITLE
# secretmanager.googleapis.com     Secret Manager API
```

Si no aparece:

```bash
gcloud services enable secretmanager.googleapis.com --project=$PROJECT_ID
```

---

## Paso 2 — Listar todos los secretos existentes

```bash
gcloud secrets list --project=$PROJECT_ID

# Salida esperada (ejemplo):
# NAME                   CREATED              REPLICATION_POLICY
# REVALIDATE_SECRET      2026-05-XX ...       automatic
# SANITY_API_WRITE_TOKEN 2026-05-XX ...       automatic
```

Anota los nombres exactos — cualquier diferencia de mayúsculas/minúsculas causa errores.

---

## Paso 3 — Verificar que cada secreto tiene al menos una versión activa

```bash
# Verificar REVALIDATE_SECRET
gcloud secrets versions list REVALIDATE_SECRET \
  --project=$PROJECT_ID \
  --format="table(name,state,createTime)"

# Verificar SANITY_API_WRITE_TOKEN
gcloud secrets versions list SANITY_API_WRITE_TOKEN \
  --project=$PROJECT_ID \
  --format="table(name,state,createTime)"
```

**Estado esperado de cada versión:** `ENABLED`

Si alguna versión está `DISABLED` o `DESTROYED`, es necesario crear una nueva:

```bash
echo -n "nuevo-valor-aqui" | \
  gcloud secrets versions add NOMBRE_DEL_SECRETO \
  --data-file=- \
  --project=$PROJECT_ID
```

---

## Paso 4 — Verificar el formato del valor de cada secreto

> ⚠️ Solo ejecuta esto en un entorno seguro. Nunca copies el valor en logs, chats ni documentos compartidos.

```bash
# Ver el valor de REVALIDATE_SECRET (solo para validación)
gcloud secrets versions access latest \
  --secret=REVALIDATE_SECRET \
  --project=$PROJECT_ID

# Criterio: debe ser una cadena de ≥32 caracteres alfanuméricos aleatoria
# Ejemplo de valor válido: "k8Jx2mPqL9rN7vBwQfYtHcDsAuEzX4o6"

# Ver el valor de SANITY_API_WRITE_TOKEN
gcloud secrets versions access latest \
  --secret=SANITY_API_WRITE_TOKEN \
  --project=$PROJECT_ID

# Criterio: debe empezar con "sk" y contener >80 caracteres
```

---

## Paso 5 — Verificar que el service account tiene acceso

```bash
SA_EMAIL="politicamoderna-run@${PROJECT_ID}.iam.gserviceaccount.com"

# Ver permisos del service account en el proyecto
gcloud projects get-iam-policy $PROJECT_ID \
  --flatten="bindings[].members" \
  --filter="bindings.members:${SA_EMAIL}" \
  --format="table(bindings.role)"

# Rol requerido: roles/secretmanager.secretAccessor
```

Si el rol no aparece:

```bash
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/secretmanager.secretAccessor"
```

---

## Paso 6 — Verificar que Cloud Run referencia los secretos correctamente

```bash
gcloud run services describe politicamoderna-web \
  --region=us-central1 \
  --project=$PROJECT_ID \
  --format="yaml(spec.template.spec.containers[0].env)"
```

**Estado esperado para secretos individuales:**

```yaml
- name: REVALIDATE_SECRET
  valueFrom:
    secretKeyRef:
      key: latest
      name: REVALIDATE_SECRET
- name: SANITY_API_WRITE_TOKEN
  valueFrom:
    secretKeyRef:
      key: latest
      name: SANITY_API_WRITE_TOKEN
```

**Estado esperado para JSON consolidado (después de migración):**

```yaml
- name: APP_SECRETS
  valueFrom:
    secretKeyRef:
      key: latest
      name: APP_SECRETS
```

---

## Paso 7 — Smoke test del endpoint de salud

```bash
SERVICE_URL=$(gcloud run services describe politicamoderna-web \
  --region=us-central1 \
  --project=$PROJECT_ID \
  --format='value(status.url)')

curl -s "${SERVICE_URL}/api/health" | python3 -m json.tool

# Respuesta esperada:
# {
#   "status": "ok",
#   "sanity": "configured",
#   "timestamp": "2026-05-XX..."
# }
```

Si `sanity` devuelve `"mock-mode"`, el `SANITY_API_WRITE_TOKEN` no está siendo leído correctamente.

---

## Paso 8 — Validar webhook de revalidación con el secreto real

```bash
REVALIDATE_SECRET=$(gcloud secrets versions access latest \
  --secret=REVALIDATE_SECRET --project=$PROJECT_ID)

curl -s -X POST "${SERVICE_URL}/api/revalidate" \
  -H "Authorization: Bearer ${REVALIDATE_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{"_type":"post","slug":"test-slug"}' | python3 -m json.tool

# Respuesta esperada:
# { "revalidated": true }

# Respuesta de error (secreto incorrecto):
# { "error": "Unauthorized" }
```

---

## Checklist de validación completa

```
□ Secret Manager API habilitada
□ Secretos listados con nombres exactos (sin typos)
□ Cada secreto tiene al menos una versión ENABLED
□ Valores tienen el formato correcto (longitud, prefijo)
□ Service account tiene roles/secretmanager.secretAccessor
□ Cloud Run referencia los secretos correctamente en su spec
□ /api/health devuelve { "status": "ok", "sanity": "configured" }
□ Webhook /api/revalidate responde { "revalidated": true } con el secreto correcto
```

---

*Para ejecutar la migración a JSON consolidado, ver [`gcp-secrets-migration.md`](./gcp-secrets-migration.md).*  
*Para el procedimiento de rollback, ver [`gcp-secrets-rollback.md`](./gcp-secrets-rollback.md).*
