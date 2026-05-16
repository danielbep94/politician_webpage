# Revalidación on-demand con Sanity

## Variable requerida

Agrega esta variable a `.env.local` y a tu entorno de despliegue:

```bash
REVALIDATE_SECRET=tu-secreto-largo-y-unico
```

## Endpoint del proyecto

- URL local: `http://localhost:3000/api/revalidate`
- URL productiva: `https://tu-dominio.com/api/revalidate`

## Autenticación del webhook

Configura el webhook de Sanity con este header HTTP:

```text
Authorization: Bearer <REVALIDATE_SECRET>
```

## Método recomendado

- Método: `POST`

## Filtro sugerido

Este filtro limita la revalidación a los tipos públicos del sitio:

```groq
_type in [
  "siteSettings",
  "candidate",
  "proposal",
  "post",
  "event",
  "activity",
  "pressRelease",
  "mediaAsset",
  "faq"
]
```

## Proyección sugerida

Usa una proyección tolerante a create, update y delete para que la route siempre reciba `_type` y `slug` cuando existan.

```groq
{
  "_id": coalesce(after()._id, before()._id),
  "_type": coalesce(after()._type, before()._type),
  "slug": coalesce(after().slug.current, before().slug.current)
}
```

La documentación oficial de Sanity sobre webhooks y proyecciones GROQ confirma que los webhooks aceptan filtros y proyecciones, y que `before()` / `after()` son válidos en este contexto:

- [GROQ-powered webhooks](https://www.sanity.io/docs/content-lake/webhooks)
- [Projections in GROQ-powered webhooks](https://www.sanity.io/docs/developer-guides/projections-in-groq-powered-webhooks)

## Qué invalida la route

La route usa `revalidateTag()` como mecanismo principal y `revalidatePath()` como refuerzo en rutas clave.

- `siteSettings` revalida `/`
- `candidate` revalida `/`, `/sobre-mi` y `/contacto`
- `proposal` revalida tags de colección/documento y las rutas `/`, `/propuestas`, `/propuestas/[slug]`, `/sitemap.xml`
- `post` revalida tags de colección/documento y las rutas `/`, `/noticias`, `/noticias/[slug]`, `/sitemap.xml`
- `event` revalida `/` y `/agenda`
- `activity` revalida tags de colección/documento y las rutas `/`, `/actividades`, `/actividades/[slug]`, `/sitemap.xml`
- `pressRelease` y `mediaAsset` revalidan `/prensa`

Esto cubre también home y sitemap, no solo `/actividades`, porque la capa de datos ya etiqueta los fetches por colección y documento.

## Tags usados por la app

Tags base por colección:

- `sanity`
- `siteSettings`
- `candidate`
- `proposals`
- `posts`
- `events`
- `activities`
- `pressReleases`
- `mediaAssets`
- `faqs`

Tags por documento:

- `proposal:<slug>`
- `post:<slug>`
- `event:<slug>`
- `activity:<slug>`
- `pressRelease:<slug>`

## Pruebas manuales

Revalidar una colección manualmente:

```bash
curl "http://localhost:3000/api/revalidate?secret=TU_SECRETO&tag=activities"
```

Simular un webhook:

```bash
curl -X POST "http://localhost:3000/api/revalidate" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_SECRETO" \
  -d '{
    "_type": "activity",
    "slug": "asamblea-vecinal-agenda-movilidad-segura"
  }'
```
