import { readFile } from "node:fs/promises";
import path from "node:path";

import type { SanityClient } from "@sanity/client";
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
} from "../lib/constants/mock-content";
import { loadEnvConfig } from "@next/env";
import { normalizeBlockContent } from "../lib/portable-text";
import type {
  Activity,
  BlockContent,
  FileWithAsset,
  ImageWithAlt,
  MediaAsset,
  Post,
  PressRelease,
  SanityReference,
  Seo,
  SiteSettings,
  VideoEmbed
} from "../lib/types";

loadEnvConfig(process.cwd());

type SeedDocument = {
  _id: string;
  _type: string;
  [key: string]: unknown;
};

type WriteClient = SanityClient;

function createSlug(current: string) {
  return {
    _type: "slug",
    current
  };
}

function resolvePublicAssetPath(src: string) {
  return path.join(process.cwd(), "public", src.replace(/^\//, ""));
}

function createAssetCacheKey(assetType: "file" | "image", src: string) {
  return `${assetType}:${src}`;
}

function resolveContentType(src: string) {
  const extension = path.extname(src).toLowerCase();

  switch (extension) {
    case ".svg":
      return "image/svg+xml";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".gif":
      return "image/gif";
    case ".webp":
      return "image/webp";
    case ".pdf":
      return "application/pdf";
    case ".doc":
      return "application/msword";
    case ".docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case ".txt":
      return "text/plain";
    case ".zip":
      return "application/zip";
    default:
      return undefined;
  }
}

async function uploadImageAsset(
  writeClient: WriteClient,
  src: string,
  assetCache: Map<string, SanityReference>
) {
  const cacheKey = createAssetCacheKey("image", src);
  const cachedAsset = assetCache.get(cacheKey);

  if (cachedAsset) {
    return cachedAsset;
  }

  const file = await readFile(resolvePublicAssetPath(src));
  const contentType = resolveContentType(src);
  const asset = await writeClient.assets.upload("image", file, {
    filename: path.basename(src),
    ...(contentType ? { contentType } : {})
  });

  const reference: SanityReference = {
    _ref: asset._id,
    _type: "reference"
  };

  assetCache.set(cacheKey, reference);

  return reference;
}

async function uploadFileAsset(
  writeClient: WriteClient,
  src: string,
  assetCache: Map<string, SanityReference>
) {
  const cacheKey = createAssetCacheKey("file", src);
  const cachedAsset = assetCache.get(cacheKey);

  if (cachedAsset) {
    return cachedAsset;
  }

  const file = await readFile(resolvePublicAssetPath(src));
  const contentType = resolveContentType(src);
  const asset = await writeClient.assets.upload("file", file, {
    filename: path.basename(src),
    ...(contentType ? { contentType } : {})
  });

  const reference: SanityReference = {
    _ref: asset._id,
    _type: "reference"
  };

  assetCache.set(cacheKey, reference);

  return reference;
}

async function createImageField(
  image: ImageWithAlt,
  writeClient: WriteClient,
  assetCache: Map<string, SanityReference>,
  key?: string
) {
  const asset =
    image.asset ??
    (image.src ? await uploadImageAsset(writeClient, image.src, assetCache) : undefined);

  return {
    ...(key ? { _key: key } : {}),
    _type: "imageWithAlt",
    ...(asset ? { asset } : {}),
    alt: image.alt,
    ...(image.caption ? { caption: image.caption } : {})
  };
}

async function createFileField(
  file: FileWithAsset,
  writeClient: WriteClient,
  assetCache: Map<string, SanityReference>
) {
  const asset =
    file.asset ??
    (file.src ? await uploadFileAsset(writeClient, file.src, assetCache) : undefined);

  return {
    _type: "file",
    ...(asset ? { asset } : {})
  };
}

function createVideoField(video: VideoEmbed, key?: string) {
  return {
    ...(key ? { _key: key } : {}),
    _type: "videoEmbed",
    provider: video.provider,
    url: video.url,
    ...(video.title ? { title: video.title } : {})
  };
}

async function createPortableText(
  body: BlockContent,
  writeClient: WriteClient,
  assetCache: Map<string, SanityReference>
) {
  return Promise.all(
    body.map(async (item, index) => {
      const key = item._key ?? `${item._type}-${index + 1}`;

      if (item._type === "block") {
        return {
          _key: key,
          _type: "block",
          style: item.style ?? "normal",
          children: item.children.map((child, childIndex) => ({
            _key: child._key ?? `span-${index + 1}-${childIndex + 1}`,
            _type: "span",
            text: child.text,
            marks: child.marks ?? []
          })),
          markDefs: (item.markDefs ?? []).map((mark, markIndex) => ({
            _key: mark._key ?? `mark-${index + 1}-${markIndex + 1}`,
            _type: "link",
            href: mark.href,
            ...(typeof mark.openInNewTab === "boolean"
              ? { openInNewTab: mark.openInNewTab }
              : {})
          })),
          ...(item.listItem ? { listItem: item.listItem } : {}),
          ...(item.level ? { level: item.level } : {})
        };
      }

      if (item._type === "videoEmbed") {
        return createVideoField(item, key);
      }

      return createImageField(item, writeClient, assetCache, key);
    })
  );
}

async function createPostDocument(
  post: Post,
  writeClient: WriteClient,
  assetCache: Map<string, SanityReference>
): Promise<SeedDocument> {
  return {
    _id: `post.${post.slug}`,
    _type: "post",
    title: post.title,
    slug: createSlug(post.slug),
    excerpt: post.excerpt,
    body: await createPortableText(
      normalizeBlockContent(post.body),
      writeClient,
      assetCache
    ),
    category: post.category,
    publishedAt: post.publishedAt,
    readingTime: post.readingTime,
    featured: post.featured ?? false
  };
}

async function createSeoField(
  seo: Seo | undefined,
  writeClient: WriteClient,
  assetCache: Map<string, SanityReference>
) {
  if (!seo) {
    return undefined;
  }

  return {
    ...(seo.metaTitle ? { metaTitle: seo.metaTitle } : {}),
    ...(seo.metaDescription ? { metaDescription: seo.metaDescription } : {}),
    ...(seo.ogImage
      ? { ogImage: await createImageField(seo.ogImage, writeClient, assetCache) }
      : {}),
    ...(seo.canonical ? { canonical: seo.canonical } : {}),
    ...(typeof seo.noindex === "boolean" ? { noindex: seo.noindex } : {})
  };
}

async function createActivityDocument(
  activity: Activity,
  writeClient: WriteClient,
  assetCache: Map<string, SanityReference>
): Promise<SeedDocument> {
  const seo = await createSeoField(activity.seo, writeClient, assetCache);

  return {
    _id: `activity.${activity.slug}`,
    _type: "activity",
    title: activity.title,
    slug: createSlug(activity.slug),
    excerpt: activity.excerpt,
    body: await createPortableText(activity.body, writeClient, assetCache),
    activityDate: activity.activityDate,
    publishedAt: activity.publishedAt,
    location: activity.location,
    coverImage: await createImageField(activity.coverImage, writeClient, assetCache),
    gallery: await Promise.all(
      activity.gallery.map((image, index) =>
        createImageField(image, writeClient, assetCache, `gallery-${index + 1}`)
      )
    ),
    ...(activity.video ? { video: createVideoField(activity.video) } : {}),
    categories: activity.categories.map((category, index) => ({
      _key: `category-${index + 1}`,
      _type: "activityCategory",
      title: category.title,
      slug: createSlug(category.slug)
    })),
    featured: activity.featured ?? false,
    ...(activity.sourceEvent
      ? {
          sourceEvent: {
            _type: "reference",
            _ref: `event.${activity.sourceEvent.slug}`,
            _weak: true
          }
        }
      : {}),
    ...(seo ? { seo } : {})
  };
}

async function createSiteSettingsDocument(
  siteSettings: SiteSettings,
  writeClient: WriteClient,
  assetCache: Map<string, SanityReference>
): Promise<SeedDocument> {
  return {
    _id: "siteSettings.main",
    _type: "siteSettings",
    ...siteSettings,
    ...(siteSettings.defaultOgImageAsset
      ? {
          defaultOgImageAsset: await createImageField(
            siteSettings.defaultOgImageAsset,
            writeClient,
            assetCache
          )
        }
      : {})
  };
}

async function createPressReleaseDocument(
  release: PressRelease,
  writeClient: WriteClient,
  assetCache: Map<string, SanityReference>
): Promise<SeedDocument> {
  return {
    _id: `pressRelease.${release.slug}`,
    _type: "pressRelease",
    title: release.title,
    slug: createSlug(release.slug),
    excerpt: release.excerpt,
    publishedAt: release.publishedAt,
    summary: release.summary,
    downloadUrl: release.downloadUrl,
    ...(release.downloadFile
      ? {
          downloadFile: await createFileField(release.downloadFile, writeClient, assetCache)
        }
      : {})
  };
}

async function createMediaAssetDocument(
  asset: MediaAsset,
  index: number,
  writeClient: WriteClient,
  assetCache: Map<string, SanityReference>
): Promise<SeedDocument> {
  return {
    _id: `mediaAsset.${index + 1}`,
    _type: "mediaAsset",
    title: asset.title,
    kind: asset.kind,
    description: asset.description,
    fileUrl: asset.fileUrl,
    ...(asset.image
      ? { image: await createImageField(asset.image, writeClient, assetCache) }
      : {}),
    ...(asset.file ? { file: await createFileField(asset.file, writeClient, assetCache) } : {})
  };
}

async function main() {
  const { sanityWriteClient } = await import("../lib/sanity/client");
  const writeClient = sanityWriteClient;

  if (!writeClient) {
    throw new Error(
      "Sanity write client no esta configurado. Revisa SANITY_API_WRITE_TOKEN y variables publicas."
    );
  }

  const assetCache = new Map<string, SanityReference>();
  const siteSettingsDocument = await createSiteSettingsDocument(
    siteSettingsMock,
    writeClient,
    assetCache
  );
  const postDocuments = await Promise.all(
    postsMock.map((post) => createPostDocument(post, writeClient, assetCache))
  );
  const activityDocuments = await Promise.all(
    activitiesMock.map((activity) => createActivityDocument(activity, writeClient, assetCache))
  );
  const pressReleaseDocuments = await Promise.all(
    pressReleasesMock.map((release) =>
      createPressReleaseDocument(release, writeClient, assetCache)
    )
  );
  const mediaAssetDocuments = await Promise.all(
    mediaAssetsMock.map((asset, index) =>
      createMediaAssetDocument(asset, index, writeClient, assetCache)
    )
  );

  const documents: SeedDocument[] = [
    siteSettingsDocument,
    {
      _id: "candidate.main",
      _type: "candidate",
      ...candidateMock
    },
    ...proposalsMock.map((proposal) => ({
      _id: `proposal.${proposal.slug}`,
      _type: "proposal",
      ...proposal,
      slug: createSlug(proposal.slug)
    })),
    ...postDocuments,
    ...eventsMock.map((event) => ({
      _id: `event.${event.slug}`,
      _type: "event",
      ...event,
      slug: createSlug(event.slug)
    })),
    ...activityDocuments,
    ...pressReleaseDocuments,
    ...mediaAssetDocuments,
    ...faqsMock.map((faq, index) => ({
      _id: `faq.${index + 1}`,
      _type: "faq",
      ...faq
    }))
  ];

  await Promise.all(
    documents.map((document) => writeClient.createOrReplace<SeedDocument>(document))
  );

  console.info(`Se cargaron ${documents.length} documentos de ejemplo en Sanity.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
