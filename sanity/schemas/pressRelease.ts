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

export const pressReleaseSchema = defineType({
  name: "pressRelease",
  title: "Comunicado",
  type: "document",
  groups: [
    { name: "editorial", title: "Editorial", default: true },
    { name: "distribution", title: "Distribucion" },
    { name: "legacy", title: "Legacy" }
  ],
  initialValue: () => ({
    publishedAt: new Date().toISOString()
  }),
  fields: [
    defineField({
      name: "title",
      title: "Titulo",
      type: "string",
      group: "editorial",
      description: "Nombre público del comunicado.",
      validation: (Rule) => Rule.required().min(8).max(120)
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "editorial",
      description: "Identificador para consultas y futuras rutas públicas.",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "excerpt",
      title: "Extracto",
      type: "text",
      rows: 3,
      group: "editorial",
      description: "Resumen corto para cards y listados.",
      validation: (Rule) => Rule.required().min(30).max(220)
    }),
    defineField({
      name: "publishedAt",
      title: "Publicado el",
      type: "datetime",
      group: "editorial",
      description: "Fecha editorial de publicación del comunicado.",
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "summary",
      title: "Resumen extendido",
      type: "text",
      rows: 5,
      group: "editorial",
      description: "Bajada más amplia para contexto editorial y prensa.",
      validation: (Rule) => Rule.required().min(40).max(500)
    }),
    defineField({
      name: "downloadFile",
      title: "Archivo descargable",
      type: "file",
      group: "distribution",
      options: {
        accept: ".pdf,.doc,.docx,.txt"
      },
      description: "Archivo oficial del comunicado. Reemplaza gradualmente la URL legacy.",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const file = value as { asset?: unknown } | undefined;
          const legacyUrl = (context.document as { downloadUrl?: string } | undefined)?.downloadUrl;

          if (file?.asset || legacyUrl?.trim()) {
            return true;
          }

          return "Adjunta un archivo o conserva temporalmente la URL legacy mientras se completa la migracion.";
        })
    }),
    defineField({
      name: "downloadUrl",
      title: "Download URL (legacy)",
      type: "string",
      group: "legacy",
      hidden: true
    })
  ],
  preview: {
    select: {
      title: "title",
      publishedAt: "publishedAt"
    },
    prepare(selection) {
      return {
        title: selection.title || "Comunicado sin titulo",
        subtitle: formatPublishedAt(selection.publishedAt)
      };
    }
  }
});
