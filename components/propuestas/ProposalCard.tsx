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

        {/* Citizen CTA callout — surfaces the action prompt from the detail page */}
        {proposal.citizenCta && (
          <div className="flex items-start gap-2.5 rounded-2xl bg-brand-soft px-4 py-3">
            {/* Megaphone icon */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mt-0.5 h-4 w-4 shrink-0 text-brand"
              aria-hidden="true"
            >
              <path d="M3 11l18-5v12L3 14v-3z" />
              <path d="M11.6 16.8a3 3 0 11-5.8-1.6" />
            </svg>
            <p className="text-sm leading-6 text-brand">
              {proposal.citizenCta}
            </p>
          </div>
        )}
      </div>

      <Link
        href={`/propuestas/${proposal.slug}`}
        aria-label={`Ver propuesta: ${proposal.title}`}
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

