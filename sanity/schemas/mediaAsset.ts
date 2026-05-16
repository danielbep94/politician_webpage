import { defineField, defineType } from "sanity";

const mediaKindOptions = [
  { title: "Fotografia", value: "photo" },
  { title: "Logotipo", value: "logo" },
  { title: "Documento", value: "document" }
];

export const mediaAssetSchema = defineType({
  name: "mediaAsset",
  title: "Kit de prensa",
  type: "document",
  groups: [
    { name: "editorial", title: "Editorial", default: true },
    { name: "media", title: "Asset" },
    { name: "legacy", title: "Legacy" }
  ],
  initialValue: {
    kind: "photo"
  },
  fields: [
    defineField({
      name: "title",
      title: "Titulo",
      type: "string",
      group: "editorial",
      description: "Nombre corto para identificar el asset en el kit de prensa.",
      validation: (Rule) => Rule.required().min(3).max(100)
    }),
    defineField({
      name: "kind",
      title: "Tipo de asset",
      type: "string",
      group: "editorial",
      options: {
        list: mediaKindOptions,
        layout: "radio"
      },
      description: "Define si el recurso es imagen o documento descargable.",
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "description",
      title: "Descripcion",
      type: "text",
      rows: 3,
      group: "editorial",
      description: "Contexto breve para editores y medios sobre el uso recomendado del asset.",
      validation: (Rule) => Rule.required().min(20).max(220)
    }),
    defineField({
      name: "image",
      title: "Imagen nativa",
      type: "imageWithAlt",
      group: "media",
      hidden: ({ document }) => document?.kind === "document",
      description: "Usa este campo para fotografias o logotipos.",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const kind = (context.document as { kind?: string } | undefined)?.kind;
          const image = value as { asset?: unknown } | undefined;
          const legacyUrl = (context.document as { fileUrl?: string } | undefined)?.fileUrl;

          if (kind === "document") {
            return true;
          }

          if (image?.asset || legacyUrl?.trim()) {
            return true;
          }

          return "Carga una imagen o conserva temporalmente la URL legacy mientras se completa la migracion.";
        })
    }),
    defineField({
      name: "file",
      title: "Archivo nativo",
      type: "file",
      group: "media",
      hidden: ({ document }) => document?.kind !== "document",
      options: {
        accept: ".pdf,.doc,.docx,.txt,.zip"
      },
      description: "Usa este campo para documentos descargables del kit de prensa.",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const kind = (context.document as { kind?: string } | undefined)?.kind;
          const file = value as { asset?: unknown } | undefined;
          const legacyUrl = (context.document as { fileUrl?: string } | undefined)?.fileUrl;

          if (kind !== "document") {
            return true;
          }

          if (file?.asset || legacyUrl?.trim()) {
            return true;
          }

          return "Adjunta un archivo o conserva temporalmente la URL legacy mientras se completa la migracion.";
        })
    }),
    defineField({
      name: "fileUrl",
      title: "File URL (legacy)",
      type: "string",
      group: "legacy",
      hidden: true
    })
  ],
  preview: {
    select: {
      title: "title",
      kind: "kind",
      media: "image"
    },
    prepare(selection) {
      const kindLabel =
        mediaKindOptions.find((option) => option.value === selection.kind)?.title || "Asset";

      return {
        title: selection.title || "Asset sin titulo",
        subtitle: kindLabel,
        media: selection.media
      };
    }
  }
});
