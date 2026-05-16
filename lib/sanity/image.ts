import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { sanityClient } from "@/lib/sanity/client";
import type { ImageWithAlt } from "@/lib/types";

const builder = sanityClient ? imageUrlBuilder(sanityClient) : null;

type ImageSource = SanityImageSource | ImageWithAlt | null | undefined;
type ImageFitMode = "clip" | "crop" | "fill" | "fillmax" | "max" | "scale" | "min";
type ImageBuilderLike = {
  width: (width: number) => ImageBuilderLike;
  height: (height: number) => ImageBuilderLike;
  fit: (value: ImageFitMode) => ImageBuilderLike;
  auto: (value: "format") => ImageBuilderLike;
  url: () => string;
};

type ResolveImageUrlOptions = {
  width?: number;
  height?: number;
  fit?: ImageFitMode;
};

function isImageBuilder(value: unknown): value is ImageBuilderLike {
  return (
    typeof value === "object" &&
    value !== null &&
    "url" in value &&
    typeof value.url === "function"
  );
}

export function urlForImage(source: ImageSource) {
  if (!source) {
    return null;
  }

  if (
    typeof source === "object" &&
    "src" in source &&
    typeof source.src === "string" &&
    !source.asset
  ) {
    return source.src;
  }

  if (!builder) {
    return null;
  }

  return builder.image(source as SanityImageSource);
}

export function resolveImageUrl(
  source: ImageSource,
  options: ResolveImageUrlOptions = {}
) {
  const image = urlForImage(source);

  if (!image) {
    return null;
  }

  if (typeof image === "string") {
    return image;
  }

  if (!isImageBuilder(image)) {
    return null;
  }

  let imageBuilder = image;

  if (options.width) {
    imageBuilder = imageBuilder.width(options.width);
  }

  if (options.height) {
    imageBuilder = imageBuilder.height(options.height);
  }

  if (options.fit) {
    imageBuilder = imageBuilder.fit(options.fit);
  }

  return imageBuilder.auto("format").url();
}
