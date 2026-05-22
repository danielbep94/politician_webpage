import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { PageIntro } from "@/components/seo/PageIntro";
import { buttonVariants } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Gracias por tu participación",
  description:
    "Recibimos tu participación. Nuestro equipo estará en contacto contigo pronto.",
  pathname: "/gracias"
});

// Prevent this confirmation page from appearing in search results
metadata.robots = { index: false, follow: false };

export default async function ThankYouPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const isVolunteer = params.origen === "voluntariado";

  return (
    <>
      <PageIntro
        eyebrow={isVolunteer ? "¡Bienvenido/a al equipo!" : "Gracias"}
        title={
          isVolunteer
            ? "Tu registro de voluntariado fue recibido."
            : "Tu mensaje ya es parte de la conversación."
        }
        description={
          isVolunteer
            ? "Nuestro coordinador territorial te contactará en los próximos 2–3 días hábiles para orientarte sobre los próximos pasos."
            : "Lo recibimos. Nuestro equipo le dará seguimiento y te contactará pronto."
        }
      />

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <Card className="space-y-6 text-center">
            {isVolunteer ? (
              <>
                <p className="text-lg leading-8 text-slate-700">
                  Ya anotamos tu nombre, área de interés y disponibilidad.
                  Revisa tu bandeja de entrada — te enviamos un correo de
                  confirmación. Mientras tanto, explora la agenda de actividades
                  o conoce las propuestas del equipo.
                </p>
                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                  <Link
                    href="/agenda"
                    className={buttonVariants({})}
                    id="cta-volunteer-agenda"
                  >
                    Ver agenda de actividades
                  </Link>
                  <Link
                    href="/propuestas"
                    className={buttonVariants({ variant: "secondary" })}
                    id="cta-volunteer-propuestas"
                  >
                    Conocer propuestas
                  </Link>
                </div>
              </>
            ) : (
              <>
                <p className="text-lg leading-8 text-slate-700">
                  Recibimos tu mensaje. Nuestro equipo te contactará pronto
                  para darle seguimiento personalizado. Mientras tanto, puedes
                  conocer las propuestas o revisar la agenda de eventos próximos.
                </p>
                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                  <Link
                    href="/propuestas"
                    className={buttonVariants({ variant: "secondary" })}
                    id="cta-contact-propuestas"
                  >
                    Conocer propuestas
                  </Link>
                  <Link
                    href="/agenda"
                    className={buttonVariants({})}
                    id="cta-contact-agenda"
                  >
                    Ver agenda
                  </Link>
                </div>
              </>
            )}
          </Card>
        </Container>
      </section>
    </>
  );
}
