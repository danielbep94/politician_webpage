import { NextResponse } from "next/server";

import { sanityWriteClient } from "@/lib/sanity/client";
import { getIp, isRateLimited } from "@/lib/rate-limit";
import { volunteerSchema } from "@/lib/validation/volunteer";

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
    const result = volunteerSchema.safeParse(payload);

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
        _type: "volunteerLead",
        name: result.data.name,
        email: result.data.email,
        phone: result.data.phone,
        community: result.data.community,
        area: result.data.area,
        availability: result.data.availability,
        submittedAt: new Date().toISOString()
      });
    } else {
      console.info("[volunteer-lead]", result.data);
    }

    return NextResponse.json({
      success: true,
      message: "Registro completado."
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Ocurrió un error al procesar el registro."
      },
      { status: 500 }
    );
  }
}

