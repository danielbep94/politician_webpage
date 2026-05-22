import { NextResponse } from "next/server";
import { createClient } from "next-sanity";

import { getIp, isRateLimited } from "@/lib/rate-limit";
import { contactSchema } from "@/lib/validation/contact";
import { getSecrets } from "@/lib/secrets";

export async function POST(request: Request) {
  const ip = getIp(request);

  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        success: false,
        message: "Demasiados intentos. Por favor espera unos minutos antes de volver a intentarlo."
      },
      { status: 429 }
    );
  }

  try {
    const payload = await request.json();
    const result = contactSchema.safeParse(payload);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Datos inválidos.",
          errors: result.error.flatten()
        },
        { status: 400 }
      );
    }

    const secrets = await getSecrets();

    const writeClient = secrets.sanity.writeToken
      ? createClient({
          projectId: secrets.sanity.projectId,
          dataset: secrets.sanity.dataset,
          apiVersion: secrets.sanity.apiVersion,
          token: secrets.sanity.writeToken,
          useCdn: false
        })
      : null;

    if (writeClient) {
      await writeClient.create({
        _type: "contactMessage",
        name: result.data.name,
        email: result.data.email,
        phone: result.data.phone || "",
        topic: result.data.topic,
        message: result.data.message,
        submittedAt: new Date().toISOString()
      });
    } else {
      console.info("[contact-message]", result.data);
    }

    return NextResponse.json({
      success: true,
      message: "Mensaje recibido correctamente."
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Ocurrió un error al procesar el mensaje." },
      { status: 500 }
    );
  }
}
