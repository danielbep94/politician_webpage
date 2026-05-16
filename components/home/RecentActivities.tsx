import { ActivityCard } from "@/components/activities/ActivityCard";
import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/layout/SectionHeader";
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
        <SectionHeader
          eyebrow="Actividades recientes"
          title="Lo que ya ocurrió en territorio y vale la pena documentar con contexto."
          ctaLabel="Ver actividades"
          ctaHref="/actividades"
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {activities.map((activity) => (
            <ActivityCard key={activity.slug} activity={activity} />
          ))}
        </div>
      </Container>
    </section>
  );
}
