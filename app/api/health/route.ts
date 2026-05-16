import { NextResponse } from "next/server";

import { isSanityConfigured } from "@/lib/sanity/env";

/**
 * Health check endpoint for Cloud Run startup and liveness probes.
 * Returns 200 with service status.
 * Reference in Cloud Run config: --startup-probe path=/api/health
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    sanity: isSanityConfigured ? "configured" : "mock-mode",
    version: process.env.npm_package_version ?? "unknown"
  });
}
