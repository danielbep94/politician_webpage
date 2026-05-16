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
PROJECT_NAME="${PROJECT_NAME:-}"
REGION="${REGION:-us-central1}"
SERVICE_NAME="${SERVICE_NAME:-politicamoderna-web}"
ARTIFACT_REPOSITORY="${ARTIFACT_REPOSITORY:-politicamoderna}"
BILLING_ACCOUNT_ID="${BILLING_ACCOUNT_ID:-}"
DOMAIN_NAME="${DOMAIN_NAME:-politicamoderna.info}"
DNS_ZONE_NAME="${DNS_ZONE_NAME:-}"
CREATE_DNS_ZONE="${CREATE_DNS_ZONE:-false}"

require_var() {
  local name="$1"
  if [[ -z "${!name:-}" ]]; then
    echo "Missing required variable: $name" >&2
    exit 1
  fi
}

ensure_active_account() {
  local active_account
  active_account="$(gcloud auth list --filter=status:ACTIVE --format='value(account)' | head -n 1)"

  if [[ -z "$active_account" ]]; then
    echo "No active gcloud account found. Run: gcloud auth login" >&2
    exit 1
  fi

  echo "Using gcloud account: $active_account"
}

project_exists() {
  gcloud projects describe "$PROJECT_ID" >/dev/null 2>&1
}

repository_exists() {
  gcloud artifacts repositories describe "$ARTIFACT_REPOSITORY" \
    --location="$REGION" >/dev/null 2>&1
}

dns_zone_exists() {
  gcloud dns managed-zones describe "$DNS_ZONE_NAME" >/dev/null 2>&1
}

require_var PROJECT_ID
require_var PROJECT_NAME

ensure_active_account

if project_exists; then
  echo "Project already exists: $PROJECT_ID"
else
  echo "Creating project: $PROJECT_ID"
  gcloud projects create "$PROJECT_ID" --name="$PROJECT_NAME"
fi

echo "Setting active project"
gcloud config set project "$PROJECT_ID" >/dev/null
gcloud config set run/region "$REGION" >/dev/null

if [[ -n "$BILLING_ACCOUNT_ID" ]]; then
  echo "Linking billing account"
  gcloud billing projects link "$PROJECT_ID" \
    --billing-account="$BILLING_ACCOUNT_ID"
else
  echo "Skipping billing link because BILLING_ACCOUNT_ID is empty"
fi

echo "Enabling required services"
gcloud services enable \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  compute.googleapis.com \
  dns.googleapis.com \
  iam.googleapis.com \
  run.googleapis.com

if repository_exists; then
  echo "Artifact Registry repository already exists: $ARTIFACT_REPOSITORY"
else
  echo "Creating Artifact Registry repository: $ARTIFACT_REPOSITORY"
  gcloud artifacts repositories create "$ARTIFACT_REPOSITORY" \
    --repository-format=docker \
    --location="$REGION" \
    --description="Container images for $SERVICE_NAME"
fi

if [[ "$CREATE_DNS_ZONE" == "true" ]]; then
  require_var DNS_ZONE_NAME

  if dns_zone_exists; then
    echo "Cloud DNS managed zone already exists: $DNS_ZONE_NAME"
  else
    echo "Creating Cloud DNS managed zone: $DNS_ZONE_NAME"
    gcloud dns managed-zones create "$DNS_ZONE_NAME" \
      --dns-name="${DOMAIN_NAME}." \
      --description="DNS zone for $DOMAIN_NAME"
  fi
fi

echo
echo "Bootstrap complete."
echo "Next steps:"
echo "1. Review config/cloudrun.env.yaml"
echo "2. Run ./scripts/deploy-cloud-run.sh"
echo "3. Run ./scripts/setup-load-balancer.sh"
