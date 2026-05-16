import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { PageIntro } from "@/components/seo/PageIntro";
import { buttonVariants } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Gracias",
  description: "Página de agradecimiento posterior a contacto o voluntariado.",
  pathname: "/gracias"
});

export default function ThankYouPage() {
  return (
    <>
      <PageIntro
        eyebrow="Gracias"
        title="Tu mensaje ya es parte de la conversación."
        description="Esta página ayuda a cerrar mejor el flujo de conversión y deja una siguiente acción clara."
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
