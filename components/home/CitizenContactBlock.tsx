import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { buttonVariants } from "@/components/ui/Button";

export function CitizenContactBlock() {
  return (
    <section className="py-14 sm:py-16 lg:py-20">
      <Container>
        <div className="grid gap-6 rounded-[2rem] border border-line bg-white p-6 shadow-soft sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand">
              Contacto ciudadano
            </p>
            <h2 className="font-serif text-3xl text-foreground sm:text-4xl">
              Una puerta de entrada clara para escuchar y responder.
            </h2>
            <p className="max-w-2xl leading-8 text-slate-700">
              El sitio está pensado para recibir inquietudes, detectar prioridades
              y convertir mensajes ciudadanos en seguimiento real y ordenado.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Temas de interés segmentados",
                "Mensaje directo y simple",
                "Base para CRM futuro",
                "Seguimiento operativo escalable"
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-surface-alt px-4 py-3 text-sm text-slate-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-between gap-5 rounded-[1.75rem] bg-surface-alt p-6">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                Acción sugerida
              </p>
              <p className="text-sm leading-7 text-slate-700">
                Comparte un tema de interés, una propuesta para tu colonia o una
                solicitud concreta. La experiencia ya está preparada para crecer
                hacia CRM, automatizaciones y trazabilidad.
              </p>
            </div>
            <Link
              href="/contacto"
              className={buttonVariants({ className: "w-full sm:w-fit" })}
            >
              Ir al formulario
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
