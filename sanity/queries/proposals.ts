import { groq } from "next-sanity";

export const proposalsQuery = groq`
  *[_type == "proposal"] | order(featured desc, _createdAt asc){
    title,
    "slug": slug.current,
    theme,
    summary,
    problem,
    context,
    proposal,
    actions,
    expectedImpact,
    citizenCta,
    featured
  }
`;

export const proposalBySlugQuery = groq`
  *[_type == "proposal" && slug.current == $slug][0]{
    title,
    "slug": slug.current,
    theme,
    summary,
    problem,
    context,
    proposal,
    actions,
    expectedImpact,
    citizenCta,
    featured
  }
`;
