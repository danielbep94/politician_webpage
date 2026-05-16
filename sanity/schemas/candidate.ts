import { defineArrayMember, defineField, defineType } from "sanity";

export const candidateSchema = defineType({
  name: "candidate",
  title: "Perfil publico",
  type: "document",
  groups: [
    { name: "profile", title: "Perfil", default: true },
    { name: "story", title: "Narrativa" },
    { name: "contact", title: "Contacto" }
  ],
  fields: [
    defineField({
      name: "name",
      title: "Nombre completo",
      type: "string",
      group: "profile",
      validation: (Rule) => Rule.required().min(3).max(100)
    }),
    defineField({
      name: "shortName",
      title: "Nombre corto",
      type: "string",
      group: "profile",
      description: "Versión breve para UI, módulos compactos o citas.",
      validation: (Rule) => Rule.required().min(2).max(40)
    }),
    defineField({
      name: "role",
      title: "Rol",
      type: "string",
      group: "profile",
      validation: (Rule) => Rule.required().min(3).max(80)
    }),
    defineField({
      name: "location",
      title: "Territorio o ubicacion",
      type: "string",
      group: "profile",
      validation: (Rule) => Rule.required().min(3).max(100)
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      group: "profile",
      description: "Frase principal que acompaña el perfil en secciones destacadas.",
      validation: (Rule) => Rule.required().min(12).max(160)
    }),
    defineField({
      name: "summary",
      title: "Resumen",
      type: "text",
      rows: 4,
      group: "story",
      validation: (Rule) => Rule.required().min(40).max(280)
    }),
    defineField({
      name: "biography",
      title: "Biografia",
      type: "array",
      group: "story",
      description: "Párrafos narrativos del perfil público.",
      of: [defineArrayMember({ type: "text" })],
      validation: (Rule) => Rule.required().min(1)
    }),
    defineField({
      name: "trajectory",
      title: "Trayectoria",
      type: "array",
      group: "story",
      description: "Hitos o antecedentes que aportan credibilidad.",
      of: [defineArrayMember({ type: "string" })],
      validation: (Rule) => Rule.required().min(1)
    }),
    defineField({
      name: "values",
      title: "Valores",
      type: "array",
      group: "story",
      description: "Puntos breves que sintetizan principios y forma de trabajo.",
      of: [defineArrayMember({ type: "string" })],
      validation: (Rule) => Rule.required().min(1)
    }),
    defineField({
      name: "vision",
      title: "Vision",
      type: "text",
      rows: 5,
      group: "story",
      validation: (Rule) => Rule.required().min(40)
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      group: "contact",
      validation: (Rule) => Rule.required().email()
    }),
    defineField({
      name: "phone",
      title: "Telefono",
      type: "string",
      group: "contact",
      validation: (Rule) => Rule.required().min(7).max(30)
    }),
    defineField({
      name: "socialLinks",
      title: "Redes y enlaces",
      type: "array",
      group: "contact",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Etiqueta",
              type: "string",
              validation: (Rule) => Rule.required()
            }),
            defineField({
              name: "href",
              title: "URL",
              type: "url",
              validation: (Rule) =>
                Rule.required().uri({
                  scheme: ["http", "https"]
                })
            })
          ],
          preview: {
            select: {
              title: "label",
              subtitle: "href"
            }
          }
        })
      ]
    })
  ],
  preview: {
    select: {
      title: "name",
      role: "role",
      location: "location"
    },
    prepare(selection) {
      const metadata = [selection.role, selection.location].filter(Boolean);

      return {
        title: selection.title || "Perfil sin nombre",
        subtitle: metadata.join(" · ")
      };
    }
  }
});
