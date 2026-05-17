import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { PageIntro } from "@/components/seo/PageIntro";
import { buttonVariants } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Gracias por tu mensaje",
  description: "Recibimos tu participación. Nuestro equipo estará en contacto contigo pronto.",
  pathname: "/gracias"
});

// Thank-you confirmation pages must not appear in search results
export const robots = { index: false, follow: false };

export default function ThankYouPage() {
  return (
    <>
      <PageIntro
        eyebrow="Gracias"
        title="Tu mensaje ya es parte de la conversación."
        description="Lo recibimos. Nuestro equipo le dará seguimiento y te contactará pronto."
      />

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <Card className="space-y-6 text-center">
            <p className="text-lg leading-8 text-slate-700">
              Recibimos tu mensaje. Nuestro equipo te contactará pronto para
              darle seguimiento personalizado. Mientras tanto, puedes conocer
              las propuestas o revisar la agenda de eventos próximos.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/propuestas" className={buttonVariants({ variant: "secondary" })}>
                Conocer propuestas
              </Link>
              <Link href="/agenda" className={buttonVariants({})}>
                Ver agenda
              </Link>
            </div>
          </Card>
        </Container>
      </section>
    </>
  );
}
