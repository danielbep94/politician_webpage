import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { buttonVariants } from "@/components/ui/Button";

export function VolunteerBlock() {
  return (
    <section className="pb-14 sm:pb-16 lg:pb-20">
      <Container>
        <div className="grid gap-6 rounded-[2rem] bg-brand p-6 text-white shadow-soft sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/75">
              Captación de voluntarios
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl">
              La campaña crece mejor cuando la comunidad se vuelve protagonista.
            </h2>
            <p className="max-w-2xl leading-8 text-white/80">
              Desde activación territorial hasta redes, logística y defensa del
              voto, el flujo de voluntariado queda listo para integrarse con Sanity
              y evolucionar hacia automatizaciones futuras.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Registro simple desde móvil",
                "Datos útiles para operación",
                "Mejor conversión de interés",
                "Base lista para automatizar"
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
          <div className="rounded-[1.75rem] bg-white/10 p-6 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/65">
              CTA principal
            </p>
            <p className="mt-3 text-sm leading-7 text-white/80">
              Convierte interés en acción con un formulario claro, campos útiles
              para operación y una página de agradecimiento pensada para mejorar
              conversión.
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
      </Container>
    </section>
  );
}
