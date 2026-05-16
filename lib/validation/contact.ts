import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Ingresa tu nombre completo."),
  email: z.string().email("Ingresa un email válido."),
  phone: z.string().optional().or(z.literal("")),
  topic: z.string().min(1, "Selecciona un tema de interés."),
  message: z.string().min(10, "Cuéntanos un poco más sobre tu mensaje.")
});

export type ContactPayload = z.infer<typeof contactSchema>;
