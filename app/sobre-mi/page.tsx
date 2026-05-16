import { Container } from "@/components/layout/Container";
import { PageIntro } from "@/components/seo/PageIntro";
import { Card } from "@/components/ui/Card";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getCandidate } from "@/lib/sanity/api";

export const metadata = buildPageMetadata({
  title: "Sobre mí",
  description:
    "Biografía, trayectoria, valores y visión comunitaria de la candidata.",
  pathname: "/sobre-mi"
});

export default async function AboutPage() {
  const candidate = await getCandidate();

  return (
    <>
      <PageIntro
        eyebrow="Sobre mí"
        title={candidate.name}
        description={candidate.summary}
      />

      <section className="py-16 sm:py-20">
        <Container className="grid gap-8 lg:grid-cols-[1fr_1fr]">
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
            <ul className="space-y-4 text-slate-700">
              {candidate.trajectory.map((item) => (
                <li key={item} className="rounded-2xl bg-surface-alt p-4 leading-7">
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="space-y-5">
            <h2 className="font-serif text-3xl text-foreground">Valores</h2>
            <ul className="space-y-4 text-slate-700">
              {candidate.values.map((item) => (
                <li key={item} className="rounded-2xl bg-surface-alt p-4 leading-7">
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="space-y-5 bg-brand text-white">
            <h2 className="font-serif text-3xl">Visión para la comunidad</h2>
            <p className="leading-8 text-white/85">{candidate.vision}</p>
          </Card>
        </Container>
      </section>
    </>
  );
}
