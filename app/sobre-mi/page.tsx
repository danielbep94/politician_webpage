import Image from "next/image";

import { Container } from "@/components/layout/Container";
import { PageIntro } from "@/components/seo/PageIntro";
import { Card } from "@/components/ui/Card";
import { buildPageMetadata } from "@/lib/seo/metadata";
import type { Candidate, ImageWithAlt } from "@/lib/types";
import { getCandidate } from "@/lib/sanity/api";

export const metadata = buildPageMetadata({
  title: "Sobre mí",
  description:
    "Biografía, trayectoria, valores y visión comunitaria de la candidata.",
  pathname: "/sobre-mi"
});

export default async function AboutPage() {
  const candidate = await getCandidate() as Candidate & { portrait?: ImageWithAlt };
  const portraitSrc = candidate.portrait?.src ?? null;
  const portraitAlt = candidate.portrait?.alt ?? candidate.name;

  return (
    <>
      <PageIntro
        eyebrow="Sobre mí"
        title={candidate.name}
        description={candidate.summary}
      />

      <section className="py-16 sm:py-20">
        <Container className="space-y-8">

          {/* Portrait banner — full width above the card grid */}
          {portraitSrc && (
            <div className="relative overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
              {/* Brand accent bar */}
              <div className="absolute inset-x-0 top-0 z-10 h-1 bg-gradient-to-r from-brand to-accent" />
              {/* 3:2 photo crop */}
              <div className="aspect-[3/2] w-full overflow-hidden bg-surface-alt sm:aspect-[16/6]">
                <Image
                  src={portraitSrc}
                  alt={portraitAlt}
                  width={1200}
                  height={450}
                  sizes="(max-width: 639px) 100vw, 90vw"
                  className="h-full w-full object-cover object-top"
                  priority
                />
              </div>
              {/* Name / role strip */}
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

          {/* Bio grid */}
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
            <Card className="space-y-5">
              <h2 className="font-serif text-3xl text-foreground">Biografía</h2>
              {candidate.biography.map((paragraph) => (
                <p key={paragraph} className="leading-8 text-slate-700">
                  {paragraph}
                </p>
              ))}
            </Card>

            <Card className="space-y-5">
              <h2 className="font-serif text-3xl text-foreground">Trayectoria</h2>
              <ul className="space-y-4 text-slate-700" role="list">
                {candidate.trajectory.map((item) => (
                  <li key={item} className="rounded-2xl bg-surface-alt p-4 leading-7">
                    {item}
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="space-y-5">
              <h2 className="font-serif text-3xl text-foreground">Valores</h2>
              <ul className="space-y-4 text-slate-700" role="list">
                {candidate.values.map((item) => (
                  <li key={item} className="rounded-2xl bg-surface-alt p-4 leading-7">
                    {item}
                  </li>
                ))}
              </ul>
            </Card>

            <div className="space-y-5 rounded-[1.75rem] border border-brand bg-brand p-5 shadow-soft sm:p-6 lg:p-7 text-white">
              <h2 className="font-serif text-3xl text-white">Visión para la comunidad</h2>
              <p className="leading-8 text-white/85">{candidate.vision}</p>
            </div>
          </div>

        </Container>
      </section>
    </>
  );
}

