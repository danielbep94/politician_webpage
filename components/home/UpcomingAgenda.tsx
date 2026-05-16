import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { EventCard } from "@/components/agenda/EventCard";
import { buttonVariants } from "@/components/ui/Button";
import type { Event } from "@/lib/types";

type UpcomingAgendaProps = {
  events: Event[];
};

export function UpcomingAgenda({ events }: UpcomingAgendaProps) {
  return (
    <section className="bg-surface-alt py-14 sm:py-16 lg:py-20">
      <Container className="space-y-8 sm:space-y-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand">
              Agenda próxima
            </p>
            <h2 className="font-serif text-3xl text-foreground sm:text-4xl">
              Lo que viene en agenda para abrir participación y organizar asistencia.
            </h2>
          </div>
          <Link
            href="/agenda"
            className={buttonVariants({
              variant: "secondary",
              className: "w-full sm:w-auto"
            })}
          >
            Ver agenda completa
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.slug} event={event} />
          ))}
        </div>
      </Container>
    </section>
  );
}
