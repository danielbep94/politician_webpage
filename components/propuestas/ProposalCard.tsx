import Link from "next/link";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { buttonVariants } from "@/components/ui/Button";
import type { Proposal } from "@/lib/types";

type ProposalCardProps = {
  proposal: Proposal;
};

export function ProposalCard({ proposal }: ProposalCardProps) {
  return (
    <Card className="flex h-full flex-col justify-between gap-6 transition duration-200 hover:-translate-y-1 hover:border-brand/30">
      <div className="space-y-4">
        <Badge>{proposal.theme}</Badge>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
            {proposal.title}
          </h3>
          <p className="leading-7 text-slate-700">{proposal.summary}</p>
        </div>
      </div>
      <Link
        href={`/propuestas/${proposal.slug}`}
        className={buttonVariants({
          variant: "secondary",
          className: "mt-auto w-full sm:w-fit"
        })}
      >
        Ver propuesta
      </Link>
    </Card>
  );
}
