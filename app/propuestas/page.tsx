import { Container } from "@/components/layout/Container";
import { PageIntro } from "@/components/seo/PageIntro";
import { ProposalCard } from "@/components/propuestas/ProposalCard";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getProposals } from "@/lib/sanity/api";

export const metadata = buildPageMetadata({
  title: "Propuestas",
  description:
    "Propuestas organizadas por tema con problema, contexto, acciones e impacto esperado.",
  pathname: "/propuestas"
});

export default async function ProposalsPage() {
  const proposals = await getProposals();

  const grouped = proposals.reduce<Record<string, typeof proposals>>((acc, proposal) => {
    acc[proposal.theme] = [...(acc[proposal.theme] || []), proposal];
    return acc;
  }, {});

  return (
    <>
      <PageIntro
        eyebrow="Propuestas"
        title="Una plataforma con prioridades claras y ejecución aterrizada."
        description="Cada propuesta parte de un problema real, explica contexto, define acciones concretas y propone una forma de participación ciudadana."
      />

      <section className="py-16 sm:py-20">
        <Container className="space-y-12">
          {Object.entries(grouped).map(([theme, themeProposals]) => (
            <div key={theme} className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand">
                  {theme}
                </p>
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                {themeProposals.map((proposal) => (
                  <ProposalCard key={proposal.slug} proposal={proposal} />
                ))}
              </div>
            </div>
          ))}
        </Container>
      </section>
    </>
  );
}
