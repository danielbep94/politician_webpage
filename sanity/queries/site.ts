import { groq } from "next-sanity";

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0]{
    title,
    description,
    url,
    locale,
    contactEmail,
    heroMessage,
    heroSubheadline,
    defaultOgImageAsset,
    "defaultOgImage": coalesce(defaultOgImageAsset.asset->url, defaultOgImage)
  }
`;

export const candidateQuery = groq`
  *[_type == "candidate"][0]{
    name,
    shortName,
    role,
    location,
    headline,
    summary,
    biography,
    trajectory,
    values,
    vision,
    email,
    phone,
    socialLinks
  }
`;

export const faqQuery = groq`
  *[_type == "faq"] | order(_createdAt asc){
    question,
    answer
  }
`;
