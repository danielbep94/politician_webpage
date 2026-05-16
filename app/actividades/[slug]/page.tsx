import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ActivityGallery } from "@/components/activities/ActivityGallery";
import { ActivityVideoBlock } from "@/components/activities/ActivityVideoBlock";
import { Container } from "@/components/layout/Container";
import { PortableTextRenderer } from "@/components/portable-text/PortableTextRenderer";
import { PageIntro } from "@/components/seo/PageIntro";
import { StructuredData } from "@/components/seo/StructuredData";
import { Badge } from "@/components/ui/Badge";
import { buttonVariants } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { siteConfig } from "@/lib/constants/site";
import { buildActivityJsonLd } from "@/lib/seo/jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { resolveImageUrl } from "@/lib/sanity/image";
import {
  getActivities,
  getActivityBySlug,
  getCandidate
} from "@/lib/sanity/api";
import { formatDate } from "@/lib/utils";

type ActivityDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const activities = await getActivities();
  return activities.map((activity) => ({ slug: activity.slug }));
}

export async function generateMetadata({ params }: ActivityDetailPageProps) {
  const { slug } = await params;
  const activity = await getActivityBySlug(slug);

  if (!activity) {
    return buildPageMetadata({
      title: "Actividad no encontrada",
      description: "La actividad solicitada no existe.",
      pathname: `/actividades/${slug}`
    });
  }

  return buildPageMetadata({
    title: activity.title,
    description: activity.excerpt,
    pathname: `/actividades/${activity.slug}`,
    seo: activity.seo,
    image: activity.coverImage,
    type: "article",
    publishedTime: activity.publishedAt
  });
}

export default async function ActivityDetailPage({
  params
}: ActivityDetailPageProps) {
  const { slug } = await params;
  const [activity, candidate] = await Promise.all([
    getActivityBySlug(slug),
    getCandidate()
  ]);

  if (!activity) {
    notFound();
  }

  const coverImageUrl = resolveImageUrl(activity.coverImage, {
    width: 1600,
    height: 900,
    fit: "crop"
  });

  return (
    <>
      <StructuredData data={buildActivityJsonLd(activity, candidate, siteConfig.url)} />
      <PageIntro
        eyebrow={activity.categories[0]?.title || "Actividad"}
        title={activity.title}
        description={activity.excerpt}
      >
        <Card className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {activity.categories.map((category) => (
              <Badge key={category.slug}>{category.title}</Badge>
            ))}
          </div>
          <p className="text-sm text-slate-500">{formatDate(activity.activityDate)}</p>
          <p className="text-sm text-slate-500">{activity.location}</p>
          {activity.sourceEvent ? (
            <p className="text-sm text-slate-500">
              Evento origen:{" "}
              <Link
                href="/agenda"
                className="font-medium text-brand transition hover:opacity-80"
              >
                {activity.sourceEvent.title}
              </Link>
            </p>
          ) : null}
        </Card>
      </PageIntro>

      <section className="py-16 sm:py-20">
        <Container className="space-y-10">
          {coverImageUrl ? (
            <figure className="overflow-hidden rounded-[2rem] border border-line bg-white p-4 shadow-soft sm:p-5">
              <Image
                src={coverImageUrl}
                alt={activity.coverImage.alt}
                width={1600}
                height={900}
                sizes="100vw"
                className="aspect-[16/9] w-full rounded-[1.5rem] object-cover"
              />
              {activity.coverImage.caption ? (
                <figcaption className="px-1 pt-4 text-sm leading-6 text-slate-500">
                  {activity.coverImage.caption}
                </figcaption>
              ) : null}
            </figure>
          ) : null}

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
            <Card className="p-6 sm:p-8 lg:p-10">
              <PortableTextRenderer value={activity.body} />
            </Card>

            <aside className="space-y-5">
              <Card className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
                  Ficha rápida
                </p>
                <div className="space-y-3 text-sm leading-7 text-slate-600">
                  <p>
                    <span className="font-semibold text-foreground">Fecha:</span>{" "}
                    {formatDate(activity.activityDate)}
                  </p>
                  <p>
                    <span className="font-semibold text-foreground">Publicado:</span>{" "}
                    {formatDate(activity.publishedAt)}
                  </p>
                  <p>
                    <span className="font-semibold text-foreground">Lugar:</span>{" "}
                    {activity.location}
                  </p>
                </div>
              </Card>

              <Link
                href="/actividades"
                className={buttonVariants({
                  variant: "secondary",
                  className: "w-full"
                })}
              >
                Volver a actividades
              </Link>
            </aside>
          </div>

          <ActivityVideoBlock video={activity.video} />
          <ActivityGallery images={activity.gallery} />
        </Container>
      </section>
    </>
  );
}
