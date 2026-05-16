# Politician Webpage

Starter profesional para una web institucional-campaña híbrida construida con Next.js, TypeScript, Tailwind CSS y Sanity CMS. La base está pensada para visibilidad pública, contacto ciudadano y captación de voluntarios, con una arquitectura lista para evolucionar hacia CI/CD con Google Cloud Build y despliegue en Google Cloud Run.

## Stack

- Next.js con App Router
- TypeScript
- Tailwind CSS
- Sanity CMS como headless CMS
- Docker para despliegue en Cloud Run
- Dominio externo conectable desde Google Cloud DNS o cualquier registrador

## Qué incluye

- Home con hero, prioridades, propuestas destacadas, noticias, agenda y CTAs de conversión.
- Páginas institucionales: sobre mí, propuestas, noticias, agenda, prensa, contacto, súmate y gracias.
- Rutas dinámicas para propuestas y noticias.
- Formularios funcionales con validación básica y endpoints API.
- Schemas y queries de Sanity.
- Mock content para seguir desarrollando sin depender del CMS desde el día uno.
- Dockerfile, `.dockerignore`, `.env.example` y ejemplo de `Cloud Build`.

## Estructura

```text
app/
components/
config/
docs/
lib/
public/
sanity/
scripts/
styles/
```

## Variables de entorno

Duplica `.env.example` como `.env.local` y completa:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Impulso Comunitario
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-02-19
NEXT_PUBLIC_SANITY_STUDIO_URL=
SANITY_API_WRITE_TOKEN=
REVALIDATE_SECRET=
CONTACT_RECIPIENT_EMAIL=equipo@impulsocomunitario.mx
```

## Instalación

```bash
npm install
```

## Desarrollo local

```bash
npm run dev
```

El sitio queda disponible en [http://localhost:3000](http://localhost:3000).

## Validación y calidad

```bash
npm run lint
npm run typecheck
```

## Seed de contenido en Sanity

Si ya configuraste proyecto, dataset y token de escritura:

```bash
npm run seed:sanity
```

## Despliegue con Docker

Construcción local:

```bash
docker build -t politician-webpage .
docker run -p 8080:8080 politician-webpage
```

## Despliegue en Google Cloud Run

1. Crea el proyecto en Google Cloud.
2. Habilita Cloud Run y Artifact Registry.
3. Configura variables de entorno del servicio.
4. Usa el `Dockerfile` incluido.
5. Toma como base `config/cloudbuild.example.yaml` para tu pipeline CI/CD.
6. Si quieres iniciar desde cero con un proyecto nuevo, usa `docs/google-cloud-from-scratch.md`.

Ejemplo de despliegue manual:

```bash
gcloud run deploy politician-webpage \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

## Dominio y producción

Para un despliegue productivo con dominio propio, TLS y DNS bien resueltos, usa el plan detallado en `docs/deployment-plan-politicamoderna.md`.
Si además quieres bootstrap completo desde un proyecto nuevo de Google Cloud, sigue `docs/google-cloud-from-scratch.md`.

## Sanity CMS

Los modelos incluidos son:

- `siteSettings`
- `candidate`
- `proposal`
- `post`
- `event`
- `activity`
- `pressRelease`
- `mediaAsset`
- `faq`
- `contactMessage`
- `volunteerLead`

Mientras Sanity no esté configurado, el frontend utiliza datos mock desde `lib/constants/mock-content.ts`.

## Webhook de revalidación

La ruta `POST /api/revalidate` permite invalidar caché por tags y rutas cuando Sanity publica cambios.

- Documentación operativa: `docs/sanity-webhooks.md`
- Variable requerida: `REVALIDATE_SECRET`

## Próximos pasos recomendados

- Integrar Sanity Studio en una ruta protegida o proyecto separado.
- Conectar contacto ciudadano a CRM, email transaccional o automatización.
- Agregar analytics reales y eventos de conversión.
- Añadir tests de componentes y validación de formularios.
- Configurar pipeline formal de Cloud Build y entornos por rama.
