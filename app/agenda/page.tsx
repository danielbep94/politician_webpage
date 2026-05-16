import { Container } from "@/components/layout/Container";
import { EventCard } from "@/components/agenda/EventCard";
import { PageIntro } from "@/components/seo/PageIntro";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getEvents } from "@/lib/sanity/api";

export const metadata = buildPageMetadata({
  title: "Agenda",
  description:
    "Eventos próximos, recorridos, reuniones comunitarias y actividades públicas.",
  pathname: "/agenda"
});

export default async function AgendaPage() {
  const allEvents = await getEvents();

  // Show only upcoming events (today and forward)
  const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
  const events = allEvents.filter((event) => event.date >= today);

  return (
    <>
      <PageIntro
        eyebrow="Agenda"
        title="Presencia en territorio y actividades abiertas."
        description="La agenda pública ayuda a construir cercanía, asistencia organizada y transparencia sobre las actividades de campaña e institucionales."
      />

      <section className="py-16 sm:py-20">
        <Container>
          {events.length === 0 ? (
            <div className="rounded-[1.75rem] border border-line bg-surface-alt px-8 py-14 text-center">
              <p className="font-serif text-2xl text-foreground">
                No hay eventos próximos por el momento.
              </p>
              <p className="mt-3 text-base text-slate-500">
                Síguenos en redes sociales para enterarte primero de los próximos eventos.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard key={event.slug} event={event} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
