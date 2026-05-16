# Impulso Comunitario — Plataforma de Campaña

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8?logo=tailwindcss)](https://tailwindcss.com)
[![Sanity CMS](https://img.shields.io/badge/Sanity-3.57-F03E2F?logo=sanity)](https://www.sanity.io)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](https://www.docker.com)
[![Cloud Run](https://img.shields.io/badge/Google_Cloud_Run-Ready-4285F4?logo=googlecloud)](https://cloud.google.com/run)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

Plataforma institucional y de campaña para conectar propuestas claras con participación ciudadana real. Construida con Next.js 15, Sanity CMS y desplegada en Google Cloud Run.

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
| Validación | Zod |
| Contenedores | Docker (Alpine, multi-stage) |
| Despliegue | Google Cloud Run |
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
```

---

## Características principales

- **Homepage** con hero, prioridades numeradas, propuestas destacadas, noticias, agenda y CTAs de conversión.
- **Páginas institucionales**: sobre mí, propuestas, noticias, actividades, agenda, prensa, contacto, súmate, aviso de privacidad.
- **Rutas dinámicas** con breadcrumbs y JSON-LD para propuestas, noticias y actividades.
- **Formularios** con validación Zod, honeypot anti-bot, rate limiting por IP (5 req/15 min), y consentimiento de privacidad.
- **Seguridad**: cabeceras HTTP (X-Frame-Options, CSP, Referrer-Policy), Docker no-root, env validation en startup.
- **Accesibilidad**: skip-to-content, `aria-current`, `aria-live`, `aria-describedby`, `prefers-reduced-motion`.
- **SEO**: Open Graph, Twitter Cards, schema.org JSON-LD (Organization, Person, Article, Proposal, BreadcrumbList), sitemap.xml, robots.txt.
- **Mock content**: funciona completamente sin Sanity configurado — ideal para prototipos y demos.
- **CI/CD ready**: Dockerfile multi-stage, `.dockerignore`, `cloudbuild.example.yaml`, `.env.example`.

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
# Sitio
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Impulso Comunitario
NEXT_PUBLIC_TWITTER_HANDLE=@impulsocomunitario

# Analytics (opcional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Sanity CMS (opcional — sin esto se usan datos mock)
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-02-19
SANITY_API_WRITE_TOKEN=

# Webhooks y API
REVALIDATE_SECRET=replace-with-a-long-random-secret
CONTACT_RECIPIENT_EMAIL=equipo@impulsocomunitario.mx
```

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
  rate-limit.ts         # Rate limiter en memoria (IP-based)
  env.ts                # Validación de variables de entorno al iniciar
  constants/            # site.ts, navigation.ts, mock-content.ts
sanity/schemas/         # Modelos de contenido
public/                 # Assets estáticos
```

---

## Despliegue con Docker

```bash
# Build local
docker build -t politician-webpage .

# Ejecutar (pasar variables de entorno desde archivo)
docker run -p 8080:8080 --env-file .env.local politician-webpage
```

---

## Despliegue en Google Cloud Run

```bash
gcloud run deploy politician-webpage \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080
```

Para CI/CD completo con Cloud Build, usa `config/cloudbuild.example.yaml`.  
Para bootstrap desde cero, sigue `docs/google-cloud-from-scratch.md`.

### Health check (Cloud Run probes)

```
GET /api/health
→ { "status": "ok", "timestamp": "...", "sanity": "configured" | "mock-mode" }
```

---

## Sanity CMS

Los modelos incluidos son: `siteSettings`, `candidate`, `proposal`, `post`, `event`, `activity`, `pressRelease`, `mediaAsset`, `faq`, `contactMessage`, `volunteerLead`.

**Webhook de revalidación:** `POST /api/revalidate` — invalida caché por tags cuando Sanity publica cambios. Requiere `REVALIDATE_SECRET`. Ver `docs/sanity-webhooks.md`.

---

## Contribuir

Ver [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## Licencia

[MIT](./LICENSE)
