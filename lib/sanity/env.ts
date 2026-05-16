export const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-02-19",
  studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || "",
  writeToken: process.env.SANITY_API_WRITE_TOKEN || ""
};

export const isSanityConfigured = Boolean(
  sanityConfig.projectId && sanityConfig.dataset
);
