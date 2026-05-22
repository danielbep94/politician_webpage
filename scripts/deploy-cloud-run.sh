#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${1:-"$ROOT_DIR/config/gcp.env"}"
CLOUD_RUN_ENV_FILE="${CLOUD_RUN_ENV_FILE:-"$ROOT_DIR/config/cloudrun.env.yaml"}"

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
CLOUD_RUN_MEMORY="${CLOUD_RUN_MEMORY:-512Mi}"
CLOUD_RUN_CPU="${CLOUD_RUN_CPU:-1}"
CLOUD_RUN_MIN_INSTANCES="${CLOUD_RUN_MIN_INSTANCES:-0}"
CLOUD_RUN_MAX_INSTANCES="${CLOUD_RUN_MAX_INSTANCES:-10}"

require_var() {
  local name="$1"
  if [[ -z "${!name:-}" ]]; then
    echo "Missing required variable: $name" >&2
    exit 1
  fi
}

require_var PROJECT_ID

if [[ ! -f "$CLOUD_RUN_ENV_FILE" ]]; then
  echo "Missing Cloud Run env file: $CLOUD_RUN_ENV_FILE" >&2
  exit 1
fi

CLOUD_BUILD_CONFIG="${CLOUD_BUILD_CONFIG:-"$ROOT_DIR/config/cloudbuild.yaml"}"

if [[ ! -f "$CLOUD_BUILD_CONFIG" ]]; then
  echo "Missing Cloud Build config: $CLOUD_BUILD_CONFIG" >&2
  exit 1
fi

echo "Submitting Cloud Build for service: $SERVICE_NAME"
# $COMMIT_SHA is only available in triggered builds; derive it locally for manual runs.
COMMIT_SHA="$(git -C "$ROOT_DIR" rev-parse --short HEAD 2>/dev/null || echo "manual")"

gcloud builds submit "$ROOT_DIR" \
  --project="$PROJECT_ID" \
  --region="$REGION" \
  --config="$CLOUD_BUILD_CONFIG" \
  --substitutions="COMMIT_SHA=${COMMIT_SHA}"

SERVICE_URL="$(CLOUDSDK_CONFIG="${CLOUDSDK_CONFIG}" gcloud run services describe "$SERVICE_NAME" \
  --project="$PROJECT_ID" \
  --region="$REGION" \
  --format='value(status.url)')"

echo
echo "Cloud Run deploy complete."
echo "Service URL: $SERVICE_URL"
