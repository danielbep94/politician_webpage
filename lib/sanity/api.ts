import {
  activitiesQuery,
  activityBySlugQuery,
  candidateQuery,
  eventBySlugQuery,
  eventsQuery,
  faqQuery,
  mediaAssetsQuery,
  postBySlugQuery,
  postsQuery,
  pressReleaseBySlugQuery,
  pressReleasesQuery,
  proposalBySlugQuery,
  proposalsQuery,
  siteSettingsQuery
} from "@/sanity/queries";
import {
  activitiesMock,
  candidateMock,
  eventsMock,
  faqsMock,
  mediaAssetsMock,
  postsMock,
  pressReleasesMock,
  proposalsMock,
  siteSettingsMock
} from "@/lib/constants/mock-content";
import type {
  Activity,
  BlockContent,
  Candidate,
  Event,
  FAQ,
  MediaAsset,
  Post,
  PressRelease,
  Proposal,
  SiteSettings
} from "@/lib/types";
import { sanityClient } from "@/lib/sanity/client";
import type { QueryParams } from "next-sanity";
import { normalizeBlockContent } from "@/lib/portable-text";
import { buildSanityTags, SANITY_TAGS } from "@/lib/sanity/tags";

type SanityFetchOptions<T> = {
  query: string;
  fallback: T;
  params?: QueryParams;
  revalidate?: number | false;
  tags?: string[];
};

async function sanityFetch<T>({
  query,
  fallback,
  params = {},
  revalidate = 300,
  tags = []
}: SanityFetchOptions<T>) {
  if (!sanityClient) {
    return fallback;
  }

  try {
    const result = await sanityClient.fetch<T | null>(query, params, {
      cache: "force-cache",
      next: {
        revalidate: tags.length > 0 ? false : revalidate,
        tags: buildSanityTags(tags)
      }
    });

    // Use fallback when Sanity returns null or an empty array (CMS not yet populated)
    if (result === null || result === undefined) {
      return fallback;
    }
    if (Array.isArray(result) && result.length === 0 && Array.isArray(fallback) && fallback.length > 0) {
      return fallback;
    }
    return result;
  } catch {
    return fallback;
  }
}

function normalizePost<T extends Post | null>(post: T): T {
  if (!post) {
    return post;
  }

  return {
    ...post,
    body: normalizeBlockContent(post.body as BlockContent | string[])
  } as T;
}

function normalizePosts(posts: Post[]) {
  return posts.map((post) => normalizePost(post)).filter(Boolean) as Post[];
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return sanityFetch({
    query: siteSettingsQuery,
    fallback: siteSettingsMock,
    tags: [SANITY_TAGS.siteSettings]
  });
}

export async function getCandidate(): Promise<Candidate> {
  return sanityFetch({
    query: candidateQuery,
    fallback: candidateMock,
    tags: [SANITY_TAGS.candidate]
  });
}

export async function getProposals(): Promise<Proposal[]> {
  return sanityFetch({
    query: proposalsQuery,
    fallback: proposalsMock,
    tags: [SANITY_TAGS.proposals]
  });
}

export async function getFeaturedProposals(): Promise<Proposal[]> {
  const proposals = await getProposals();
  return proposals.filter((proposal) => proposal.featured);
}

export async function getProposalBySlug(slug: string): Promise<Proposal | null> {
  const fallback = proposalsMock.find((proposal) => proposal.slug === slug) ?? null;
  return sanityFetch({
    query: proposalBySlugQuery,
    fallback,
    params: { slug },
    tags: [SANITY_TAGS.proposals, SANITY_TAGS.proposal(slug)]
  });
}

export async function getPosts(): Promise<Post[]> {
  const posts = await sanityFetch({
    query: postsQuery,
    fallback: postsMock,
    tags: [SANITY_TAGS.posts]
  });

  return normalizePosts(posts);
}

export async function getFeaturedPosts(): Promise<Post[]> {
  const posts = await getPosts();
  return posts.filter((post) => post.featured);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const fallback = postsMock.find((post) => post.slug === slug) ?? null;
  const post = await sanityFetch({
    query: postBySlugQuery,
    fallback,
    params: { slug },
    tags: [SANITY_TAGS.posts, SANITY_TAGS.post(slug)]
  });

  return normalizePost(post);
}

export async function getEvents(): Promise<Event[]> {
  return sanityFetch({
    query: eventsQuery,
    fallback: eventsMock,
    tags: [SANITY_TAGS.events]
  });
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  const fallback = eventsMock.find((event) => event.slug === slug) ?? null;
  return sanityFetch({
    query: eventBySlugQuery,
    fallback,
    params: { slug },
    tags: [SANITY_TAGS.events, SANITY_TAGS.event(slug)]
  });
}

export async function getActivities(): Promise<Activity[]> {
  return sanityFetch({
    query: activitiesQuery,
    fallback: activitiesMock,
    tags: [SANITY_TAGS.activities]
  });
}

export async function getFeaturedActivities(): Promise<Activity[]> {
  const activities = await getActivities();
  return activities.filter((activity) => activity.featured);
}

export async function getActivityBySlug(slug: string): Promise<Activity | null> {
  const fallback = activitiesMock.find((activity) => activity.slug === slug) ?? null;
  return sanityFetch({
    query: activityBySlugQuery,
    fallback,
    params: { slug },
    tags: [SANITY_TAGS.activities, SANITY_TAGS.activity(slug)]
  });
}

export async function getPressReleases(): Promise<PressRelease[]> {
  return sanityFetch({
    query: pressReleasesQuery,
    fallback: pressReleasesMock,
    tags: [SANITY_TAGS.pressReleases]
  });
}

export async function getPressReleaseBySlug(
  slug: string
): Promise<PressRelease | null> {
  const fallback =
    pressReleasesMock.find((release) => release.slug === slug) ?? null;
  return sanityFetch({
    query: pressReleaseBySlugQuery,
    fallback,
    params: { slug },
    tags: [SANITY_TAGS.pressReleases, SANITY_TAGS.pressRelease(slug)]
  });
}

export async function getMediaAssets(): Promise<MediaAsset[]> {
  return sanityFetch({
    query: mediaAssetsQuery,
    fallback: mediaAssetsMock,
    tags: [SANITY_TAGS.mediaAssets]
  });
}

export async function getFaqs(): Promise<FAQ[]> {
  return sanityFetch({
    query: faqQuery,
    fallback: faqsMock,
    tags: [SANITY_TAGS.faqs]
  });
}
