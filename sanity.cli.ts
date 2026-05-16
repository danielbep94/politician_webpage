import { loadEnvConfig } from "@next/env";
import { defineCliConfig } from "sanity/cli";

loadEnvConfig(process.cwd());

export default defineCliConfig({
  api: {
    projectId:
      process.env.SANITY_STUDIO_PROJECT_ID ||
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
      "",
    dataset:
      process.env.SANITY_STUDIO_DATASET ||
      process.env.NEXT_PUBLIC_SANITY_DATASET ||
      "production"
  }
});
