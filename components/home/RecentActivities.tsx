import Link from "next/link";

import { ActivityCard } from "@/components/activities/ActivityCard";
import { Container } from "@/components/layout/Container";
import { buttonVariants } from "@/components/ui/Button";
import type { Activity } from "@/lib/types";

type RecentActivitiesProps = {
  activities: Activity[];
};

export function RecentActivities({ activities }: RecentActivitiesProps) {
  if (activities.length === 0) {
    return null;
  }

  return (
    <section className="py-14 sm:py-16 lg:py-20">
      <Container className="space-y-8 sm:space-y-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand">
              Actividades recientes
            </p>
            <h2 className="font-serif text-3xl text-foreground sm:text-4xl">
              Lo que ya ocurrió en territorio y vale la pena documentar con contexto.
            </h2>
          </div>
          <Link
            href="/actividades"
            className={buttonVariants({
              variant: "secondary",
              className: "w-full sm:w-auto"
            })}
          >
            Ver actividades
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {activities.map((activity) => (
            <ActivityCard key={activity.slug} activity={activity} />
          ))}
        </div>
      </Container>
    </section>
  );
}
