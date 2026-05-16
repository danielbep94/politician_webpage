import { z } from "zod";

export const volunteerSchema = z.object({
  name: z.string().min(2, "Ingresa tu nombre completo.").max(100),
  email: z.string().email("Ingresa un email válido.").max(200),
  phone: z.string().min(8, "Ingresa un teléfono válido.").max(30),
  community: z.string().min(2, "Indica tu colonia o comunidad.").max(100),
  area: z.string().min(1, "Selecciona dónde te gustaría ayudar.").max(100),
  availability: z.string().min(1, "Selecciona tu disponibilidad.").max(100),
  // Honeypot: must be empty. Bots fill it; humans leave it blank.
  website: z.string().max(0, "Bot detectado.").optional()
});

export type VolunteerPayload = z.infer<typeof volunteerSchema>;
