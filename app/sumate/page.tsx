import { Container } from "@/components/layout/Container";
import { VolunteerForm } from "@/components/forms/VolunteerForm";
import { PageIntro } from "@/components/seo/PageIntro";
import { Card } from "@/components/ui/Card";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Súmate",
  description:
    "Formulario para captar voluntarios con datos de contacto, comunidad, área de ayuda y disponibilidad.",
  pathname: "/sumate"
});

export default function VolunteerPage() {
  return (
    <>
      <PageIntro
        eyebrow="Súmate"
        title="Haz equipo para mover ideas, territorio y participación."
        description="Esta ruta está diseñada para convertir interés ciudadano en acción organizada y medible."
      />

      <section className="py-16 sm:py-20">
        <Container className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
          <Card>
            <VolunteerForm />
          </Card>

          <div className="space-y-6">
            <Card className="space-y-4">
              <h2 className="font-serif text-3xl text-foreground">
                Áreas de participación
              </h2>
              <ul className="space-y-3 text-slate-700">
                <li className="rounded-2xl bg-surface-alt p-4 leading-7">
                  Activación territorial y recorridos.
                </li>
                <li className="rounded-2xl bg-surface-alt p-4 leading-7">
                  Redes sociales, diseño y difusión.
                </li>
                <li className="rounded-2xl bg-surface-alt p-4 leading-7">
                  Logística, eventos y organización comunitaria.
                </li>
              </ul>
            </Card>
            <Card className="space-y-4 bg-brand text-white">
              <h2 className="font-serif text-3xl">Por qué importa</h2>
              <p className="leading-8 text-white/85">
                Un buen flujo de voluntariado mejora conversión, orden operativo y
                seguimiento de personas interesadas desde etapas tempranas.
              </p>
            </Card>
          </div>
        </Container>
      </section>
    </>
  );
}
