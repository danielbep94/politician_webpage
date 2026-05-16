import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Card } from "@/components/ui/Card";
import type { Priority } from "@/lib/types";

type PriorityGridProps = {
  priorities: Priority[];
};

export function PriorityGrid({ priorities }: PriorityGridProps) {
  return (
    <section className="py-14 sm:py-16 lg:py-20">
      <Container className="space-y-8 sm:space-y-10">
        <SectionHeader
          eyebrow="Prioridades"
          title="Lo urgente y lo importante en una agenda clara."
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {priorities.map((priority, index) => (
            <Card
              key={priority.title}
              className="h-full border-white/70 bg-white/95 transition duration-200 hover:-translate-y-1"
            >
              <p className="font-mono text-3xl font-bold leading-none text-brand/20">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 text-xl font-semibold text-foreground">
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
