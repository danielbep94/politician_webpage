# Arquitectura propuesta

## Capas

- `app/`: rutas públicas y endpoints API con App Router.
- `components/`: presentación modular por dominio.
- `lib/`: integración con CMS, SEO, validación, analytics y constantes.
- `sanity/`: modelo de contenido y queries desacopladas.
- `config/`: ejemplos de despliegue y CI/CD.
- `scripts/`: utilidades como seed de contenido.

## Estrategia de contenido

- El sitio funciona hoy con `mock-content` para acelerar desarrollo.
- Cuando Sanity esté configurado, `lib/sanity/api.ts` puede resolver desde el CMS usando las mismas interfaces de datos.
- El formulario de voluntariado ya puede persistir documentos `volunteerLead` si existe token de escritura.

## Escalabilidad

- Los componentes están separados por vertical para evitar páginas monolíticas.
- La metadata SEO vive fuera de las páginas para mantener consistencia.
- La estructura ya soporta CI/CD con Docker y Cloud Build.
