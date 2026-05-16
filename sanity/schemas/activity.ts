import { defineField, defineType } from "sanity";

const todayDate = () => new Date().toISOString().slice(0, 10);

const formatActivityDate = (value?: string) => {
  if (!value) {
    return "Date pending";
  }

  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(`${value}T00:00:00.000Z`));
};

export const activitySchema = defineType({
  name: "activity",
  title: "Activity",
  type: "document",
  groups: [
    { name: "editorial", title: "Editorial", default: true },
    { name: "media", title: "Media" },
    { name: "relations", title: "Relations" },
    { name: "seo", title: "SEO" }
  ],
  initialValue: () => ({
    activityDate: todayDate(),
    publishedAt: new Date().toISOString(),
    featured: false,
    seo: {
      noindex: false
    }
  }),
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "editorial",
      validation: (Rule) => Rule.required().min(8).max(120)
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "editorial",
      description: "Public URL for the activity detail page.",
      options: {
        source: "title",
        maxLength: 96
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 4,
      group: "editorial",
      description: "Short summary used in cards, listings and previews.",
      validation: (Rule) => Rule.required().min(40).max(240)
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
      group: "editorial",
      description: "Main narrative of the activity with rich content blocks.",
      validation: (Rule) => Rule.required().min(1)
    }),
    defineField({
      name: "activityDate",
      title: "Activity Date",
      type: "date",
      group: "editorial",
      description: "Date when the activity actually happened.",
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (!value) {
            return "Activity date is required.";
          }

          if (value > todayDate()) {
            return "Activity date cannot be in the future for an activity record.";
          }

          return true;
        })
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      group: "editorial",
      description: "Controls editorial publication timing.",
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      group: ["editorial", "relations"],
      description: "Place where the activity occurred.",
      validation: (Rule) => Rule.required().min(3).max(120)
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      group: "editorial",
      description: "Use one or more editorial categories for filtering and context.",
      of: [{ type: "activityCategory" }],
      validation: (Rule) => Rule.required().min(1).unique()
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      group: "editorial",
      description: "Highlight this activity in curated modules.",
      initialValue: false
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "imageWithAlt",
      group: "media",
      description: "Primary visual used in cards, SEO and article headers.",
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      group: "media",
      description: "Optional supporting images for the activity detail page.",
      of: [{ type: "imageWithAlt" }],
      validation: (Rule) => Rule.max(12)
    }),
    defineField({
      name: "video",
      title: "Video",
      type: "videoEmbed",
      group: "media",
      description: "Optional embedded video related to the activity."
    }),
    defineField({
      name: "sourceEvent",
      title: "Source Event",
      type: "reference",
      group: "relations",
      description: "Optional agenda event that originated this activity.",
      to: [{ type: "event" }],
      weak: true
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo"
    })
  ],
  preview: {
    select: {
      title: "title",
      activityDate: "activityDate",
      featured: "featured",
      location: "location",
      category: "categories.0.title",
      media: "coverImage"
    },
    prepare(selection) {
      const dateLabel = formatActivityDate(selection.activityDate);
      const metadata = [dateLabel, selection.location, selection.category].filter(Boolean);

      return {
        title: selection.featured ? `${selection.title} · Featured` : selection.title,
        subtitle: metadata.join(" · "),
        media: selection.media
      };
    }
  }
});
