import { defineField, defineType } from "sanity";

export const faqSchema = defineType({
  name: "faq",
  title: "Pregunta frecuente",
  type: "document",
  fields: [
    defineField({
      name: "question",
      title: "Pregunta",
      type: "string",
      description: "Pregunta visible para la ciudadanía.",
      validation: (Rule) => Rule.required().min(8).max(140)
    }),
    defineField({
      name: "answer",
      title: "Respuesta",
      type: "text",
      rows: 4,
      description: "Respuesta clara, breve y accionable.",
      validation: (Rule) => Rule.required().min(20).max(500)
    })
  ],
  preview: {
    select: {
      title: "question",
      subtitle: "answer"
    },
    prepare(selection) {
      return {
        title: selection.title || "Pregunta sin titulo",
        subtitle: selection.subtitle || "Respuesta pendiente"
      };
    }
  }
});
