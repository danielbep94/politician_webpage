# Política Moderna — Plataforma de Campaña

[![CI](https://github.com/politicamoderna/politician_webpage/actions/workflows/ci.yml/badge.svg)](https://github.com/politicamoderna/politician_webpage/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8?logo=tailwindcss)](https://tailwindcss.com)
[![Sanity CMS](https://img.shields.io/badge/Sanity-3.57-F03E2F?logo=sanity)](https://www.sanity.io)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](https://www.docker.com)
[![Cloud Run](https://img.shields.io/badge/Google_Cloud_Run-Ready-4285F4?logo=googlecloud)](https://cloud.google.com/run)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

Plataforma institucional y de campaña para conectar propuestas claras con participación ciudadana real. Construida con Next.js 15, Sanity CMS y desplegada en Google Cloud Run.

**Sitio en producción:** [politicamoderna.info](https://politicamoderna.info)

---

## Demo

> 🚧 Demo deployment coming soon.

---

## Stack técnico

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 15 (App Router) |
| Lenguaje | TypeScript 5 |
| Estilos | Tailwind CSS 3 |
| CMS | Sanity v3 (headless) |
| Email | Resend |
| Validación | Zod |
| Contenedores | Docker (Alpine, multi-stage) |
| Despliegue | Google Cloud Run |
| Secretos | Google Cloud Secret Manager (JSON bundle) |
| Análisis | Google Analytics 4 (opcional) |

---

## Arquitectura

```
Browser
  │
  ▼
Cloud Run (HTTPS, port 8080)
  │
  ▼
Next.js 15 — App Router
  ├── Server Components (SSG + ISR)
  ├── API Routes (/api/contact, /api/volunteers, /api/health, /api/revalidate)
  └── Client Components (Header, Forms, BackToTop, StickyMobileCta)
  │
  ▼
Sanity CMS (headless)
  └── Webhook → POST /api/revalidate → tag-based ISR
  │
  ▼
Google Cloud Secret Manager
  └── APP_SECRETS (JSON bundle) → lib/secrets.ts → route handlers
```

---

## Características principales

- **Homepage** con hero, prioridades numeradas, propuestas destacadas, noticias, agenda y CTAs de conversión.
- **Páginas institucionales**: sobre mí, propuestas, noticias, actividades, agenda, prensa, contacto, súmate, aviso de privacidad.
- **Rutas dinámicas** con breadcrumbs y JSON-LD para propuestas, noticias y actividades.
- **Formularios** con validación Zod, honeypot anti-bot, rate limiting por IP (5 req/15 min), y consentimiento de privacidad.
- **Seguridad**: cabeceras HTTP (X-Frame-Options, CSP, HSTS, Referrer-Policy), Docker no-root, env validation en startup.
- **Accesibilidad**: skip-to-content, `aria-current`, `aria-live`, `aria-describedby`, `prefers-reduced-motion`.
- **SEO**: Open Graph, Twitter Cards, schema.org JSON-LD (Organization, Person, Article, Proposal, BreadcrumbList), sitemap.xml, robots.txt.
- **Secretos consolidados**: un único JSON secret en GCP Secret Manager — ver `lib/secrets.ts`.
- **Mock content**: funciona completamente sin Sanity configurado — ideal para prototipos y demos.
- **CI/CD**: GitHub Actions (lint + typecheck + build), Dockerfile multi-stage, `.dockerignore`, `.env.example`.

---

## Quick Start

```bash
# 1. Clonar y configurar entorno
cp .env.example .env.local
# Edita .env.local con tus valores

# 2. Instalar dependencias
npm install

# 3. Iniciar en modo desarrollo
npm run dev
```

El sitio queda disponible en [http://localhost:3000](http://localhost:3000).  
Sin Sanity configurado, usa datos mock automáticamente.

---

## Variables de entorno

Copia `.env.example` como `.env.local`:

```bash
# ── Sitio ────────────────────────────────────────────
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Política Moderna
NEXT_PUBLIC_TWITTER_HANDLE=@politicamoderna

# ── Analytics (opcional) ─────────────────────────────
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# ── Sanity CMS (opcional — sin esto se usan datos mock) ──
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-02-19
NEXT_PUBLIC_SANITY_STUDIO_URL=https://tu-estudio.sanity.studio
SANITY_STUDIO_PROJECT_ID=
SANITY_STUDIO_DATASET=production

# ── Secretos de servidor ─────────────────────────────
SANITY_API_WRITE_TOKEN=          # Token de escritura de Sanity (para webhooks y leads)
REVALIDATE_SECRET=               # Secreto compartido para el webhook de revalidación ISR
RESEND_API_KEY=re_xxxx           # API key de Resend para emails transaccionales
CONTACT_RECIPIENT_EMAIL=equipo@politicamoderna.info

# ── GCP (producción) ─────────────────────────────────
# En Cloud Run los secretos se cargan desde Secret Manager como APP_SECRETS (JSON).
# Ver lib/secrets.ts y docs/gcp-secrets-migration.md para más detalles.
```

> **En producción** todos los secretos de servidor se cargan desde un único JSON secret
> en GCP Secret Manager (`APP_SECRETS`). Ver [`lib/secrets.ts`](./lib/secrets.ts) y
> [`docs/gcp-secrets-migration.md`](./docs/gcp-secrets-migration.md).

---

## Scripts disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción (standalone)
npm run lint         # ESLint
npm run typecheck    # TypeScript (sin emitir)
npm run seed:sanity  # Carga datos iniciales en Sanity
```

---

## Estructura del proyecto

```text
app/                    # Rutas y páginas (Next.js App Router)
  api/                  # Endpoints: contact, volunteers, health, revalidate
  [ruta]/               # Páginas: inicio, sobre-mi, propuestas, noticias...
  studio/               # Sanity Studio embebido (/studio)
components/
  layout/               # Header, Footer, Container, SectionHeader, Analytics
  home/                 # Secciones del homepage
  forms/                # ContactForm, VolunteerForm
  ui/                   # Button, Card, Badge, Input, Breadcrumbs, BackToTop
  seo/                  # PageIntro, StructuredData
lib/
  sanity/               # Cliente, queries, tags de caché, imagen
  seo/                  # Metadata helper, JSON-LD builders
  validation/           # Schemas Zod (contact, volunteer)
  analytics/            # trackEvent()
  secrets.ts            # Carga y cachea secretos desde GCP o env vars
  env.ts                # Validación de variables de entorno al iniciar
  rate-limit.ts         # Rate limiter en memoria (IP-based)
  constants/            # site.ts, navigation.ts, mock-content.ts
sanity/schemas/         # Modelos de contenido CMS
scripts/                # Bootstrap GCP, deploy Cloud Run, seed Sanity
config/                 # Ejemplos de configuración (nunca subas los archivos reales)
docs/                   # Documentación técnica y guías de marketing
public/                 # Assets estáticos
.github/                # CI, templates de PR e issues
```

---

## Despliegue con Docker

```bash
# Build local
docker build --platform linux/amd64 -t politicamoderna-web .

# Ejecutar (pasar variables de entorno desde archivo)
docker run -p 8080:8080 --env-file .env.local politicamoderna-web
```

---

## Despliegue en Google Cloud Run

Para un despliegue completo desde cero, sigue la guía paso a paso:

```
docs/deployment-plan-gcp-complete.md
```

```bash
# Bootstrap del proyecto GCP (solo la primera vez)
cp config/gcp.env.example config/gcp.env         # llenar con tus valores
cp config/cloudrun.env.example.yaml config/cloudrun.env.yaml
./scripts/gcp-bootstrap.sh

# Deploy con Cloud Build
./scripts/deploy-cloud-run.sh
```

### Health check

```
GET /api/health
→ { "status": "ok", "timestamp": "...", "sanity": "configured" | "mock-mode" }
```

---

## Gestión de secretos (GCP)

Los secretos de servidor (`SANITY_API_WRITE_TOKEN`, `REVALIDATE_SECRET`, `RESEND_API_KEY`) se almacenan en **Google Cloud Secret Manager** como un único JSON bundle bajo el nombre `APP_SECRETS`.

El módulo [`lib/secrets.ts`](./lib/secrets.ts) los carga con el siguiente orden de prioridad:

1. **`APP_SECRETS` env var** — JSON montado por Cloud Run (producción)
2. **GCP Secret Manager API** — acceso directo vía ADC (fallback producción)
3. **Variables de entorno individuales** — desarrollo local

Ver la guía completa de secretos en [`docs/gcp-secrets-migration.md`](./docs/gcp-secrets-migration.md).

---

## Sanity CMS

Los modelos incluidos son: `siteSettings`, `candidate`, `proposal`, `post`, `event`, `activity`, `pressRelease`, `mediaAsset`, `faq`, `contactMessage`, `volunteerLead`.

**Studio:** `https://politicamoderna.info/studio` (embebido en la app).

**Webhook de revalidación:** `POST /api/revalidate` — invalida caché por tags cuando Sanity publica cambios. Requiere `REVALIDATE_SECRET`. Ver [`docs/sanity-webhooks.md`](./docs/sanity-webhooks.md).

**Guía para el equipo de marketing:** [`docs/guia-sanity-equipo-mkt.md`](./docs/guia-sanity-equipo-mkt.md)

---

## Documentación

| Documento | Descripción |
|---|---|
| [`docs/guia-sanity-equipo-mkt.md`](./docs/guia-sanity-equipo-mkt.md) | Guía de uso del CMS para el equipo de marketing |
| [`docs/guia-visual-actualizacion-contenido.md`](./docs/guia-visual-actualizacion-contenido.md) | Guía visual paso a paso para actualizar contenido |
| [`docs/deployment-plan-gcp-complete.md`](./docs/deployment-plan-gcp-complete.md) | Plan de despliegue completo en GCP |
| [`docs/gcp-secrets-migration.md`](./docs/gcp-secrets-migration.md) | Migración a secreto JSON consolidado |
| [`docs/gcp-secrets-validation.md`](./docs/gcp-secrets-validation.md) | Plan de validación de secretos GCP |
| [`docs/gcp-secrets-rollback.md`](./docs/gcp-secrets-rollback.md) | Procedimiento de rollback de secretos |
| [`docs/sanity-webhooks.md`](./docs/sanity-webhooks.md) | Configuración de webhooks de Sanity |
| [`docs/architecture.md`](./docs/architecture.md) | Arquitectura detallada del sistema |

---

## Contribuir

Ver [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## Licencia

[MIT](./LICENSE)
