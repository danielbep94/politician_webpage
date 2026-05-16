import { NextResponse } from "next/server";

import { sanityWriteClient } from "@/lib/sanity/client";
import { contactSchema } from "@/lib/validation/contact";

export async function POST(request: Request) {
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

    if (sanityWriteClient) {
      await sanityWriteClient.create({
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
      {
        success: false,
        message: "Ocurrió un error al procesar el mensaje."
      },
      { status: 500 }
    );
  }
}
