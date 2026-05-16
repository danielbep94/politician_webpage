import { defineField, defineType } from "sanity";

const todayDate = () => new Date().toISOString().slice(0, 10);

const formatEventDate = (value?: string) => {
  if (!value) {
    return "Fecha pendiente";
  }

  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(`${value}T00:00:00.000Z`));
};

export const eventSchema = defineType({
  name: "event",
  title: "Evento de agenda",
  type: "document",
  groups: [
    { name: "editorial", title: "Editorial", default: true },
    { name: "logistics", title: "Logistica" },
    { name: "cta", title: "CTA" }
  ],
  initialValue: () => ({
    date: todayDate(),
    isVirtual: false
  }),
  fields: [
    defineField({
      name: "title",
      title: "Titulo",
      type: "string",
      group: "editorial",
      description: "Nombre público del evento de agenda.",
      validation: (Rule) => Rule.required().min(8).max(120)
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "editorial",
      description: "Identificador para referencias y trazabilidad editorial.",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "type",
      title: "Tipo de evento",
      type: "string",
      group: "editorial",
      description: "Ejemplo: reunion comunitaria, recorrido, transmision publica.",
      validation: (Rule) => Rule.required().min(3).max(60)
    }),
    defineField({
      name: "summary",
      title: "Resumen",
      type: "text",
      rows: 4,
      group: "editorial",
      description: "Descripción corta del objetivo o formato del evento.",
      validation: (Rule) => Rule.required().min(30).max(240)
    }),
    defineField({
      name: "date",
      title: "Fecha",
      type: "date",
      group: "logistics",
      description: "Los eventos de agenda solo deben representar actividades futuras.",
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (!value) {
            return "La fecha es obligatoria.";
          }

          if (value < todayDate()) {
            return "Un evento de agenda debe estar hoy o en el futuro. Si ya ocurrio, registralo como activity.";
          }

          return true;
        })
    }),
    defineField({
      name: "time",
      title: "Hora",
      type: "string",
      group: "logistics",
      description: "Hora visible para agenda y recordatorios.",
      validation: (Rule) => Rule.required().max(30)
    }),
    defineField({
      name: "location",
      title: "Ubicacion",
      type: "string",
      group: "logistics",
      description: "Lugar físico o canal donde se realizara el evento.",
      validation: (Rule) => Rule.required().min(3).max(120)
    }),
    defineField({
      name: "isVirtual",
      title: "Es virtual",
      type: "boolean",
      group: "logistics",
      description: "Marca este campo cuando la asistencia o transmisión sea exclusivamente digital.",
      initialValue: false
    }),
    defineField({
      name: "ctaLabel",
      title: "Texto del CTA",
      type: "string",
      group: "cta",
      description: "Ejemplo: Confirmar asistencia o Recibir recordatorio.",
      validation: (Rule) => Rule.required().min(3).max(50)
    }),
    defineField({
      name: "ctaHref",
      title: "Destino del CTA",
      type: "string",
      group: "cta",
      description: "Acepta rutas internas como /sumate o URLs completas.",
      validation: (Rule) => Rule.required().min(1).max(200)
    })
  ],
  preview: {
    select: {
      title: "title",
      type: "type",
      date: "date"
    },
    prepare(selection) {
      const metadata = [selection.type, formatEventDate(selection.date)].filter(Boolean);

      return {
        title: selection.title || "Evento sin titulo",
        subtitle: metadata.join(" · ")
      };
    }
  }
});
