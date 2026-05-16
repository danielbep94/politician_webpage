import { defineField, defineType } from "sanity";

export const imageWithAltSchema = defineType({
  name: "imageWithAlt",
  title: "Image with Alt",
  type: "image",
  options: {
    hotspot: true
  },
  fields: [
    defineField({
      name: "alt",
      title: "Alt Text",
      type: "string",
      description: "Describe the image for accessibility and social previews.",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { asset?: unknown } | undefined;
          const altText = typeof value === "string" ? value.trim() : "";

          if (parent?.asset && typeof value !== "string") {
            return "Alt text is required when an image is present.";
          }

          if (parent?.asset && altText.length === 0) {
            return "Alt text is required when an image is present.";
          }

          return true;
        })
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      description: "Optional short caption shown near the image."
    })
  ],
  preview: {
    select: {
      title: "alt",
      media: "asset"
    },
    prepare(selection) {
      return {
        title: selection.title || "Image without alt text",
        media: selection.media
      };
    }
  }
});
