import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { ProposalCard } from "@/components/propuestas/ProposalCard";
import { buttonVariants } from "@/components/ui/Button";
import type { Proposal } from "@/lib/types";

type FeaturedProposalsProps = {
  proposals: Proposal[];
};

export function FeaturedProposals({ proposals }: FeaturedProposalsProps) {
  return (
    <section className="bg-surface-alt py-14 sm:py-16 lg:py-20">
      <Container className="space-y-8 sm:space-y-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand">
              Propuestas destacadas
            </p>
            <h2 className="font-serif text-3xl text-foreground sm:text-4xl">
              Soluciones concretas para problemas que la comunidad vive todos los días.
            </h2>
          </div>
          <Link
            href="/propuestas"
            className={buttonVariants({
              variant: "secondary",
              className: "w-full sm:w-auto"
            })}
          >
            Ver todas
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {proposals.map((proposal) => (
            <ProposalCard key={proposal.slug} proposal={proposal} />
          ))}
        </div>
      </Container>
    </section>
  );
}
