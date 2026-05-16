import { z } from "zod";

export const volunteerSchema = z.object({
  name: z.string().min(2, "Ingresa tu nombre completo."),
  email: z.string().email("Ingresa un email válido."),
  phone: z.string().min(8, "Ingresa un teléfono válido."),
  community: z.string().min(2, "Indica tu colonia o comunidad."),
  area: z.string().min(1, "Selecciona dónde te gustaría ayudar."),
  availability: z.string().min(1, "Selecciona tu disponibilidad.")
});

export type VolunteerPayload = z.infer<typeof volunteerSchema>;
