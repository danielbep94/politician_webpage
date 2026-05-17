# Deployment Plan — politicamoderna.info
## Google Cloud Platform — Cost-Optimized Architecture

> Next.js 15 · Sanity CMS · Cloud Run · Artifact Registry · Secret Manager · Domain Mapping
> Updated: 2026-05-16

---

## Architecture — Default Launch Stack

```
Browser
  → politicamoderna.info (DNS CNAME → Cloud Run Domain Mapping)
  → Cloud Run (HTTPS managed by Google, port 8080)
  → Next.js 15 standalone server
  → Sanity CMS (headless API)
```

**Services used at launch:**
- Cloud Run — app hosting
- Artifact Registry — Docker image storage
- Secret Manager — secrets only
- Cloud Run Domain Mapping — custom domain + managed HTTPS

**Explicitly avoided at launch:**
- ❌ Global Load Balancer (~$18–20/month fixed cost)
- ❌ Cloud Armor
- ❌ Cloud CDN
- ❌ Static global IP
- ❌ Serverless NEG
- ❌ Cloud DNS (use your registrar's DNS directly)

**Estimated monthly cost: $0–5/month** at low traffic.

---

## Blockers Fixed ✅

All three pre-deployment blockers have been resolved:

### Fix 1 — `.dockerignore` updated

Added missing exclusions to prevent env file leaks and reduce build context:

```
scripts
.env
.env.local
.env.production.local
.env.development.local
tsconfig.tsbuildinfo
.gcloud
.gcloud-temp
.sanity
coverage
CONTRIBUTING.md
```

### Fix 2 — Placeholder branding removed

`lib/constants/site.ts` fallbacks updated:
- `"Impulso Comunitario"` → `"Política Moderna"`
- `"Impulso"` → `"PM"` (env-driven via `NEXT_PUBLIC_SITE_SHORT_NAME`)

At runtime, `NEXT_PUBLIC_SITE_NAME` in Cloud Run always overrides these fallbacks.

### Fix 3 — Required env vars documented

`NEXT_PUBLIC_SITE_URL` and `REVALIDATE_SECRET` are enforced by `lib/env.ts` at startup in production. They **will throw** if missing. Both must be set before deployment — covered in Phase 3 below.

---

## Phase 1 — Local Validation Before Deploying

**Goal:** Confirm the build is clean before touching GCP.

```bash
# 1. Install dependencies
npm install

# 2. Lint and type-check
npm run lint
npm run typecheck

# 3. Production build
npm run build

# 4. Test standalone locally
PORT=8080 node .next/standalone/server.js &
curl http://localhost:8080/api/health
# → {"status":"ok","sanity":"mock-mode" | "configured","timestamp":"..."}

curl http://localhost:8080/sitemap.xml   # must return XML
curl http://localhost:8080/robots.txt   # must return text

# 5. Test Docker image locally
docker build --platform linux/amd64 -t politicamoderna-test .
docker run -p 8080:8080 --env-file .env.local politicamoderna-test
curl http://localhost:8080/api/health
```

> **Apple Silicon (M1/M2/M3):** Always pass `--platform linux/amd64`. Cloud Run is x86_64.

**Validate these routes manually in the browser:**
- `http://localhost:8080/` — homepage
- `http://localhost:8080/contacto` — contact form
- `http://localhost:8080/sumate` — volunteer form
- `http://localhost:8080/propuestas` — proposals list
- `http://localhost:8080/sobre-mi` — about page

---

## Phase 2 — New Google Cloud Project Setup

**Goal:** Create the project from zero with minimum permissions.

### Prerequisites

```bash
# Verify gcloud is installed
gcloud version

# Log in
gcloud auth login
gcloud auth application-default login

# Find your billing account ID
gcloud billing accounts list
```

### Steps

**2.1 Copy local config files**

```bash
cp config/gcp.env.example config/gcp.env
cp config/cloudrun.env.example.yaml config/cloudrun.env.yaml
```

> Both files are in `.gitignore` — they will never be committed.

**2.2 Fill `config/gcp.env`**

```bash
PROJECT_ID=politicamoderna-prod       # globally unique — add suffix if taken
PROJECT_NAME=Politica Moderna
REGION=us-central1
SERVICE_NAME=politicamoderna-web
ARTIFACT_REPOSITORY=politicamoderna
BILLING_ACCOUNT_ID=XXXXXX-XXXXXX-XXXXXX
DOMAIN_NAME=politicamoderna.info
WWW_DOMAIN_NAME=www.politicamoderna.info
CLOUD_RUN_MIN_INSTANCES=0
CLOUD_RUN_MAX_INSTANCES=5
CLOUD_RUN_MEMORY=512Mi
CLOUD_RUN_CPU=1
```

> **Region:** `us-central1` — lowest cost tier in GCP, wide feature availability.

**2.3 Run the bootstrap script**

```bash
chmod +x scripts/gcp-bootstrap.sh
./scripts/gcp-bootstrap.sh
```

This script:
- Creates the project
- Links your billing account
- Enables required APIs
- Creates the Artifact Registry repository

**APIs enabled:**

| API | Purpose |
|---|---|
| `run.googleapis.com` | Cloud Run |
| `artifactregistry.googleapis.com` | Docker image storage |
| `cloudbuild.googleapis.com` | Remote image build (optional) |
| `iam.googleapis.com` | Service accounts |
| `secretmanager.googleapis.com` | Secrets (add manually — see Phase 3) |

**2.4 Set up a dedicated service account (least privilege)**

```bash
PROJECT_ID=politicamoderna-prod
SA_NAME=politicamoderna-run
SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

# Create the service account
gcloud iam service-accounts create $SA_NAME \
  --display-name="Politica Moderna Cloud Run SA" \
  --project=$PROJECT_ID

# Grant only what the app needs at runtime
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/secretmanager.secretAccessor"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/logging.logWriter"
```

> **Do not grant Owner or Editor to this service account.**

**2.5 Set a budget alert**

Via GCP Console: **Billing → Budgets & alerts → Create budget**
- Budget amount: **$15/month**
- Alert thresholds: 50% ($7.50), 90% ($13.50), 100% ($15)
- Notification: email only, no automatic actions

---

## Phase 3 — Environment Variables and Secrets

**Goal:** Configure all variables correctly before the first deploy.

### Variable Classification

| Variable | Type | Where to set |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public | `cloudrun.env.yaml` |
| `NEXT_PUBLIC_SITE_NAME` | Public | `cloudrun.env.yaml` |
| `NEXT_PUBLIC_TWITTER_HANDLE` | Public | `cloudrun.env.yaml` |
| `NEXT_PUBLIC_GA_ID` | Public | `cloudrun.env.yaml` |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Public | `cloudrun.env.yaml` |
| `NEXT_PUBLIC_SANITY_DATASET` | Public | `cloudrun.env.yaml` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Public | `cloudrun.env.yaml` |
| `NEXT_PUBLIC_SANITY_STUDIO_URL` | Public | `cloudrun.env.yaml` |
| `SANITY_STUDIO_PROJECT_ID` | Public | `cloudrun.env.yaml` |
| `SANITY_STUDIO_DATASET` | Public | `cloudrun.env.yaml` |
| `CONTACT_RECIPIENT_EMAIL` | Low-risk | `cloudrun.env.yaml` |
| `REVALIDATE_SECRET` | **Secret** | Secret Manager |
| `SANITY_API_WRITE_TOKEN` | **Secret** | Secret Manager |

### Fill `config/cloudrun.env.yaml`

```yaml
NEXT_PUBLIC_SITE_URL: "https://politicamoderna.info"
NEXT_PUBLIC_SITE_NAME: "Política Moderna"
NEXT_PUBLIC_TWITTER_HANDLE: "@politicamoderna"
NEXT_PUBLIC_GA_ID: ""
NEXT_PUBLIC_SANITY_PROJECT_ID: "your-sanity-project-id"
NEXT_PUBLIC_SANITY_DATASET: "production"
NEXT_PUBLIC_SANITY_API_VERSION: "2025-02-19"
NEXT_PUBLIC_SANITY_STUDIO_URL: "https://your-studio.sanity.studio"
SANITY_STUDIO_PROJECT_ID: "your-sanity-project-id"
SANITY_STUDIO_DATASET: "production"
CONTACT_RECIPIENT_EMAIL: "equipo@politicamoderna.info"
```

> Leave `NEXT_PUBLIC_GA_ID` empty at launch. Add it once GA4 property is created.

### Store secrets in Secret Manager

```bash
PROJECT_ID=politicamoderna-prod

# Enable Secret Manager API
gcloud services enable secretmanager.googleapis.com --project=$PROJECT_ID

# Generate and store REVALIDATE_SECRET
echo -n "$(openssl rand -base64 32)" | \
  gcloud secrets create REVALIDATE_SECRET \
  --data-file=- \
  --project=$PROJECT_ID

# Store SANITY_API_WRITE_TOKEN
echo -n "your-sanity-write-token-here" | \
  gcloud secrets create SANITY_API_WRITE_TOKEN \
  --data-file=- \
  --project=$PROJECT_ID

# Verify
gcloud secrets list --project=$PROJECT_ID
```

---

## Phase 4 — Docker Build and Artifact Registry

**Goal:** Build and push the production image.

### Steps

**4.1 Authenticate Docker with Artifact Registry**

```bash
gcloud auth configure-docker us-central1-docker.pkg.dev
```

**4.2 Build and push**

```bash
PROJECT_ID=politicamoderna-prod
REGION=us-central1
REPO=politicamoderna
IMAGE=politicamoderna-web
TAG=$(git rev-parse --short HEAD)
FULL_IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO}/${IMAGE}"

docker build \
  --platform linux/amd64 \
  -t "${FULL_IMAGE}:${TAG}" \
  -t "${FULL_IMAGE}:latest" \
  .

docker push "${FULL_IMAGE}:${TAG}"
docker push "${FULL_IMAGE}:latest"
```

**4.3 Set up automatic image cleanup**

Keep only the 5 most recent images to avoid storage creep:

```bash
gcloud artifacts repositories set-cleanup-policies $REPO \
  --location=$REGION \
  --project=$PROJECT_ID \
  --policy='[{
    "name": "keep-5-latest",
    "action": {"type": "Keep"},
    "mostRecentVersions": {"keepCount": 5}
  }]'
```

**Cost:** Artifact Registry charges ~$0.10/GB/month. 5 images × ~500MB = ~$0.25/month.

---

## Phase 5 — Cloud Run Deployment

**Goal:** Deploy to Cloud Run with cost-optimized settings.

### Recommended Cloud Run settings

| Setting | Value | Reason |
|---|---|---|
| CPU | 1 vCPU | Sufficient for Next.js standalone |
| Memory | 512Mi | Lean standalone build |
| Min instances | `0` | Zero idle cost |
| Max instances | `5` | Hard cost cap at launch |
| Concurrency | `80` | Default; good for Next.js |
| Timeout | `60s` | Enough for SSR + Sanity |
| CPU allocation | Request-based | Billed only during requests |
| `--cpu-boost` | enabled | Extra CPU on cold start, no extra cost |

### Deploy command

```bash
PROJECT_ID=politicamoderna-prod
REGION=us-central1
REPO=politicamoderna
IMAGE=politicamoderna-web
TAG=$(git rev-parse --short HEAD)
SA_EMAIL="politicamoderna-run@${PROJECT_ID}.iam.gserviceaccount.com"
FULL_IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO}/${IMAGE}:${TAG}"

gcloud run deploy politicamoderna-web \
  --image="$FULL_IMAGE" \
  --project=$PROJECT_ID \
  --region=$REGION \
  --platform=managed \
  --allow-unauthenticated \
  --service-account=$SA_EMAIL \
  --memory=512Mi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=5 \
  --concurrency=80 \
  --timeout=60 \
  --cpu-boost \
  --port=8080 \
  --env-vars-file=config/cloudrun.env.yaml \
  --update-secrets=REVALIDATE_SECRET=REVALIDATE_SECRET:latest,SANITY_API_WRITE_TOKEN=SANITY_API_WRITE_TOKEN:latest
```

### Validate the Cloud Run service URL

```bash
SERVICE_URL=$(gcloud run services describe politicamoderna-web \
  --region=us-central1 \
  --project=$PROJECT_ID \
  --format='value(status.url)')

echo "Service URL: $SERVICE_URL"

# Health check
curl "${SERVICE_URL}/api/health"
# → {"status":"ok","sanity":"configured","timestamp":"..."}

# Homepage
curl -s -o /dev/null -w "%{http_code}" "${SERVICE_URL}/"
# → 200
```

> Test this `*.run.app` URL thoroughly before mapping the custom domain.

---

## Phase 6 — Domain and DNS — Cloud Run Domain Mapping

**Goal:** Connect `politicamoderna.info` using Cloud Run Domain Mapping (no Load Balancer needed).

### How Domain Mapping works

Cloud Run Domain Mapping:
- Provisions a Google-managed SSL certificate automatically
- Requires a CNAME or A record at your registrar
- Handles HTTPS termination natively
- No extra infrastructure or cost beyond Cloud Run

### Limitation to know

Cloud Run Domain Mapping does **not** support apex domains (`politicamoderna.info`) in all regions directly — it works reliably with `www.politicamoderna.info`. The canonical domain strategy at launch:

- **Canonical:** `https://politicamoderna.info` (apex)
- **www:** Redirect `www` → apex via CNAME flatten or ALIAS at registrar, or handle in middleware

Check if your registrar supports **CNAME flattening / ALIAS records at the apex** (Cloudflare, Namecheap, and most modern registrars do).

### Steps

**6.1 Verify domain ownership in Google Cloud**

```bash
# Via Console: Cloud Run → Domain Mappings → Add mapping
# Or via gcloud:
gcloud beta run domain-mappings create \
  --service=politicamoderna-web \
  --domain=politicamoderna.info \
  --region=us-central1 \
  --project=$PROJECT_ID
```

If this is your first domain mapping, Google will ask you to verify domain ownership via **Google Search Console** or a TXT DNS record.

**Verify via TXT record (recommended):**
1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add property → Domain → `politicamoderna.info`
3. Copy the TXT record value
4. Add to your registrar: `TXT @ "google-site-verification=..."`
5. Wait ~5 minutes, click Verify

**6.2 Create domain mappings for both apex and www**

```bash
# Map apex domain
gcloud beta run domain-mappings create \
  --service=politicamoderna-web \
  --domain=politicamoderna.info \
  --region=us-central1 \
  --project=$PROJECT_ID

# Map www
gcloud beta run domain-mappings create \
  --service=politicamoderna-web \
  --domain=www.politicamoderna.info \
  --region=us-central1 \
  --project=$PROJECT_ID
```

**6.3 Get required DNS records**

```bash
gcloud beta run domain-mappings describe politicamoderna.info \
  --region=us-central1 \
  --project=$PROJECT_ID
```

This outputs the DNS records to set. Typically:

| Type | Host | Value |
|---|---|---|
| CNAME | `www` | `ghs.googlehosted.com.` |
| A | `@` | `216.239.32.21` (one of four Google IPs) |
| A | `@` | `216.239.34.21` |
| A | `@` | `216.239.36.21` |
| A | `@` | `216.239.38.21` |

> Use the exact records returned by the command above — IPs may differ.

**6.4 Set DNS records at your registrar**

Add every record returned by the `describe` command. Set TTL to 300 (5 minutes) for faster propagation.

**6.5 Wait for certificate provisioning**

```bash
# Monitor certificate status
gcloud beta run domain-mappings describe politicamoderna.info \
  --region=us-central1 \
  --project=$PROJECT_ID \
  --format='value(status.resourceRecords,status.conditions)'
```

- DNS propagation: 5–30 minutes typically (up to 48h)
- Certificate provisioning: 10–60 minutes after DNS resolves

**6.6 Verify HTTPS**

```bash
curl -I https://politicamoderna.info
# → HTTP/2 200

curl -I https://www.politicamoderna.info
# → HTTP/2 308 Location: https://politicamoderna.info/
# (www → apex redirect handled by Next.js middleware)

curl -I http://politicamoderna.info
# → HTTP/2 301 https://politicamoderna.info/
# (HTTP → HTTPS handled by Cloud Run domain mapping)
```

**6.7 Redeploy with final domain**

Once `https://politicamoderna.info` is live, confirm `cloudrun.env.yaml` has:

```yaml
NEXT_PUBLIC_SITE_URL: "https://politicamoderna.info"
```

Then redeploy to regenerate sitemap, robots.txt, OG URLs, and canonical tags with the final domain:

```bash
./scripts/deploy-cloud-run.sh
```

---

## Phase 7 — Security

**Goal:** Harden headers and protect secrets.

### Add HSTS header to `next.config.ts`

The current `next.config.ts` is missing HSTS. Add it to the `securityHeaders` array:

```ts
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // Add:
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];
```

### Security checklist

| Item | Status |
|---|---|
| `X-Frame-Options: DENY` | ✅ Already in `next.config.ts` |
| `X-Content-Type-Options` | ✅ Already in `next.config.ts` |
| `Referrer-Policy` | ✅ Already in `next.config.ts` |
| `HSTS` | ⚠️ Add (see above) |
| Non-root Docker user | ✅ `appuser` in Dockerfile |
| Form honeypot | ✅ Noted in README |
| Zod input validation | ✅ All API routes |
| Rate limiting (5/15min) | ✅ In-memory per IP |
| `REVALIDATE_SECRET` in Secret Manager | ✅ Phase 3 |
| `SANITY_API_WRITE_TOKEN` in Secret Manager | ✅ Phase 3 |
| `.env.local` gitignored | ✅ `.gitignore` |
| `cloudrun.env.yaml` gitignored | ✅ `.gitignore` |

### Rate limiter note

The in-memory rate limiter (`lib/rate-limit.ts`) resets on cold starts and is not shared across instances. With `min-instances=0` and `max-instances=5` this is acceptable for launch — a form spammer would only get 5 extra requests per cold start. Document this as a known limitation; upgrade to Redis if abuse becomes a real problem.

### Sanity revalidate webhook security

The `/api/revalidate` route requires `Authorization: Bearer <REVALIDATE_SECRET>`. Never expose this token in Sanity's dashboard description field or logs.

---

## Phase 8 — Monitoring

**Goal:** Lightweight observability with zero extra cost.

### Cloud Run built-in logs

```bash
# Tail logs for the service
gcloud logging read \
  "resource.type=cloud_run_revision \
  AND resource.labels.service_name=politicamoderna-web \
  AND severity>=WARNING" \
  --project=politicamoderna-prod \
  --limit=50 \
  --format=json
```

### Set log retention to 30 days

GCP default is 30 days for `_Default` bucket — verify and set explicitly:

```bash
gcloud logging buckets update _Default \
  --location=global \
  --retention-days=30 \
  --project=politicamoderna-prod
```

### Optional free uptime check

Via GCP Console: **Monitoring → Uptime checks → Create uptime check**
- Resource type: URL
- URL: `https://politicamoderna.info/api/health`
- Frequency: every 5 minutes
- Alert policy: notify if down for > 5 consecutive minutes

Cost: Free (up to 3 uptime checks per project).

### Monthly review checklist

- [ ] Check Cloud Run metrics: request count, error rate, latency (P95)
- [ ] Check billing dashboard — confirm under $10/month
- [ ] Clean old Artifact Registry images if cleanup policy missed any
- [ ] Check Secret Manager — confirm no unauthorized access
- [ ] Review error logs for any 5xx spikes

---

## Phase 9 — Post-Deployment Validation Checklist

Run after the domain is live.

### Automated smoke tests

```bash
BASE=https://politicamoderna.info

echo "=== Pages ==="
for PATH in / /sobre-mi /propuestas /noticias /actividades /agenda /contacto /sumate /gracias; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${BASE}${PATH}")
  echo "$STATUS $PATH"
done

echo "=== SEO files ==="
curl -s -o /dev/null -w "%{http_code}" $BASE/sitemap.xml
curl -s -o /dev/null -w "%{http_code}" $BASE/robots.txt

echo "=== API ==="
curl -s $BASE/api/health | python3 -m json.tool

echo "=== Redirects ==="
curl -s -o /dev/null -w "HTTP→HTTPS: %{http_code} %{redirect_url}\n" http://politicamoderna.info/
curl -s -o /dev/null -w "www→apex: %{http_code} %{redirect_url}\n" https://www.politicamoderna.info/
```

### Manual checklist

- [ ] Homepage loads — no placeholder branding visible
- [ ] Contact form submits successfully, shows confirmation
- [ ] Volunteer form submits successfully, shows confirmation
- [ ] Sanity content loads (or mock fallback is intentional — check `sanity` field in `/api/health`)
- [ ] No `[contact-message]` or `[volunteer-lead]` in Cloud Run logs (means Sanity write token is working)
- [ ] Mobile layout correct at 375px and 768px
- [ ] Browser tab shows `Política Moderna` in title
- [ ] Open Graph image appears when sharing URL in WhatsApp
- [ ] `sitemap.xml` references `https://politicamoderna.info` (not localhost or run.app)
- [ ] `robots.txt` sitemap URL references final domain
- [ ] Green padlock in browser — HTTPS valid
- [ ] Cloud Run shows **0 active instances** after 5 minutes of no traffic
- [ ] Budget alert not triggered

### Set up Sanity webhook

In Sanity dashboard: **API → Webhooks → Add webhook**

```
Name: Revalidate Cache
URL: https://politicamoderna.info/api/revalidate
HTTP Method: POST
Headers:
  Authorization: Bearer <value of REVALIDATE_SECRET>
Trigger on: Create, Update, Delete (published documents)
```

Test it:

```bash
REVALIDATE_SECRET=$(gcloud secrets versions access latest \
  --secret=REVALIDATE_SECRET --project=politicamoderna-prod)

curl -s -X POST https://politicamoderna.info/api/revalidate \
  -H "Authorization: Bearer ${REVALIDATE_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{"_type":"post","slug":"test-slug"}' | python3 -m json.tool
```

---

## Estimated Monthly Cost

| Service | Configuration | Est. Cost |
|---|---|---|
| Cloud Run | 0 min instances, ~1K req/day | $0–2 |
| Artifact Registry | 5 images × ~500MB | $0.25 |
| Secret Manager | 2 secrets, low access | $0.10 |
| Cloud Build | ~5 builds/month | $0 (free tier) |
| Cloud Logging | 30-day retention, low volume | $0 |
| Domain Mapping | Included in Cloud Run | $0 |
| **Total** | | **< $5/month** |

> No Load Balancer = no $18–20/month fixed charge. The trade-off is no global anycast CDN and no advanced traffic routing — not needed at launch.

---

## Upgrade Path (Post-Launch, When Needed)

If traffic grows significantly or you need a CDN:

1. Reserve a global static IP
2. Create a serverless NEG for the Cloud Run service
3. Create a Global External Application Load Balancer
4. Attach Cloud CDN to the backend
5. Create a Google-managed SSL certificate
6. Delete Cloud Run domain mapping
7. Update DNS A records to the static IP

This is a non-breaking migration — the app code does not change.

---

## Quick Reference — All Commands

```bash
# --- Setup ---
cp config/gcp.env.example config/gcp.env
cp config/cloudrun.env.example.yaml config/cloudrun.env.yaml
# fill in both files

# --- Bootstrap GCP project ---
./scripts/gcp-bootstrap.sh

# --- Build and push Docker image ---
gcloud auth configure-docker us-central1-docker.pkg.dev
TAG=$(git rev-parse --short HEAD)
docker build --platform linux/amd64 \
  -t us-central1-docker.pkg.dev/politicamoderna-prod/politicamoderna/politicamoderna-web:$TAG .
docker push us-central1-docker.pkg.dev/politicamoderna-prod/politicamoderna/politicamoderna-web:$TAG

# --- Deploy to Cloud Run ---
./scripts/deploy-cloud-run.sh

# --- Map custom domain ---
gcloud beta run domain-mappings create \
  --service=politicamoderna-web \
  --domain=politicamoderna.info \
  --region=us-central1

# --- Get DNS records to set ---
gcloud beta run domain-mappings describe politicamoderna.info --region=us-central1

# --- Check service URL ---
gcloud run services describe politicamoderna-web --region=us-central1 --format='value(status.url)'

# --- View logs ---
gcloud logging read "resource.type=cloud_run_revision AND severity>=WARNING" \
  --project=politicamoderna-prod --limit=50

# --- Rollback to previous revision ---
gcloud run services update-traffic politicamoderna-web \
  --to-revisions=PREV_REVISION=100 --region=us-central1

# --- Read a secret (for testing) ---
gcloud secrets versions access latest --secret=REVALIDATE_SECRET --project=politicamoderna-prod

# --- Update a secret ---
echo -n "new-value" | gcloud secrets versions add REVALIDATE_SECRET \
  --data-file=- --project=politicamoderna-prod
```
