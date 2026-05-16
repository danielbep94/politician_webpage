import { siteConfig } from "@/lib/constants/site";
import { resolveImageUrl } from "@/lib/sanity/image";
import type { Activity, Candidate, Post, Proposal, SiteSettings } from "@/lib/types";

export function buildOrganizationJsonLd(
  siteSettings: SiteSettings,
  candidate: Candidate
) {
  return {
    "@context": "https://schema.org",
    "@type": "PoliticalParty",
    name: siteSettings.title,
    description: siteSettings.description,
    url: siteSettings.url,
    email: siteSettings.contactEmail,
    member: {
      "@type": "Person",
      name: candidate.name,
      jobTitle: candidate.role
    }
  };
}

export function buildProposalJsonLd(proposal: Proposal, baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: proposal.title,
    description: proposal.summary,
    url: `${baseUrl}/propuestas/${proposal.slug}`,
    about: proposal.theme
  };
}

export function buildArticleJsonLd(post: Post, candidate: Candidate, baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: {
      "@type": "Person",
      name: candidate.name
    },
    url: `${baseUrl}/noticias/${post.slug}`
  };
}

export function buildActivityJsonLd(
  activity: Activity,
  candidate: Candidate,
  baseUrl: string
) {
  const imageUrl =
    resolveImageUrl(activity.seo?.ogImage || activity.coverImage, {
      width: 1200,
      height: 630,
      fit: "crop"
    }) || siteConfig.defaultOgImage;

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: activity.title,
    description: activity.excerpt,
    startDate: activity.activityDate,
    endDate: activity.activityDate,
    eventStatus: "https://schema.org/EventCompleted",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: activity.location
    },
    image: [new URL(imageUrl, baseUrl).toString()],
    url: `${baseUrl}/actividades/${activity.slug}`,
    keywords: activity.categories.map((category) => category.title),
    organizer: {
      "@type": "Person",
      name: candidate.name,
      jobTitle: candidate.role
    },
    ...(activity.sourceEvent
      ? {
          superEvent: {
            "@type": "Event",
            name: activity.sourceEvent.title,
            url: `${baseUrl}/agenda`
          }
        }
      : {})
  };
}
