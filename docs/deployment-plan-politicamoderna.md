# Plan de despliegue para `politicamoderna.info`

## Objetivo

Publicar este sitio en producción con un dominio propio, HTTPS, una ruta clara de despliegue continuo y una configuración que no dependa de features en preview.

## Estado actual del proyecto

- La app es `Next.js 15` con `App Router`.
- Ya existe `Dockerfile`, por lo que encaja bien con `Cloud Run`.
- La capa de datos usa `Sanity`, pero también tiene fallbacks a `mock-content`.
- El build de producción ya fue validado localmente.
- Se corrigió un bloqueo de build en `lib/sanity/api.ts` para que los documentos singleton faltantes en Sanity usen fallback en lugar de romper el prerender.

## Riesgos de lanzamiento que siguen abiertos

- Todavía hay branding placeholder como `Impulso Comunitario` y `Mariana Torres`.
- El formulario de contacto actualmente solo hace `console.info`; no envía correo ni persiste leads.
- Analytics sigue en modo stub.
- Si Sanity se va a usar en producción, faltan validación final de contenido y webhook de revalidación.

## Arquitectura recomendada

- Hosting de aplicación: `Cloud Run`
- Build y artefactos: `Cloud Build` + `Artifact Registry`
- Dominio y TLS: `Global External Application Load Balancer` + certificado administrado por Google
- DNS: zona del dominio en Google Cloud con registros `A` al IP global del balanceador
- Canonical principal: `https://politicamoderna.info`
- Redirección secundaria: `https://www.politicamoderna.info` -> `https://politicamoderna.info`

## Por qué esta arquitectura

- `Cloud Run` encaja con este proyecto porque no es un sitio estático puro: tiene rutas API y runtime Node.
- El balanceador global es la ruta recomendada para dominios personalizados productivos en Cloud Run.
- `Artifact Registry` es la opción actual recomendada para imágenes de contenedor.

## Fase 1: dejar el sitio listo para producción

1. Reemplazar branding y contenido placeholder.
2. Definir si el lanzamiento inicial saldrá con contenido real desde `Sanity` o con fallback temporal.
3. Decidir cómo se guardarán los mensajes del formulario de contacto:
   - opción mínima: persistirlos en `Sanity`
   - opción mejor: enviarlos a CRM, email transaccional o ambos
4. Confirmar nombre público del proyecto y actualizar:
   - `NEXT_PUBLIC_SITE_NAME`
   - `NEXT_PUBLIC_SITE_URL`
   - contenido mock o documentos de `Sanity`

## Fase 2: variables de entorno de producción

Configurar estas variables en Cloud Run antes del corte de dominio:

- `NEXT_PUBLIC_SITE_URL=https://politicamoderna.info`
- `NEXT_PUBLIC_SITE_NAME=Politica Moderna` si ese será el nombre público final
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET=production`
- `NEXT_PUBLIC_SANITY_API_VERSION=2025-02-19`
- `NEXT_PUBLIC_SANITY_STUDIO_URL`
- `SANITY_API_WRITE_TOKEN`
- `REVALIDATE_SECRET`
- `CONTACT_RECIPIENT_EMAIL`
- `NEXT_PUBLIC_GA_ID` cuando ya exista medición real

## Fase 3: primer despliegue a Cloud Run

### Ruta recomendada para el primer deploy

Usar despliegue desde código fuente con `gcloud run deploy --source .`. Como este repositorio ya incluye `Dockerfile`, Cloud Run puede construir usando ese archivo y guardar la imagen en `Artifact Registry`.

### Secuencia sugerida

1. Crear o elegir el proyecto de Google Cloud.
2. Habilitar APIs clave:
   - Cloud Run Admin API
   - Cloud Build API
   - Artifact Registry API
   - Compute Engine API
   - Cloud DNS API si el DNS del dominio quedará ahí
3. Desplegar un servicio inicial, por ejemplo `politicamoderna-web`, en `us-central1`.
4. Cargar las variables de entorno productivas.
5. Permitir acceso público.
6. Validar la URL temporal `run.app` antes de tocar DNS.

### Comando base sugerido

```bash
gcloud run deploy politicamoderna-web \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

## Fase 4: CI/CD estable

Después del primer deploy manual:

1. Crear un repositorio en `Artifact Registry`.
2. Configurar trigger de `Cloud Build` desde la rama principal.
3. Pipeline esperado:
   - build de imagen
   - push a `Artifact Registry`
   - deploy a `Cloud Run`
4. Mantener un entorno preview antes de tocar producción si habrá cambios frecuentes.

## Fase 5: conectar `politicamoderna.info`

### Recomendación principal

No usar `Cloud Run domain mapping` como base productiva. Para producción, usar `Global External Application Load Balancer`.

### Pasos de dominio

1. Reservar una IP global estática.
2. Crear el balanceador HTTPS público.
3. Conectar el backend de `Cloud Run` mediante un `serverless NEG`.
4. Crear un certificado administrado por Google para:
   - `politicamoderna.info`
   - `www.politicamoderna.info`
5. Crear reglas de host:
   - servir la app en `politicamoderna.info`
   - redirigir `www` al host canónico
6. Actualizar DNS del dominio:
   - registro `A` para `@` hacia la IP global
   - registro `A` para `www` hacia la misma IP global
7. Esperar propagación DNS y emisión del certificado.

## Fase 6: validación de salida

Checklist mínimo antes del go-live:

- La home responde en `https://politicamoderna.info`
- `https://www.politicamoderna.info` redirige al host canónico
- `robots.txt` y `sitemap.xml` apuntan al dominio final
- Metadatos y Open Graph usan el dominio final
- Formularios responden correctamente
- Noticias, propuestas, actividades y páginas internas renderizan bien
- Móvil y desktop se ven correctos
- Search Console queda configurado
- Si Sanity está activo, el webhook de revalidación queda funcionando

## Fase 7: hardening posterior al lanzamiento

- Activar monitoreo y alertas básicas en Cloud Run
- Evaluar `min instances = 1` si quieren reducir cold starts
- Activar analytics real
- Persistir o integrar correctamente los leads de contacto
- Revisar logs de error las primeras 24-72 horas

## Orden recomendado de ejecución

1. Personalizar branding y contenido
2. Resolver contacto y analytics
3. Deploy inicial a Cloud Run
4. Validar en `run.app`
5. Montar balanceador, certificado y DNS
6. Cambiar `NEXT_PUBLIC_SITE_URL` al dominio final
7. Re-deploy final
8. QA final y apertura pública

## Definición de “bien desplegado”

El sitio queda “properly deployed” cuando cumple estas cuatro condiciones:

- responde por `https://politicamoderna.info`
- tiene SSL válido y renovación automática
- puede redeployarse sin pasos manuales frágiles
- ya no depende de placeholders para marca, contacto y SEO
