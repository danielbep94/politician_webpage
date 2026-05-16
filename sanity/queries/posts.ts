import { groq } from "next-sanity";

export const postsQuery = groq`
  *[_type == "post"] | order(publishedAt desc){
    title,
    "slug": slug.current,
    excerpt,
    body,
    category,
    publishedAt,
    readingTime,
    featured
  }
`;

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0]{
    title,
    "slug": slug.current,
    excerpt,
    body,
    category,
    publishedAt,
    readingTime,
    featured
  }
`;
