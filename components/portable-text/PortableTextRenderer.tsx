import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";

import { cn } from "@/lib/utils";
import { normalizeBlockContent } from "@/lib/portable-text";
import { resolveImageUrl } from "@/lib/sanity/image";
import type { BlockContent, ImageWithAlt, VideoEmbed } from "@/lib/types";

type PortableTextRendererProps = {
  value: BlockContent | string[] | null | undefined;
  className?: string;
};

function getVideoEmbedUrl(video: VideoEmbed) {
  try {
    const parsedUrl = new URL(video.url);

    if (video.provider === "youtube") {
      const shortCode = parsedUrl.hostname.includes("youtu.be")
        ? parsedUrl.pathname.replace("/", "")
        : parsedUrl.searchParams.get("v");

      return shortCode ? `https://www.youtube.com/embed/${shortCode}` : null;
    }

    if (video.provider === "vimeo") {
      const videoId = parsedUrl.pathname.split("/").filter(Boolean).at(-1);
      return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
    }

    return null;
  } catch {
    return null;
  }
}

function PortableImage({ value }: { value: ImageWithAlt }) {
  const imageUrl = resolveImageUrl(value, {
    width: 1600,
    fit: "max"
  });

  if (!imageUrl) {
    return null;
  }

  return (
    <figure className="space-y-3 overflow-hidden rounded-[1.75rem] border border-line bg-white p-4 shadow-soft sm:p-5">
      <Image
        src={imageUrl}
        alt={value.alt}
        width={1600}
        height={900}
        sizes="100vw"
        className="w-full rounded-[1.25rem] object-cover"
      />
      {value.caption ? (
        <figcaption className="text-sm leading-6 text-slate-500">
          {value.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function PortableVideo({ value }: { value: VideoEmbed }) {
  const embedUrl = getVideoEmbedUrl(value);

  if (!embedUrl) {
    return (
      <div className="rounded-[1.75rem] border border-line bg-white p-5 shadow-soft">
        <p className="text-sm font-semibold text-slate-900">
          {value.title || "Video relacionado"}
        </p>
        <a
          href={value.url}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex text-sm font-medium text-brand transition hover:opacity-80"
        >
          Ver video
        </a>
      </div>
    );
  }

  return (
    <figure className="space-y-3 rounded-[1.75rem] border border-line bg-white p-4 shadow-soft sm:p-5">
      <div className="overflow-hidden rounded-[1.25rem]">
        <iframe
          src={embedUrl}
          title={value.title || "Embedded video"}
          loading="lazy"
          className="aspect-video w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
      {value.title ? (
        <figcaption className="text-sm leading-6 text-slate-500">{value.title}</figcaption>
      ) : null}
    </figure>
  );
}

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="leading-8 text-slate-700">{children}</p>,
    h2: ({ children }) => (
      <h2 className="pt-4 font-serif text-3xl font-semibold text-ink">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="pt-2 font-serif text-2xl font-semibold text-ink">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-brand/30 pl-5 font-serif text-xl italic leading-8 text-slate-700">
        {children}
      </blockquote>
    )
  },
  list: {
    bullet: ({ children }) => (
      <ul className="space-y-3 pl-6 leading-8 text-slate-700 marker:text-brand">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="space-y-3 pl-6 leading-8 text-slate-700 marker:font-semibold marker:text-brand">
        {children}
      </ol>
    )
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>
  },
  marks: {
    link: ({ children, value }) => {
      const isExternal = typeof value?.href === "string" && value.href.startsWith("http");

      return (
        <a
          href={value?.href}
          target={value?.openInNewTab || isExternal ? "_blank" : undefined}
          rel={value?.openInNewTab || isExternal ? "noreferrer" : undefined}
          className="font-medium text-brand underline decoration-brand/40 underline-offset-4 transition hover:opacity-80"
        >
          {children}
        </a>
      );
    }
  },
  types: {
    imageWithAlt: ({ value }) => <PortableImage value={value as ImageWithAlt} />,
    videoEmbed: ({ value }) => <PortableVideo value={value as VideoEmbed} />
  }
};

export function PortableTextRenderer({
  value,
  className
}: PortableTextRendererProps) {
  const content = normalizeBlockContent(value);

  if (content.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "space-y-6 text-base [&_iframe]:block [&_img]:block",
        className
      )}
    >
      <PortableText value={content} components={portableTextComponents} />
    </div>
  );
}
