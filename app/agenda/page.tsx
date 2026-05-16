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
  const events = await getEvents();

  return (
    <>
      <PageIntro
        eyebrow="Agenda"
        title="Presencia en territorio y actividades abiertas."
        description="La agenda pública ayuda a construir cercanía, asistencia organizada y transparencia sobre las actividades de campaña e institucionales."
      />

      <section className="py-16 sm:py-20">
        <Container className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.slug} event={event} />
          ))}
        </Container>
      </section>
    </>
  );
}
