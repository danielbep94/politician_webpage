import type { ReactNode } from "react";

import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";

type PageIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
};

export function PageIntro({
  eyebrow,
  title,
  description,
  children
}: PageIntroProps) {
  return (
    <section className="border-b border-line bg-surface-alt py-14 sm:py-16 lg:py-20">
      <Container className="space-y-5 sm:space-y-6">
        <Badge>{eyebrow}</Badge>
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="space-y-4">
            <h1 className="max-w-3xl font-serif text-3xl tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {title}
            </h1>
            <p className="max-w-2xl text-base leading-8 text-slate-700 sm:text-[17px]">
              {description}
            </p>
          </div>
          {children ? <div className="lg:justify-self-end lg:self-end">{children}</div> : null}
        </div>
      </Container>
    </section>
  );
}
