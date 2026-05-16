import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Ingresa tu nombre completo.").max(100),
  email: z.string().email("Ingresa un email válido.").max(200),
  phone: z.string().max(30).optional().or(z.literal("")),
  topic: z.string().min(1, "Selecciona un tema de interés.").max(100),
  message: z.string().min(10, "Cuéntanos un poco más sobre tu mensaje.").max(2000),
  // Honeypot: must be empty. Bots fill it; humans leave it blank.
  website: z.string().max(0, "Bot detectado.").optional()
});

export type ContactPayload = z.infer<typeof contactSchema>;
