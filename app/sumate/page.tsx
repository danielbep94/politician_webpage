import { Container } from "@/components/layout/Container";
import { VolunteerForm } from "@/components/forms/VolunteerForm";
import { PageIntro } from "@/components/seo/PageIntro";
import { Card } from "@/components/ui/Card";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { socialProof } from "@/lib/constants/site";

export const metadata = buildPageMetadata({
  title: "Súmate",
  description:
    "Regístrate como voluntario y forma parte del equipo que está construyendo una comunidad mejor.",
  pathname: "/sumate"
});

export default function VolunteerPage() {
  return (
    <>
      <PageIntro
        eyebrow="Súmate"
        title="Haz equipo para mover ideas, territorio y participación."
        description="Cada persona que se suma hace que la agenda llegue más lejos. Elige cómo quieres participar y nuestro equipo te contactará."
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
            <div className="space-y-4 rounded-[1.75rem] border border-brand bg-brand p-5 shadow-soft sm:p-6 lg:p-7 text-white">
              <h2 className="font-serif text-3xl text-white">Por qué tu participación importa</h2>
              <p className="leading-8 text-white/85">
                Cuando la comunidad se organiza, las propuestas se vuelven reales.
                Tu presencia en territorio, redes o eventos es lo que convierte
                una agenda en cambios visibles para tu colonia.
              </p>
            </div>

            {/* Social proof card */}
            <Card className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                Ya se sumaron
              </p>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { value: socialProof.volunteersCount, label: "Voluntarios" },
                  { value: socialProof.eventsHeld, label: "Eventos" },
                  { value: socialProof.proposalsPublished, label: "Propuestas" }
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl bg-surface-alt p-3">
                    <p className="font-serif text-2xl font-bold text-brand">{stat.value}</p>
                    <p className="mt-1 text-xs text-slate-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </Container>
      </section>
    </>
  );
}
