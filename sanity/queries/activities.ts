import { groq } from "next-sanity";

const activityProjection = `
  title,
  "slug": slug.current,
  excerpt,
  body,
  activityDate,
  publishedAt,
  location,
  coverImage{
    asset,
    alt,
    caption
  },
  gallery[]{
    asset,
    alt,
    caption
  },
  video{
    provider,
    url,
    title
  },
  categories[]{
    title,
    "slug": slug.current
  },
  featured,
  sourceEvent->{
    title,
    "slug": slug.current
  },
  seo{
    metaTitle,
    metaDescription,
    ogImage{
      asset,
      alt,
      caption
    },
    canonical,
    noindex
  }
`;

export const activitiesQuery = groq`
  *[_type == "activity"] | order(activityDate desc, publishedAt desc){
    ${activityProjection}
  }
`;

export const activityBySlugQuery = groq`
  *[_type == "activity" && slug.current == $slug][0]{
    ${activityProjection}
  }
`;
