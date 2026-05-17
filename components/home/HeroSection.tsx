import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { buttonVariants } from "@/components/ui/Button";
import type { Candidate, ImageWithAlt, SiteSettings } from "@/lib/types";

type HeroSectionProps = {
  siteSettings: SiteSettings;
  candidate: Candidate & { portrait?: ImageWithAlt };
};

export function HeroSection({ siteSettings, candidate }: HeroSectionProps) {
  // Narrow to a portrait where src is guaranteed to be a non-empty string
  const portraitSrc: string | null = candidate.portrait?.src ?? null;
  const portraitAlt: string = candidate.portrait?.alt ?? candidate.name;
  const hasPortrait = portraitSrc !== null;

  return (
    <section className="overflow-hidden border-b border-line bg-hero-grid py-14 sm:py-16 lg:py-24">
      <Container className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-16">

        {/* ── CTA column — always visible ── */}
        <div className="space-y-7">

          {/* Mobile-only portrait banner (hidden on md and above) */}
          {hasPortrait && (
            <div className="relative overflow-hidden rounded-2xl border border-line bg-white shadow-soft md:hidden">
              {/* Brand accent bar */}
              <div className="absolute inset-x-0 top-0 z-10 h-1 bg-gradient-to-r from-brand to-accent" />

              {/* Photo — 3:2 crop */}
              <div className="aspect-[3/2] w-full overflow-hidden bg-surface-alt">
                <Image
                  src={portraitSrc!}
                  alt={portraitAlt}
                  width={800}
                  height={533}
                  sizes="(max-width: 767px) 100vw, 50vw"
                  className="h-full w-full object-cover object-top"
                  priority
                />
              </div>

              {/* Candidate name / role strip */}
              <div className="flex items-center gap-3 bg-white px-5 py-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand">
                    {candidate.role}
                  </p>
                  <p className="mt-0.5 font-serif text-lg leading-snug text-foreground">
                    {candidate.name}
                  </p>
                </div>
              </div>
            </div>
          )}

          <Badge>Visibilidad pública con propósito</Badge>

          <div className="space-y-5">
            <h1 className="max-w-4xl text-balance font-serif text-4xl leading-tight text-foreground sm:text-5xl lg:text-6xl">
              {siteSettings.heroMessage}
            </h1>
            <p className="max-w-2xl text-base leading-8 text-slate-700 sm:text-lg">
              {siteSettings.heroSubheadline}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/sumate"
              className={buttonVariants({ size: "lg", className: "w-full sm:w-auto" })}
            >
              Súmate como voluntario
            </Link>
            <Link
              href="/propuestas"
              className={buttonVariants({
                variant: "secondary",
                size: "lg",
                className: "w-full sm:w-auto"
              })}
            >
              Conoce las propuestas
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              "Propuestas concretas",
              "Escucha territorial",
              "Seguimiento ciudadano"
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-line bg-white/80 px-4 py-3 text-sm font-medium text-slate-700 backdrop-blur"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* ── Desktop-only full candidate card (hidden below md) ── */}
        <div className="relative hidden overflow-hidden rounded-[2rem] border border-line bg-white p-6 shadow-soft sm:p-8 md:block">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-brand to-accent" />

          {hasPortrait && (
            <div className="mb-5 overflow-hidden rounded-2xl border border-line">
              <Image
                src={portraitSrc!}
                alt={portraitAlt}
                width={640}
                height={480}
                sizes="(min-width: 1024px) 35vw, 50vw"
                className="h-56 w-full object-cover object-top"
                priority
              />
            </div>
          )}

          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand">
            {candidate.role}
          </p>
          <h2 className="mt-4 font-serif text-3xl text-foreground">
            {candidate.name}
          </h2>
          <p className="mt-4 text-base leading-8 text-slate-700">
            {candidate.headline}
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-surface-alt p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Método
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-700">
                Diagnóstico claro, prioridades públicas y seguimiento visible.
              </p>
            </div>
            <div className="rounded-2xl bg-surface-alt p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Audiencia
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-700">
                Jóvenes, familias y ciudadanía que quiere propuestas accionables.
              </p>
            </div>
          </div>
          <div className="mt-6 rounded-[1.5rem] bg-brand-dark p-5 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
              Compromiso central
            </p>
            <p className="mt-2 text-sm leading-7 text-white/85">
              Convertir cercanía política en una experiencia digital seria,
              clara y enfocada a participación real.
            </p>
          </div>
        </div>

      </Container>
    </section>
  );
}
