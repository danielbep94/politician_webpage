import { defineField, defineType } from "sanity";

export const seoSchema = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  initialValue: {
    noindex: false
  },
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta Title",
      type: "string",
      validation: (Rule) => Rule.max(60).warning("Try to keep the meta title under 60 characters.")
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      rows: 3,
      validation: (Rule) =>
        Rule.max(160).warning("Try to keep the meta description under 160 characters.")
    }),
    defineField({
      name: "ogImage",
      title: "Open Graph Image",
      type: "imageWithAlt"
    }),
    defineField({
      name: "canonical",
      title: "Canonical URL",
      type: "url",
      validation: (Rule) =>
        Rule.uri({
          scheme: ["http", "https"]
        })
    }),
    defineField({
      name: "noindex",
      title: "Noindex",
      type: "boolean",
      initialValue: false,
      description: "Prevent this document from being indexed by search engines."
    })
  ],
  preview: {
    select: {
      title: "metaTitle",
      noindex: "noindex"
    },
    prepare(selection) {
      return {
        title: selection.title || "SEO settings",
        subtitle: selection.noindex ? "Noindex enabled" : "Indexable"
      };
    }
  }
});
