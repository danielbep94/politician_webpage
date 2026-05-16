import { PortableTextRenderer } from "@/components/portable-text/PortableTextRenderer";
import type { VideoEmbed } from "@/lib/types";

type ActivityVideoBlockProps = {
  video?: VideoEmbed;
};

export function ActivityVideoBlock({ video }: ActivityVideoBlockProps) {
  if (!video) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand">
          Video
        </p>
        <h2 className="font-serif text-3xl text-foreground sm:text-4xl">
          Registro audiovisual de la actividad.
        </h2>
      </div>

      <PortableTextRenderer value={[{ ...video, _type: "videoEmbed" }]} />
    </section>
  );
}
