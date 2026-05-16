import { groq } from "next-sanity";

export const eventsQuery = groq`
  *[_type == "event"] | order(date asc){
    title,
    "slug": slug.current,
    type,
    summary,
    date,
    time,
    location,
    isVirtual,
    ctaLabel,
    ctaHref
  }
`;

export const eventBySlugQuery = groq`
  *[_type == "event" && slug.current == $slug][0]{
    title,
    "slug": slug.current,
    type,
    summary,
    date,
    time,
    location,
    isVirtual,
    ctaLabel,
    ctaHref
  }
`;
