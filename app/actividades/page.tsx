import { Container } from "@/components/layout/Container";
import { ActivityCard } from "@/components/activities/ActivityCard";
import { PageIntro } from "@/components/seo/PageIntro";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getActivities } from "@/lib/sanity/api";

export const metadata = buildPageMetadata({
  title: "Actividades",
  description:
    "Archivo público de actividades realizadas, recorridos, encuentros y acciones documentadas en territorio.",
  pathname: "/actividades"
});

export default async function ActivitiesPage() {
  const activities = await getActivities();

  return (
    <>
      <PageIntro
        eyebrow="Actividades"
        title="Memoria pública de lo que ya hicimos con la comunidad."
        description="Aquí viven las actividades realizadas: recorridos, encuentros, asambleas y registros que ayudan a dar contexto, continuidad y trazabilidad al trabajo territorial."
      />

      <section className="py-16 sm:py-20">
        <Container className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {activities.map((activity) => (
            <ActivityCard key={activity.slug} activity={activity} />
          ))}
        </Container>
      </section>
    </>
  );
}
