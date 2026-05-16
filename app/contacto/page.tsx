import { Container } from "@/components/layout/Container";
import { ContactForm } from "@/components/forms/ContactForm";
import { PageIntro } from "@/components/seo/PageIntro";
import { Card } from "@/components/ui/Card";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getCandidate } from "@/lib/sanity/api";

export const metadata = buildPageMetadata({
  title: "Contacto",
  description:
    "Formulario ciudadano con nombre, email, teléfono opcional, mensaje y tema de interés.",
  pathname: "/contacto"
});

export default async function ContactPage() {
  const candidate = await getCandidate();

  return (
    <>
      <PageIntro
        eyebrow="Contacto"
        title="Un canal directo para escuchar y responder."
        description="Pensado para contacto ciudadano, levantamiento de prioridades y futuras automatizaciones de atención."
      />

      <section className="py-16 sm:py-20">
        <Container className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
          <Card>
            <ContactForm />
          </Card>

          <div className="space-y-6">
            <Card className="space-y-4">
              <h2 className="font-serif text-3xl text-foreground">
                Contacto ciudadano
              </h2>
              <p className="leading-8 text-slate-700">
                Comparte reportes, ideas o solicitudes vinculadas a servicios,
                seguridad, juventud, espacio público o medios.
              </p>
            </Card>
            <Card className="space-y-4 bg-surface-alt">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
                Datos base
              </p>
              <p className="text-slate-700">{candidate.email}</p>
              <p className="text-slate-700">{candidate.phone}</p>
              <p className="text-slate-700">{candidate.location}</p>
            </Card>
          </div>
        </Container>
      </section>
    </>
  );
}
