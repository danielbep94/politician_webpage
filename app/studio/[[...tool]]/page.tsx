"use client";
/**
 * Sanity Studio embedded route.
 *
 * This catches all paths under /studio/* and renders the Studio
 * using the Next.js App Router + next-sanity pattern.
 *
 * Access: https://politicamoderna.info/studio
 *
 * NOTE: 'use client' is required — NextStudio relies on React Context
 * and browser-only APIs. metadata must therefore live in layout.tsx.
 */
import { NextStudio } from "next-sanity/studio";

import config from "../../../sanity.config";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
