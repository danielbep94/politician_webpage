import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { EventCard } from "@/components/agenda/EventCard";
import type { Event } from "@/lib/types";

type UpcomingAgendaProps = {
  events: Event[];
};

export function UpcomingAgenda({ events }: UpcomingAgendaProps) {
  return (
    <section className="bg-surface-alt py-14 sm:py-16 lg:py-20">
      <Container className="space-y-8 sm:space-y-10">
        <SectionHeader
          eyebrow="Agenda próxima"
          title="Lo que viene para abrir participación y organizar asistencia."
          ctaLabel="Ver agenda completa"
          ctaHref="/agenda"
        />
        {events.length === 0 ? (
          <p className="text-base text-slate-500">
            No hay eventos programados próximamente. Síguenos en redes para enterarte primero.
          </p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.slug} event={event} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
