/**
 * lib/env.ts — Build-time environment variable validation.
 * Imported in app/layout.tsx to fail fast on missing required config.
 * All NEXT_PUBLIC_ vars are optional but warn in development.
 */

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `[env] Missing required environment variable: ${key}\n` +
      `Copy .env.example to .env.local and fill in the required values.`
    );
  }
  return value;
}

function warnIfMissing(key: string, label: string) {
  if (process.env.NODE_ENV === "development" && !process.env[key]) {
    console.warn(`[env] Optional variable not set: ${key} (${label})`);
  }
}

// Validate at module load time — throws during `next build` if missing
export const env = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || "Política Moderna",
  // These are optional — fallback to mock mode when absent
  sanityProjectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  sanityDataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  gaId: process.env.NEXT_PUBLIC_GA_ID
} as const;

// Warn in development about missing optional vars
if (process.env.NODE_ENV === "development") {
  warnIfMissing("NEXT_PUBLIC_GA_ID", "Google Analytics — analytics will be disabled");
  warnIfMissing("NEXT_PUBLIC_SANITY_PROJECT_ID", "Sanity CMS — using mock data");
  warnIfMissing("REVALIDATE_SECRET", "Sanity webhooks will fail without this");
  warnIfMissing("SANITY_API_WRITE_TOKEN", "Volunteer & contact leads will only be logged, not persisted");
  warnIfMissing("RESEND_API_KEY", "Confirmation emails will not be sent");
}

// In production, enforce the minimum required vars
if (process.env.NODE_ENV === "production") {
  requireEnv("NEXT_PUBLIC_SITE_URL");
  requireEnv("REVALIDATE_SECRET");
  requireEnv("SANITY_API_WRITE_TOKEN");
  requireEnv("RESEND_API_KEY");
}
