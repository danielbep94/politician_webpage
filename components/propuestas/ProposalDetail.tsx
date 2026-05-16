import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { buttonVariants } from "@/components/ui/Button";
import type { Proposal } from "@/lib/types";

type ProposalDetailProps = {
  proposal: Proposal;
};

export function ProposalDetail({ proposal }: ProposalDetailProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-8">
        <Card className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">Problema</h2>
          <p className="leading-8 text-slate-700">{proposal.problem}</p>
        </Card>

        <Card className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">Contexto</h2>
          <p className="leading-8 text-slate-700">{proposal.context}</p>
        </Card>

        <Card className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">Propuesta</h2>
          <p className="leading-8 text-slate-700">{proposal.proposal}</p>
        </Card>
      </div>

      <div className="space-y-8">
        <Card className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Acciones concretas</h2>
          <ul className="space-y-3 text-slate-700">
            {proposal.actions.map((action) => (
              <li key={action} className="rounded-2xl bg-surface-alt p-4 leading-7">
                {action}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Impacto esperado</h2>
          <ul className="space-y-3 text-slate-700">
            {proposal.expectedImpact.map((impact) => (
              <li key={impact} className="rounded-2xl bg-surface-alt p-4 leading-7">
                {impact}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="space-y-4 bg-brand text-white">
          <h2 className="text-xl font-semibold">CTA ciudadano</h2>
          <p className="leading-8 text-white/85">{proposal.citizenCta}</p>
          <Link
            href="/contacto"
            className={buttonVariants({
              variant: "secondary",
              className: "w-fit border-white/30 bg-white text-brand hover:bg-white"
            })}
          >
            Participar en esta propuesta
          </Link>
        </Card>
      </div>
    </div>
  );
}
