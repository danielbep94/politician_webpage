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

export const volunteerLeadSchema = defineType({
  name: "volunteerLead",
  title: "Lead de voluntariado",
  type: "document",
  groups: [
    { name: "contact", title: "Contacto", default: true },
    { name: "participation", title: "Participacion" },
    { name: "meta", title: "Meta" }
  ],
  fields: [
    defineField({
      name: "name",
      title: "Nombre",
      type: "string",
      group: "contact",
      validation: (Rule) => Rule.required().min(3).max(100)
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
      name: "community",
      title: "Comunidad",
      type: "string",
      group: "participation",
      validation: (Rule) => Rule.required().min(2).max(100)
    }),
    defineField({
      name: "area",
      title: "Area de interes",
      type: "string",
      group: "participation",
      validation: (Rule) => Rule.required().min(2).max(100)
    }),
    defineField({
      name: "availability",
      title: "Disponibilidad",
      type: "string",
      group: "participation",
      validation: (Rule) => Rule.required().min(2).max(100)
    }),
    defineField({
      name: "submittedAt",
      title: "Enviado el",
      type: "datetime",
      group: "meta",
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "status",
      title: "Estado de seguimiento",
      type: "string",
      group: "meta",
      initialValue: "nuevo",
      options: {
        list: [
          { title: "Nuevo", value: "nuevo" },
          { title: "Contactado", value: "contactado" },
          { title: "Incorporado", value: "incorporado" },
          { title: "Inactivo", value: "inactivo" }
        ],
        layout: "radio"
      }
    })
  ],
  preview: {
    select: {
      title: "name",
      area: "area",
      status: "status",
      submittedAt: "submittedAt"
    },
    prepare(selection) {
      const statusLabel: Record<string, string> = {
        nuevo: "🆕 Nuevo",
        contactado: "📞 Contactado",
        incorporado: "✅ Incorporado",
        inactivo: "⛔ Inactivo"
      };
      const metadata = [
        selection.area,
        statusLabel[selection.status] ?? selection.status,
        formatSubmittedAt(selection.submittedAt)
      ].filter(Boolean);

      return {
        title: selection.title || "Lead sin nombre",
        subtitle: metadata.join(" · ")
      };
    }
  }
});
