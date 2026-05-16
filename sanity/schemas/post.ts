import { defineField, defineType } from "sanity";

const formatPublishedAt = (value?: string) => {
  if (!value) {
    return "Fecha pendiente";
  }

  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(value));
};

export const postSchema = defineType({
  name: "post",
  title: "Noticia",
  type: "document",
  groups: [
    { name: "editorial", title: "Editorial", default: true },
    { name: "distribution", title: "Distribucion" }
  ],
  initialValue: () => ({
    publishedAt: new Date().toISOString(),
    featured: false
  }),
  fields: [
    defineField({
      name: "title",
      title: "Titulo",
      type: "string",
      group: "editorial",
      description: "Titular principal de la pieza editorial.",
      validation: (Rule) => Rule.required().min(8).max(120)
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "editorial",
      description: "URL pública de la noticia.",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "excerpt",
      title: "Extracto",
      type: "text",
      rows: 3,
      group: "editorial",
      description: "Resumen corto para cards, listados y metadata.",
      validation: (Rule) => Rule.required().min(30).max(220)
    }),
    defineField({
      name: "body",
      title: "Cuerpo",
      type: "blockContent",
      group: "editorial",
      description: "Contenido principal con texto enriquecido, imagen o video embebido.",
      validation: (Rule) => Rule.required().min(1)
    }),
    defineField({
      name: "category",
      title: "Categoria",
      type: "string",
      group: "distribution",
      description: "Etiqueta editorial visible en listados y navegación contextual.",
      validation: (Rule) => Rule.required().min(3).max(60)
    }),
    defineField({
      name: "publishedAt",
      title: "Publicado el",
      type: "datetime",
      group: "distribution",
      description: "Fecha editorial de publicación.",
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "readingTime",
      title: "Tiempo de lectura",
      type: "string",
      group: "distribution",
      description: "Texto corto, por ejemplo: 4 min.",
      validation: (Rule) => Rule.required().max(20)
    }),
    defineField({
      name: "featured",
      title: "Destacar en módulos curados",
      type: "boolean",
      group: "distribution",
      initialValue: false
    })
  ],
  preview: {
    select: {
      title: "title",
      category: "category",
      publishedAt: "publishedAt"
    },
    prepare(selection) {
      const metadata = [
        selection.category,
        formatPublishedAt(selection.publishedAt)
      ].filter(Boolean);

      return {
        title: selection.title || "Noticia sin titulo",
        subtitle: metadata.join(" · ")
      };
    }
  }
});
