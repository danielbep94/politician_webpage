import { CitizenContactBlock } from "@/components/home/CitizenContactBlock";
import { FeaturedProposals } from "@/components/home/FeaturedProposals";
import { HeroSection } from "@/components/home/HeroSection";
import { LatestNews } from "@/components/home/LatestNews";
import { PriorityGrid } from "@/components/home/PriorityGrid";
import { RecentActivities } from "@/components/home/RecentActivities";
import { UpcomingAgenda } from "@/components/home/UpcomingAgenda";
import { VolunteerBlock } from "@/components/home/VolunteerBlock";
import { StructuredData } from "@/components/seo/StructuredData";
import { prioritiesMock } from "@/lib/constants/mock-content";
import { buildOrganizationJsonLd } from "@/lib/seo/jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  getCandidate,
  getEvents,
  getFeaturedActivities,
  getFeaturedPosts,
  getFeaturedProposals,
  getSiteSettings
} from "@/lib/sanity/api";

export const metadata = buildPageMetadata({
  description:
    "Propuestas claras, agenda pública y participación ciudadana real para construir una comunidad mejor.",
  pathname: "/"
});

export default async function HomePage() {
  const [siteSettings, candidate, proposals, posts, activities, events] = await Promise.all([
    getSiteSettings(),
    getCandidate(),
    getFeaturedProposals(),
    getFeaturedPosts(),
    getFeaturedActivities(),
    getEvents()
  ]);

  return (
    <>
      <StructuredData data={buildOrganizationJsonLd(siteSettings, candidate)} />
      <HeroSection siteSettings={siteSettings} candidate={candidate} />
      <PriorityGrid priorities={prioritiesMock} />
      <FeaturedProposals proposals={proposals} />
      <LatestNews posts={posts} />
      <RecentActivities activities={activities} />
      <UpcomingAgenda events={events} />
      <CitizenContactBlock />
      <VolunteerBlock />
    </>
  );
}
