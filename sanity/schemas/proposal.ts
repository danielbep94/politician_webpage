import { defineArrayMember, defineField, defineType } from "sanity";

export const proposalSchema = defineType({
  name: "proposal",
  title: "Propuesta",
  type: "document",
  groups: [
    { name: "editorial", title: "Editorial", default: true },
    { name: "content", title: "Contenido" },
    { name: "distribution", title: "Distribucion" }
  ],
  initialValue: {
    featured: false
  },
  fields: [
    defineField({
      name: "title",
      title: "Titulo",
      type: "string",
      group: "editorial",
      validation: (Rule) => Rule.required().min(8).max(120)
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "editorial",
      description: "URL pública de la propuesta.",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "theme",
      title: "Tema",
      type: "string",
      group: "editorial",
      description: "Macrotema o eje de política pública.",
      validation: (Rule) => Rule.required().min(3).max(60)
    }),
    defineField({
      name: "summary",
      title: "Resumen",
      type: "text",
      rows: 4,
      group: "editorial",
      validation: (Rule) => Rule.required().min(30).max(240)
    }),
    defineField({
      name: "problem",
      title: "Problema",
      type: "text",
      rows: 5,
      group: "content",
      validation: (Rule) => Rule.required().min(40)
    }),
    defineField({
      name: "context",
      title: "Contexto",
      type: "text",
      rows: 5,
      group: "content",
      validation: (Rule) => Rule.required().min(40)
    }),
    defineField({
      name: "proposal",
      title: "Propuesta",
      type: "text",
      rows: 5,
      group: "content",
      validation: (Rule) => Rule.required().min(40)
    }),
    defineField({
      name: "actions",
      title: "Acciones",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "string" })],
      validation: (Rule) => Rule.required().min(1)
    }),
    defineField({
      name: "expectedImpact",
      title: "Impacto esperado",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "string" })],
      validation: (Rule) => Rule.required().min(1)
    }),
    defineField({
      name: "citizenCta",
      title: "CTA ciudadano",
      type: "text",
      rows: 3,
      group: "distribution",
      description: "Invitación accionable para que la ciudadanía participe o deje insumos.",
      validation: (Rule) => Rule.required().min(10).max(220)
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
      theme: "theme",
      featured: "featured"
    },
    prepare(selection) {
      const subtitle = selection.featured
        ? `${selection.theme || "Tema pendiente"} · Destacada`
        : selection.theme || "Tema pendiente";

      return {
        title: selection.title || "Propuesta sin titulo",
        subtitle
      };
    }
  }
});
