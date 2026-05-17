import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { buttonVariants } from "@/components/ui/Button";
import { socialProof } from "@/lib/constants/site";

export function VolunteerBlock() {
  return (
    <section className="pb-14 sm:pb-16 lg:pb-20">
      <Container>
        <div className="grid gap-6 rounded-[2rem] bg-brand p-6 text-white shadow-soft sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/75">
              Súmate al equipo
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl">
              La campaña crece mejor cuando la comunidad se vuelve protagonista.
            </h2>
            <p className="max-w-2xl leading-8 text-white/80">
              Hay muchas formas de participar: recorridos de territorio, redes
              sociales, logística de eventos, diseño y defensa del voto. Tú decides
              cómo aportas y cuándo.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Tú decides cuándo y cómo participas",
                "Hay una tarea para cada disponibilidad",
                "Formarás parte de un equipo organizado",
                "Tu colonia notará la diferencia"
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/85"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {/* Social proof stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: socialProof.volunteersCount, label: "Voluntarios" },
                { value: socialProof.eventsHeld, label: "Eventos" },
                { value: socialProof.proposalsPublished, label: "Propuestas" }
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl bg-white/10 p-4 text-center"
                >
                  <p className="font-serif text-2xl font-bold text-white">{stat.value}</p>
                  <p className="mt-1 text-xs text-white/65">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* CTA card */}
            <div className="rounded-[1.75rem] bg-white/10 p-6 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/65">
                Tu próximo paso
              </p>
              <p className="mt-3 text-sm leading-7 text-white/80">
                Regístrate en menos de dos minutos. Nuestro equipo se pondrá en
                contacto para coordinar tu participación según tu disponibilidad.
              </p>
              <Link
                href="/sumate"
                className={buttonVariants({
                  variant: "secondary",
                  className:
                    "mt-6 w-full border-white/30 bg-white text-brand hover:border-white hover:bg-white sm:w-fit"
                })}
              >
                Quiero participar
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
