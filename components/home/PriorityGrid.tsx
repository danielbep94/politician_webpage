import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import type { Priority } from "@/lib/types";

type PriorityGridProps = {
  priorities: Priority[];
};

export function PriorityGrid({ priorities }: PriorityGridProps) {
  return (
    <section className="py-14 sm:py-16 lg:py-20">
      <Container className="space-y-8 sm:space-y-10">
        <div className="max-w-2xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand">
            Prioridades
          </p>
          <h2 className="font-serif text-3xl text-foreground sm:text-4xl">
            Lo urgente y lo importante en una agenda clara.
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {priorities.map((priority) => (
            <Card
              key={priority.title}
              className="h-full border-white/70 bg-white/95 transition duration-200 hover:-translate-y-1"
            >
              <h3 className="text-xl font-semibold text-foreground">
                {priority.title}
              </h3>
              <p className="mt-4 leading-7 text-slate-700">
                {priority.description}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
