export const SANITY_TAGS = {
  all: "sanity",
  siteSettings: "siteSettings",
  candidate: "candidate",
  proposals: "proposals",
  proposal: (slug: string) => `proposal:${slug}`,
  posts: "posts",
  post: (slug: string) => `post:${slug}`,
  events: "events",
  event: (slug: string) => `event:${slug}`,
  activities: "activities",
  activity: (slug: string) => `activity:${slug}`,
  pressReleases: "pressReleases",
  pressRelease: (slug: string) => `pressRelease:${slug}`,
  mediaAssets: "mediaAssets",
  faqs: "faqs"
} as const;

const SANITY_COLLECTION_TAGS = {
  siteSettings: SANITY_TAGS.siteSettings,
  candidate: SANITY_TAGS.candidate,
  proposal: SANITY_TAGS.proposals,
  post: SANITY_TAGS.posts,
  event: SANITY_TAGS.events,
  activity: SANITY_TAGS.activities,
  pressRelease: SANITY_TAGS.pressReleases,
  mediaAsset: SANITY_TAGS.mediaAssets,
  faq: SANITY_TAGS.faqs
} as const;

const SANITY_DOCUMENT_TAG_BUILDERS = {
  proposal: SANITY_TAGS.proposal,
  post: SANITY_TAGS.post,
  event: SANITY_TAGS.event,
  activity: SANITY_TAGS.activity,
  pressRelease: SANITY_TAGS.pressRelease
} as const;

type SanityCollectionType = keyof typeof SANITY_COLLECTION_TAGS;
type SanityDocumentType = keyof typeof SANITY_DOCUMENT_TAG_BUILDERS;

export function buildSanityTags(tags: string[] = []) {
  return Array.from(new Set([SANITY_TAGS.all, ...tags]));
}

export function getSanityCollectionTag(type?: string | null) {
  if (!type) {
    return null;
  }

  return SANITY_COLLECTION_TAGS[type as SanityCollectionType] ?? null;
}

export function getSanityDocumentTag(type?: string | null, slug?: string | null) {
  if (!type || !slug) {
    return null;
  }

  const builder = SANITY_DOCUMENT_TAG_BUILDERS[type as SanityDocumentType];
  return builder ? builder(slug) : null;
}

export function getSanityRevalidationTags(type?: string | null, slug?: string | null) {
  const tags = [
    getSanityCollectionTag(type),
    getSanityDocumentTag(type, slug)
  ].filter(Boolean) as string[];

  return tags.length > 0 ? buildSanityTags(tags) : [];
}

export function getSanityRevalidationPaths(type?: string | null, slug?: string | null) {
  switch (type) {
    case "siteSettings":
      return ["/"];
    case "candidate":
      return ["/", "/sobre-mi", "/contacto"];
    case "proposal":
      return ["/", "/propuestas", "/sitemap.xml", slug ? `/propuestas/${slug}` : null].filter(
        Boolean
      ) as string[];
    case "post":
      return ["/", "/noticias", "/sitemap.xml", slug ? `/noticias/${slug}` : null].filter(
        Boolean
      ) as string[];
    case "event":
      return ["/", "/agenda"];
    case "activity":
      return ["/", "/actividades", "/sitemap.xml", slug ? `/actividades/${slug}` : null].filter(
        Boolean
      ) as string[];
    case "pressRelease":
    case "mediaAsset":
      return ["/prensa"];
    default:
      return [];
  }
}
