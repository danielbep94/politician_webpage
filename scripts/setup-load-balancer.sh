#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${1:-"$ROOT_DIR/config/gcp.env"}"

if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

export CLOUDSDK_CONFIG="${CLOUDSDK_CONFIG:-"$ROOT_DIR/.gcloud"}"
mkdir -p "$CLOUDSDK_CONFIG"

PROJECT_ID="${PROJECT_ID:-}"
REGION="${REGION:-us-central1}"
SERVICE_NAME="${SERVICE_NAME:-politicamoderna-web}"
DOMAIN_NAME="${DOMAIN_NAME:-politicamoderna.info}"
WWW_DOMAIN_NAME="${WWW_DOMAIN_NAME:-www.${DOMAIN_NAME}}"
DNS_ZONE_NAME="${DNS_ZONE_NAME:-}"
UPSERT_DNS_RECORDS="${UPSERT_DNS_RECORDS:-false}"

GLOBAL_IP_NAME="${GLOBAL_IP_NAME:-${SERVICE_NAME}-ip}"
NEG_NAME="${NEG_NAME:-${SERVICE_NAME}-neg}"
BACKEND_SERVICE_NAME="${BACKEND_SERVICE_NAME:-${SERVICE_NAME}-backend}"
HTTPS_URL_MAP_NAME="${HTTPS_URL_MAP_NAME:-${SERVICE_NAME}-https-map}"
HTTP_REDIRECT_URL_MAP_NAME="${HTTP_REDIRECT_URL_MAP_NAME:-${SERVICE_NAME}-http-redirect-map}"
SSL_CERTIFICATE_NAME="${SSL_CERTIFICATE_NAME:-${SERVICE_NAME}-cert}"
TARGET_HTTPS_PROXY_NAME="${TARGET_HTTPS_PROXY_NAME:-${SERVICE_NAME}-https-proxy}"
TARGET_HTTP_PROXY_NAME="${TARGET_HTTP_PROXY_NAME:-${SERVICE_NAME}-http-proxy}"
HTTPS_FORWARDING_RULE_NAME="${HTTPS_FORWARDING_RULE_NAME:-${SERVICE_NAME}-https-rule}"
HTTP_FORWARDING_RULE_NAME="${HTTP_FORWARDING_RULE_NAME:-${SERVICE_NAME}-http-rule}"

require_var() {
  local name="$1"
  if [[ -z "${!name:-}" ]]; then
    echo "Missing required variable: $name" >&2
    exit 1
  fi
}

resource_exists() {
  local cmd=("$@")
  "${cmd[@]}" >/dev/null 2>&1
}

require_var PROJECT_ID
require_var DOMAIN_NAME

echo "Verifying Cloud Run service exists"
gcloud run services describe "$SERVICE_NAME" \
  --project="$PROJECT_ID" \
  --region="$REGION" >/dev/null

if resource_exists gcloud compute addresses describe "$GLOBAL_IP_NAME" --global --project="$PROJECT_ID"; then
  echo "Global IP already exists: $GLOBAL_IP_NAME"
else
  echo "Creating global IP: $GLOBAL_IP_NAME"
  gcloud compute addresses create "$GLOBAL_IP_NAME" \
    --project="$PROJECT_ID" \
    --global \
    --ip-version=IPV4
fi

GLOBAL_IP_ADDRESS="$(gcloud compute addresses describe "$GLOBAL_IP_NAME" \
  --project="$PROJECT_ID" \
  --global \
  --format='value(address)')"

if resource_exists gcloud compute network-endpoint-groups describe "$NEG_NAME" \
  --project="$PROJECT_ID" \
  --region="$REGION"; then
  echo "Serverless NEG already exists: $NEG_NAME"
else
  echo "Creating serverless NEG: $NEG_NAME"
  gcloud compute network-endpoint-groups create "$NEG_NAME" \
    --project="$PROJECT_ID" \
    --region="$REGION" \
    --network-endpoint-type=SERVERLESS \
    --cloud-run-service="$SERVICE_NAME"
fi

if resource_exists gcloud compute backend-services describe "$BACKEND_SERVICE_NAME" \
  --project="$PROJECT_ID" \
  --global; then
  echo "Backend service already exists: $BACKEND_SERVICE_NAME"
else
  echo "Creating backend service: $BACKEND_SERVICE_NAME"
  gcloud compute backend-services create "$BACKEND_SERVICE_NAME" \
    --project="$PROJECT_ID" \
    --global \
    --load-balancing-scheme=EXTERNAL_MANAGED
fi

ATTACHED_NEGS="$(gcloud compute backend-services describe "$BACKEND_SERVICE_NAME" \
  --project="$PROJECT_ID" \
  --global \
  --format='value(backends[].group)' 2>/dev/null || true)"

if grep -q "/${NEG_NAME}$" <<<"$ATTACHED_NEGS"; then
  echo "Serverless NEG already attached to backend service"
else
  echo "Attaching serverless NEG to backend service"
  gcloud compute backend-services add-backend "$BACKEND_SERVICE_NAME" \
    --project="$PROJECT_ID" \
    --global \
    --network-endpoint-group="$NEG_NAME" \
    --network-endpoint-group-region="$REGION"
fi

if resource_exists gcloud compute url-maps describe "$HTTPS_URL_MAP_NAME" \
  --project="$PROJECT_ID" \
  --global; then
  echo "Updating HTTPS URL map: $HTTPS_URL_MAP_NAME"
  gcloud compute url-maps set-default-service "$HTTPS_URL_MAP_NAME" \
    --project="$PROJECT_ID" \
    --global \
    --default-service="$BACKEND_SERVICE_NAME"
else
  echo "Creating HTTPS URL map: $HTTPS_URL_MAP_NAME"
  gcloud compute url-maps create "$HTTPS_URL_MAP_NAME" \
    --project="$PROJECT_ID" \
    --global \
    --default-service="$BACKEND_SERVICE_NAME"
fi

if resource_exists gcloud compute ssl-certificates describe "$SSL_CERTIFICATE_NAME" \
  --project="$PROJECT_ID" \
  --global; then
  echo "Managed SSL certificate already exists: $SSL_CERTIFICATE_NAME"
else
  echo "Creating managed SSL certificate: $SSL_CERTIFICATE_NAME"
  gcloud compute ssl-certificates create "$SSL_CERTIFICATE_NAME" \
    --project="$PROJECT_ID" \
    --global \
    --domains="$DOMAIN_NAME,$WWW_DOMAIN_NAME"
fi

if resource_exists gcloud compute target-https-proxies describe "$TARGET_HTTPS_PROXY_NAME" \
  --project="$PROJECT_ID" \
  --global; then
  echo "Updating HTTPS target proxy: $TARGET_HTTPS_PROXY_NAME"
  gcloud compute target-https-proxies update "$TARGET_HTTPS_PROXY_NAME" \
    --project="$PROJECT_ID" \
    --global \
    --url-map="$HTTPS_URL_MAP_NAME" \
    --ssl-certificates="$SSL_CERTIFICATE_NAME" \
    --global-ssl-certificates
else
  echo "Creating HTTPS target proxy: $TARGET_HTTPS_PROXY_NAME"
  gcloud compute target-https-proxies create "$TARGET_HTTPS_PROXY_NAME" \
    --project="$PROJECT_ID" \
    --global \
    --url-map="$HTTPS_URL_MAP_NAME" \
    --ssl-certificates="$SSL_CERTIFICATE_NAME"
fi

if resource_exists gcloud compute forwarding-rules describe "$HTTPS_FORWARDING_RULE_NAME" \
  --project="$PROJECT_ID" \
  --global; then
  echo "HTTPS forwarding rule already exists: $HTTPS_FORWARDING_RULE_NAME"
else
  echo "Creating HTTPS forwarding rule: $HTTPS_FORWARDING_RULE_NAME"
  gcloud compute forwarding-rules create "$HTTPS_FORWARDING_RULE_NAME" \
    --project="$PROJECT_ID" \
    --global \
    --load-balancing-scheme=EXTERNAL_MANAGED \
    --network-tier=PREMIUM \
    --address="$GLOBAL_IP_NAME" \
    --target-https-proxy="$TARGET_HTTPS_PROXY_NAME" \
    --ports=443
fi

HTTP_REDIRECT_MAP_FILE="$(mktemp)"
cat >"$HTTP_REDIRECT_MAP_FILE" <<EOF
kind: compute#urlMap
name: ${HTTP_REDIRECT_URL_MAP_NAME}
defaultUrlRedirect:
  redirectResponseCode: MOVED_PERMANENTLY_DEFAULT
  httpsRedirect: true
tests:
  - description: Redirect HTTP to HTTPS
    host: ${DOMAIN_NAME}
    path: /test/
    expectedOutputUrl: https://${DOMAIN_NAME}/test/
    expectedRedirectResponseCode: 301
EOF

echo "Validating HTTP redirect URL map"
gcloud compute url-maps validate --project="$PROJECT_ID" --source="$HTTP_REDIRECT_MAP_FILE"

echo "Importing HTTP redirect URL map: $HTTP_REDIRECT_URL_MAP_NAME"
gcloud compute url-maps import "$HTTP_REDIRECT_URL_MAP_NAME" \
  --project="$PROJECT_ID" \
  --global \
  --quiet \
  --source="$HTTP_REDIRECT_MAP_FILE"

rm -f "$HTTP_REDIRECT_MAP_FILE"

if resource_exists gcloud compute target-http-proxies describe "$TARGET_HTTP_PROXY_NAME" \
  --project="$PROJECT_ID" \
  --global; then
  echo "Updating HTTP target proxy: $TARGET_HTTP_PROXY_NAME"
  gcloud compute target-http-proxies update "$TARGET_HTTP_PROXY_NAME" \
    --project="$PROJECT_ID" \
    --global \
    --url-map="$HTTP_REDIRECT_URL_MAP_NAME"
else
  echo "Creating HTTP target proxy: $TARGET_HTTP_PROXY_NAME"
  gcloud compute target-http-proxies create "$TARGET_HTTP_PROXY_NAME" \
    --project="$PROJECT_ID" \
    --global \
    --url-map="$HTTP_REDIRECT_URL_MAP_NAME"
fi

if resource_exists gcloud compute forwarding-rules describe "$HTTP_FORWARDING_RULE_NAME" \
  --project="$PROJECT_ID" \
  --global; then
  echo "HTTP forwarding rule already exists: $HTTP_FORWARDING_RULE_NAME"
else
  echo "Creating HTTP forwarding rule: $HTTP_FORWARDING_RULE_NAME"
  gcloud compute forwarding-rules create "$HTTP_FORWARDING_RULE_NAME" \
    --project="$PROJECT_ID" \
    --global \
    --load-balancing-scheme=EXTERNAL_MANAGED \
    --network-tier=PREMIUM \
    --address="$GLOBAL_IP_NAME" \
    --target-http-proxy="$TARGET_HTTP_PROXY_NAME" \
    --ports=80
fi

if [[ "$UPSERT_DNS_RECORDS" == "true" && -n "$DNS_ZONE_NAME" ]]; then
  echo "Upserting Cloud DNS A records in zone: $DNS_ZONE_NAME"

  if resource_exists gcloud dns record-sets describe "${DOMAIN_NAME}." \
    --project="$PROJECT_ID" \
    --zone="$DNS_ZONE_NAME" \
    --type=A; then
    gcloud dns record-sets update "${DOMAIN_NAME}." \
      --project="$PROJECT_ID" \
      --zone="$DNS_ZONE_NAME" \
      --type=A \
      --ttl=300 \
      --rrdatas="$GLOBAL_IP_ADDRESS"
  else
    gcloud dns record-sets create "${DOMAIN_NAME}." \
      --project="$PROJECT_ID" \
      --zone="$DNS_ZONE_NAME" \
      --type=A \
      --ttl=300 \
      --rrdatas="$GLOBAL_IP_ADDRESS"
  fi

  if resource_exists gcloud dns record-sets describe "${WWW_DOMAIN_NAME}." \
    --project="$PROJECT_ID" \
    --zone="$DNS_ZONE_NAME" \
    --type=A; then
    gcloud dns record-sets update "${WWW_DOMAIN_NAME}." \
      --project="$PROJECT_ID" \
      --zone="$DNS_ZONE_NAME" \
      --type=A \
      --ttl=300 \
      --rrdatas="$GLOBAL_IP_ADDRESS"
  else
    gcloud dns record-sets create "${WWW_DOMAIN_NAME}." \
      --project="$PROJECT_ID" \
      --zone="$DNS_ZONE_NAME" \
      --type=A \
      --ttl=300 \
      --rrdatas="$GLOBAL_IP_ADDRESS"
  fi
fi

echo
echo "Load balancer setup complete."
echo "Global IP: $GLOBAL_IP_ADDRESS"
echo "Create or verify these DNS A records:"
echo "  ${DOMAIN_NAME} -> ${GLOBAL_IP_ADDRESS}"
echo "  ${WWW_DOMAIN_NAME} -> ${GLOBAL_IP_ADDRESS}"
echo "Wait for the managed certificate to become ACTIVE before final QA."
