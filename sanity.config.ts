import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";

import { schemaTypes } from "./sanity/schemas";
import {
  singletonActions,
  singletonTypes,
  studioStructure
} from "./sanity/studio-structure";

export default defineConfig({
  name: "default",
  title: "Política Moderna CMS",
  basePath: "/studio",
  projectId:
    process.env.SANITY_STUDIO_PROJECT_ID ||
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
    "",
  dataset:
    process.env.SANITY_STUDIO_DATASET ||
    process.env.NEXT_PUBLIC_SANITY_DATASET ||
    "production",
  plugins: [
    deskTool({
      structure: studioStructure
    })
  ],
  document: {
    actions: (previousActions, context) => {
      const schemaType = context.schemaType;

      if (!schemaType || !singletonTypes.has(schemaType)) {
        return previousActions;
      }

      return previousActions.filter((action) =>
        Boolean(action.action && singletonActions.has(action.action))
      );
    }
  },
  schema: {
    templates: (templates) =>
      templates.filter(
        (template) => !template.schemaType || !singletonTypes.has(template.schemaType)
      ),
    types: schemaTypes
  }
});
