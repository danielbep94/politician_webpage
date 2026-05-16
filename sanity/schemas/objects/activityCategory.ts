import { defineField, defineType } from "sanity";

const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 96);

export const activityCategorySchema = defineType({
  name: "activityCategory",
  title: "Activity Category",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        slugify
      },
      validation: (Rule) => Rule.required()
    })
  ],
  preview: {
    select: {
      title: "title",
      slug: "slug.current"
    },
    prepare(selection) {
      return {
        title: selection.title || "Untitled category",
        subtitle: selection.slug ? `/${selection.slug}` : "Missing slug"
      };
    }
  }
});
