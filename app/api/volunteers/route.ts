import { NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { Resend } from "resend";

import { getIp, isRateLimited } from "@/lib/rate-limit";
import { volunteerSchema } from "@/lib/validation/volunteer";
import { getSecrets } from "@/lib/secrets";
import {
  volunteerConfirmationHtml,
  volunteerConfirmationText
} from "@/lib/emails/volunteerConfirmation";

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
    const secrets = await getSecrets();

    // ── Build write client from secrets ───────────────────────────────────
    const writeClient = secrets.sanity.writeToken
      ? createClient({
          projectId: secrets.sanity.projectId,
          dataset: secrets.sanity.dataset,
          apiVersion: secrets.sanity.apiVersion,
          token: secrets.sanity.writeToken,
          useCdn: false
        })
      : null;

    // ── Duplicate guard ───────────────────────────────────────────────────
    if (writeClient) {
      const existing = await writeClient.fetch<string | null>(
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
    if (writeClient) {
      await writeClient.create({
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

    // ── Emails (fire-and-forget) ──────────────────────────────────────────
    if (secrets.resend.apiKey) {
      const resend = new Resend(secrets.resend.apiKey);
      const emailData = { name, email, area, availability, community };

      // Confirmation to volunteer
      resend.emails
        .send({
          from: secrets.resend.fromAddress,
          to: email,
          subject: `¡Gracias por sumarte, ${name.split(" ")[0]}! — Política Moderna`,
          html: volunteerConfirmationHtml(emailData),
          text: volunteerConfirmationText(emailData)
        })
        .catch((err) =>
          console.error("[volunteer-email] confirmation failed:", err)
        );

      // Internal alert to campaign team
      resend.emails
        .send({
          from: secrets.resend.fromAddress,
          to: secrets.resend.teamEmail,
          subject: `🆕 Nuevo voluntario: ${name} · ${area}`,
          text: [
            `Nombre:         ${name}`,
            `Email:          ${email}`,
            `Teléfono:       ${phone}`,
            `Comunidad:      ${community}`,
            `Área:           ${area}`,
            `Disponibilidad: ${availability}`,
            ``,
            `Ver en Sanity: ${secrets.site.url}/studio/desk/volunteerLead`
          ].join("\n")
        })
        .catch((err) =>
          console.error("[volunteer-email] internal alert failed:", err)
        );
    } else {
      console.info("[volunteer-email] No Resend API key — skipping emails.");
    }

    return NextResponse.json({ success: true, message: "Registro completado." });
  } catch {
    return NextResponse.json(
      { success: false, message: "Ocurrió un error al procesar el registro." },
      { status: 500 }
    );
  }
}
