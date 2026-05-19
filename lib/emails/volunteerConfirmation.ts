/**
 * lib/emails/volunteerConfirmation.ts
 *
 * Plain-HTML email sent to the volunteer immediately after registration.
 * No external templating dependency — pure string template for zero bundle cost.
 */

export interface VolunteerEmailData {
  name: string;
  email: string;
  area: string;
  availability: string;
  community: string;
}

export function volunteerConfirmationHtml(data: VolunteerEmailData): string {
  const firstName = data.name.split(" ")[0];

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Confirmación de voluntariado</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Inter,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08);">

          <!-- Header -->
          <tr>
            <td style="background:#1d4ed8;padding:32px 40px;text-align:center;">
              <p style="margin:0;font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#93c5fd;font-weight:600;">Política Moderna</p>
              <h1 style="margin:12px 0 0;font-size:26px;color:#ffffff;font-weight:700;line-height:1.3;">
                ¡Gracias por sumarte, ${firstName}!
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <p style="margin:0 0 20px;font-size:16px;color:#334155;line-height:1.7;">
                Recibimos tu registro como voluntario/a. Aquí está un resumen de lo que nos compartiste:
              </p>

              <!-- Summary table -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin-bottom:28px;">
                <tr style="background:#f8fafc;">
                  <td style="padding:12px 16px;font-size:13px;color:#64748b;font-weight:600;width:40%;border-bottom:1px solid #e2e8f0;">Área de interés</td>
                  <td style="padding:12px 16px;font-size:14px;color:#0f172a;border-bottom:1px solid #e2e8f0;">${data.area}</td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;font-size:13px;color:#64748b;font-weight:600;border-bottom:1px solid #e2e8f0;">Disponibilidad</td>
                  <td style="padding:12px 16px;font-size:14px;color:#0f172a;border-bottom:1px solid #e2e8f0;">${data.availability}</td>
                </tr>
                <tr style="background:#f8fafc;">
                  <td style="padding:12px 16px;font-size:13px;color:#64748b;font-weight:600;">Comunidad</td>
                  <td style="padding:12px 16px;font-size:14px;color:#0f172a;">${data.community}</td>
                </tr>
              </table>

              <p style="margin:0 0 20px;font-size:16px;color:#334155;line-height:1.7;">
                Nuestro equipo de coordinación territorial te contactará en los próximos
                <strong>2–3 días hábiles</strong> para orientarte sobre los próximos pasos.
              </p>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0" style="margin:28px 0;">
                <tr>
                  <td style="background:#1d4ed8;border-radius:8px;">
                    <a href="${process.env.NEXT_PUBLIC_SITE_URL}/agenda"
                       style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;">
                      Ver agenda de actividades →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:15px;color:#334155;line-height:1.7;">
                Juntos construimos la comunidad que queremos ver.<br/>
                <strong>— Equipo Política Moderna</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:20px 40px;border-top:1px solid #e2e8f0;">
              <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.6;text-align:center;">
                Si no solicitaste este registro, puedes ignorar este correo con seguridad.<br/>
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/privacidad"
                   style="color:#1d4ed8;text-decoration:none;">Aviso de privacidad</a>
                &nbsp;·&nbsp;
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}"
                   style="color:#1d4ed8;text-decoration:none;">politicamoderna.info</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Plain-text fallback for email clients that don't render HTML */
export function volunteerConfirmationText(data: VolunteerEmailData): string {
  const firstName = data.name.split(" ")[0];
  return [
    `¡Gracias por sumarte, ${firstName}!`,
    "",
    "Recibimos tu registro como voluntario/a:",
    `  • Área de interés: ${data.area}`,
    `  • Disponibilidad:  ${data.availability}`,
    `  • Comunidad:       ${data.community}`,
    "",
    "Nuestro equipo te contactará en los próximos 2–3 días hábiles.",
    "",
    "— Equipo Política Moderna",
    `${process.env.NEXT_PUBLIC_SITE_URL}`
  ].join("\n");
}
