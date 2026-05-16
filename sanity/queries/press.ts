import { groq } from "next-sanity";

export const pressReleasesQuery = groq`
  *[_type == "pressRelease"] | order(publishedAt desc){
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    summary,
    downloadFile,
    "downloadUrl": coalesce(downloadFile.asset->url, downloadUrl)
  }
`;

export const pressReleaseBySlugQuery = groq`
  *[_type == "pressRelease" && slug.current == $slug][0]{
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    summary,
    downloadFile,
    "downloadUrl": coalesce(downloadFile.asset->url, downloadUrl)
  }
`;

export const mediaAssetsQuery = groq`
  *[_type == "mediaAsset"] | order(_createdAt desc){
    title,
    kind,
    description,
    image,
    file,
    "fileUrl": coalesce(image.asset->url, file.asset->url, fileUrl)
  }
`;
