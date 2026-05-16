import { defineField, defineType } from "sanity";

const formatSubmittedAt = (value?: string) => {
  if (!value) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC"
  }).format(new Date(value));
};

export const contactMessageSchema = defineType({
  name: "contactMessage",
  title: "Mensajes de contacto",
  type: "document",
  groups: [
    { name: "contact", title: "Contacto", default: true },
    { name: "message", title: "Mensaje" },
    { name: "meta", title: "Meta" }
  ],
  fields: [
    defineField({
      name: "name",
      title: "Nombre",
      type: "string",
      group: "contact",
      validation: (Rule) => Rule.required().min(2).max(100)
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
      group: "contact"
    }),
    defineField({
      name: "topic",
      title: "Tema",
      type: "string",
      group: "message",
      validation: (Rule) => Rule.required().min(2).max(100)
    }),
    defineField({
      name: "message",
      title: "Mensaje",
      type: "text",
      rows: 6,
      group: "message",
      validation: (Rule) => Rule.required().min(10).max(5000)
    }),
    defineField({
      name: "submittedAt",
      title: "Enviado el",
      type: "datetime",
      group: "meta",
      validation: (Rule) => Rule.required()
    })
  ],
  preview: {
    select: {
      title: "name",
      topic: "topic",
      submittedAt: "submittedAt"
    },
    prepare(selection) {
      const metadata = [selection.topic, formatSubmittedAt(selection.submittedAt)].filter(
        Boolean
      );

      return {
        title: selection.title || "Mensaje sin nombre",
        subtitle: metadata.join(" · ")
      };
    }
  }
});
