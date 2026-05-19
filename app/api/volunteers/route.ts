import { NextResponse } from "next/server";
import { Resend } from "resend";

import { sanityWriteClient } from "@/lib/sanity/client";
import { getIp, isRateLimited } from "@/lib/rate-limit";
import { volunteerSchema } from "@/lib/validation/volunteer";
import {
  volunteerConfirmationHtml,
  volunteerConfirmationText
} from "@/lib/emails/volunteerConfirmation";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_ADDRESS = "Política Moderna <noreply@politicamoderna.info>";
const TEAM_EMAIL =
  process.env.CONTACT_RECIPIENT_EMAIL ?? "equipo@politicamoderna.info";

export async function POST(request: Request) {
  const ip = getIp(request);

  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Demasiados intentos. Por favor espera unos minutos antes de volver a intentarlo."
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

    const { name, email, phone, community, area, availability } = result.data;

    // ── P2: Duplicate guard ───────────────────────────────────────────────
    if (sanityWriteClient) {
      const existing = await sanityWriteClient.fetch<string | null>(
        `*[_type == "volunteerLead" && email == $email][0]._id`,
        { email }
      );

      if (existing) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Ya existe un registro con ese correo electrónico. Nuestro equipo ya tiene tus datos y te contactará pronto."
          },
          { status: 409 }
        );
      }
    }

    // ── Persist to Sanity ─────────────────────────────────────────────────
    if (sanityWriteClient) {
      await sanityWriteClient.create({
        _type: "volunteerLead",
        name,
        email,
        phone,
        community,
        area,
        availability,
        status: "nuevo",
        submittedAt: new Date().toISOString()
      });
    } else {
      console.info("[volunteer-lead]", result.data);
    }

    // ── P1: Send emails (fire-and-forget — never block the HTTP response) ─
    if (resend) {
      const emailData = { name, email, area, availability, community };

      // Confirmation to volunteer
      resend.emails
        .send({
          from: FROM_ADDRESS,
          to: email,
          subject: `¡Gracias por sumarte, ${name.split(" ")[0]}! — Política Moderna`,
          html: volunteerConfirmationHtml(emailData),
          text: volunteerConfirmationText(emailData)
        })
        .catch((err) =>
          console.error("[volunteer-email] confirmation send failed:", err)
        );

      // Internal alert to campaign team
      resend.emails
        .send({
          from: FROM_ADDRESS,
          to: TEAM_EMAIL,
          subject: `🆕 Nuevo voluntario: ${name} · ${area}`,
          text: [
            `Nombre:         ${name}`,
            `Email:          ${email}`,
            `Teléfono:       ${phone}`,
            `Comunidad:      ${community}`,
            `Área:           ${area}`,
            `Disponibilidad: ${availability}`,
            ``,
            `Ver leads en Sanity: ${process.env.NEXT_PUBLIC_SANITY_STUDIO_URL ?? "https://politicamoderna.sanity.studio"}/desk/volunteerLead`
          ].join("\n")
        })
        .catch((err) =>
          console.error("[volunteer-email] internal alert send failed:", err)
        );
    } else {
      console.info("[volunteer-email] RESEND_API_KEY not set — skipping emails");
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
