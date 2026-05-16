import { defineField, defineType } from "sanity";

export const siteSettingsSchema = defineType({
  name: "siteSettings",
  title: "Configuracion del sitio",
  type: "document",
  groups: [
    { name: "identity", title: "Identidad", default: true },
    { name: "homepage", title: "Home" },
    { name: "contact", title: "Contacto" },
    { name: "seo", title: "SEO" }
  ],
  initialValue: {
    locale: "es_MX"
  },
  fields: [
    defineField({
      name: "title",
      title: "Nombre del sitio",
      type: "string",
      group: "identity",
      description: "Nombre editorial o institucional que aparece en metadata y referencias globales.",
      validation: (Rule) => Rule.required().min(3).max(80)
    }),
    defineField({
      name: "description",
      title: "Descripcion general",
      type: "text",
      rows: 3,
      group: "identity",
      description: "Resumen corto del proyecto usado en SEO y descripciones generales.",
      validation: (Rule) => Rule.required().min(40).max(180)
    }),
    defineField({
      name: "url",
      title: "URL del sitio",
      type: "url",
      group: "identity",
      description: "Dominio canonico principal del sitio publico.",
      validation: (Rule) =>
        Rule.required().uri({
          scheme: ["http", "https"]
        })
    }),
    defineField({
      name: "locale",
      title: "Locale",
      type: "string",
      group: "identity",
      description: "Formato de idioma y region para metadata y Open Graph.",
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "heroMessage",
      title: "Mensaje principal",
      type: "string",
      group: "homepage",
      description: "Titular principal del hero en la home.",
      validation: (Rule) => Rule.required().min(12).max(120)
    }),
    defineField({
      name: "heroSubheadline",
      title: "Bajada del hero",
      type: "text",
      rows: 4,
      group: "homepage",
      description: "Apoyo editorial del hero. Conviene mantenerlo breve y claro.",
      validation: (Rule) => Rule.required().min(40).max(260)
    }),
    defineField({
      name: "contactEmail",
      title: "Email de contacto",
      type: "string",
      group: "contact",
      description: "Correo principal para formularios, prensa y referencias institucionales.",
      validation: (Rule) => Rule.required().email()
    }),
    defineField({
      name: "defaultOgImageAsset",
      title: "Imagen OG por defecto",
      type: "imageWithAlt",
      group: "seo",
      description: "Imagen social principal del sitio. Sustituye gradualmente al campo legacy por URL.",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const image = value as { asset?: unknown } | undefined;
          const document = context.document as { defaultOgImage?: string } | undefined;

          if (image?.asset || document?.defaultOgImage?.trim()) {
            return true;
          }

          return "Carga una imagen OG o conserva temporalmente la URL legacy mientras se completa la migracion.";
        })
    }),
    defineField({
      name: "defaultOgImage",
      title: "Default OG Image (legacy)",
      type: "string",
      group: "seo",
      hidden: true
    })
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "url",
      media: "defaultOgImageAsset"
    },
    prepare(selection) {
      return {
        title: selection.title || "Configuracion del sitio",
        subtitle: selection.subtitle || "URL pendiente",
        media: selection.media
      };
    }
  }
});
