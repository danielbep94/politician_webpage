import Image from "next/image";

import { resolveImageUrl } from "@/lib/sanity/image";
import type { ImageWithAlt } from "@/lib/types";

type ActivityGalleryProps = {
  images: ImageWithAlt[];
};

export function ActivityGallery({ images }: ActivityGalleryProps) {
  if (images.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand">
          Galería
        </p>
        <h2 className="font-serif text-3xl text-foreground sm:text-4xl">
          Postales de la actividad en territorio.
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {images.map((image, index) => {
          const imageUrl = resolveImageUrl(image, {
            width: 1400,
            height: 900,
            fit: "crop"
          });

          if (!imageUrl) {
            return null;
          }

          return (
            <figure
              key={`${image.alt}-${index + 1}`}
              className="overflow-hidden rounded-[1.75rem] border border-line bg-white p-3 shadow-soft"
            >
              <Image
                src={imageUrl}
                alt={image.alt}
                width={1400}
                height={1050}
                sizes="(min-width: 640px) 50vw, 100vw"
                className="aspect-[4/3] w-full rounded-[1.25rem] object-cover"
              />
              {image.caption ? (
                <figcaption className="px-1 pt-3 text-sm leading-6 text-slate-500">
                  {image.caption}
                </figcaption>
              ) : null}
            </figure>
          );
        })}
      </div>
    </section>
  );
}
