import { defineField, defineType } from "sanity";

export const videoEmbedSchema = defineType({
  name: "videoEmbed",
  title: "Video Embed",
  type: "object",
  fields: [
    defineField({
      name: "provider",
      title: "Provider",
      type: "string",
      initialValue: "youtube",
      options: {
        layout: "radio",
        list: [
          { title: "YouTube", value: "youtube" },
          { title: "Vimeo", value: "vimeo" },
          { title: "Facebook", value: "facebook" },
          { title: "Instagram", value: "instagram" },
          { title: "Other", value: "other" }
        ]
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "url",
      title: "Video URL",
      type: "url",
      description: "Paste the public video URL.",
      validation: (Rule) =>
        Rule.required().uri({
          scheme: ["http", "https"]
        })
    }),
    defineField({
      name: "title",
      title: "Internal Title",
      type: "string",
      description: "Optional label to help editors identify the video."
    })
  ],
  preview: {
    select: {
      provider: "provider",
      title: "title",
      url: "url"
    },
    prepare(selection) {
      const label = selection.provider
        ? `${selection.provider.charAt(0).toUpperCase()}${selection.provider.slice(1)} video`
        : "Embedded video";

      return {
        title: selection.title || label,
        subtitle: selection.url
      };
    }
  }
});
