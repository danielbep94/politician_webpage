import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { ProposalCard } from "@/components/propuestas/ProposalCard";
import type { Proposal } from "@/lib/types";

type FeaturedProposalsProps = {
  proposals: Proposal[];
};

export function FeaturedProposals({ proposals }: FeaturedProposalsProps) {
  return (
    <section className="bg-surface-alt py-14 sm:py-16 lg:py-20">
      <Container className="space-y-8 sm:space-y-10">
        <SectionHeader
          eyebrow="Propuestas destacadas"
          title="Soluciones concretas para problemas que la comunidad vive todos los días."
          ctaLabel="Ver todas"
          ctaHref="/propuestas"
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {proposals.map((proposal) => (
            <ProposalCard key={proposal.slug} proposal={proposal} />
          ))}
        </div>
      </Container>
    </section>
  );
}
