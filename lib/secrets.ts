/**
 * lib/secrets.ts
 *
 * Single source of truth for all server-side credentials.
 *
 * Runtime resolution order:
 *  1. `APP_SECRETS` env var  — JSON string mounted by Cloud Run from Secret Manager
 *  2. GCP Secret Manager API — direct access (uses Application Default Credentials)
 *  3. Individual process.env  — local development fallback
 *
 * The result is module-level cached after the first call so Secret Manager
 * is only hit once per cold start, not on every request.
 */

import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AppSecrets {
  site: {
    url: string;
    name: string;
    twitterHandle: string;
  };
  sanity: {
    projectId: string;
    dataset: string;
    apiVersion: string;
    writeToken: string;
    revalidateSecret: string;
  };
  resend: {
    apiKey: string;
    fromAddress: string;
    teamEmail: string;
  };
  analytics: {
    gaId: string;
  };
}

// ── Cache ─────────────────────────────────────────────────────────────────────

let _cached: AppSecrets | null = null;

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Returns the full set of app secrets.
 * Safe to call multiple times — result is cached after first resolution.
 */
export async function getSecrets(): Promise<AppSecrets> {
  if (_cached) return _cached;

  // Path 1: Cloud Run mounts the JSON as an env var (fastest, no extra API call)
  if (process.env.APP_SECRETS) {
    try {
      _cached = JSON.parse(process.env.APP_SECRETS) as AppSecrets;
      return _cached;
    } catch {
      console.error("[secrets] APP_SECRETS is set but is not valid JSON — falling through.");
    }
  }

  // Path 2: Production — fetch directly from Secret Manager via ADC
  if (process.env.NODE_ENV === "production") {
    const client = new SecretManagerServiceClient();
    const project = process.env.GOOGLE_CLOUD_PROJECT ?? "politicamoderna-prod";
    const name = `projects/${project}/secrets/app-secrets/versions/latest`;

    try {
      const [version] = await client.accessSecretVersion({ name });
      const raw = version.payload?.data?.toString() ?? "{}";
      _cached = JSON.parse(raw) as AppSecrets;
      return _cached;
    } catch (err) {
      console.error("[secrets] Failed to load from Secret Manager:", err);
      // Fall through to env-var fallback so the server doesn't crash on startup
    }
  }

  // Path 3: Development — assemble from individual env vars
  _cached = buildFromEnv();
  return _cached;
}

/**
 * Synchronous convenience getter for the cached secrets.
 * Only safe to call AFTER an initial `await getSecrets()` has completed
 * (e.g., from within a route handler that already awaited it).
 * Throws if called before the cache is warm.
 */
export function getCachedSecrets(): AppSecrets {
  if (!_cached) {
    throw new Error(
      "[secrets] getCachedSecrets() called before getSecrets() resolved. " +
        "Await getSecrets() at least once before using the synchronous getter."
    );
  }
  return _cached;
}

// ── Internal ──────────────────────────────────────────────────────────────────

function buildFromEnv(): AppSecrets {
  return {
    site: {
      url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001",
      name: process.env.NEXT_PUBLIC_SITE_NAME ?? "Política Moderna",
      twitterHandle: process.env.NEXT_PUBLIC_TWITTER_HANDLE ?? "@PoliticaModerna"
    },
    sanity: {
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-02-19",
      writeToken: process.env.SANITY_API_WRITE_TOKEN ?? "",
      revalidateSecret: process.env.REVALIDATE_SECRET ?? ""
    },
    resend: {
      apiKey: process.env.RESEND_API_KEY ?? "",
      fromAddress: "noreply@politicamoderna.info",
      teamEmail: process.env.CONTACT_RECIPIENT_EMAIL ?? "equipo@politicamoderna.info"
    },
    analytics: {
      gaId: process.env.NEXT_PUBLIC_GA_ID ?? ""
    }
  };
}
