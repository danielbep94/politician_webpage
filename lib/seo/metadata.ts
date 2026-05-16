import type { Metadata } from "next";

import { siteConfig } from "@/lib/constants/site";
import { resolveImageUrl } from "@/lib/sanity/image";
import type { ImageWithAlt, Seo } from "@/lib/types";

type MetadataInput = {
  title: string;
  description: string;
  pathname?: string;
  seo?: Seo;
  image?: ImageWithAlt;
  type?: "website" | "article";
  publishedTime?: string;
};

function toAbsoluteUrl(url: string) {
  return new URL(url, siteConfig.url).toString();
}

function resolveMetadataImage(image: ImageWithAlt | undefined, fallbackAlt: string) {
  const imageUrl = image
    ? resolveImageUrl(image, {
        width: 1200,
        height: 630,
        fit: "crop"
      })
    : null;

  return {
    url: toAbsoluteUrl(imageUrl || siteConfig.defaultOgImage),
    alt: image?.alt || fallbackAlt
  };
}

export function buildPageMetadata({
  title,
  description,
  pathname = "/",
  seo,
  image,
  type = "website",
  publishedTime
}: MetadataInput): Metadata {
  const metaTitle = seo?.metaTitle?.trim() || title;
  const metaDescription = seo?.metaDescription?.trim() || description;
  const canonical = seo?.canonical || toAbsoluteUrl(pathname);
  const socialTitle = seo?.metaTitle?.trim() || `${title} | ${siteConfig.name}`;
  const socialImage = resolveMetadataImage(seo?.ogImage || image, socialTitle);

  return {
    title: seo?.metaTitle ? { absolute: seo.metaTitle } : title,
    description: metaDescription,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical
    },
    robots: seo?.noindex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false
          }
        }
      : undefined,
    openGraph: {
      title: socialTitle,
      description: metaDescription,
      url: canonical,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      ...(type === "article" && publishedTime ? { publishedTime } : {}),
      images: [
        {
          url: socialImage.url,
          width: 1200,
          height: 630,
          alt: socialImage.alt
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: metaDescription,
      images: [socialImage.url]
    }
  };
}
