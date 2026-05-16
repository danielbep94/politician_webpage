import { Container } from "@/components/layout/Container";
import { PageIntro } from "@/components/seo/PageIntro";
import { PressReleaseCard } from "@/components/prensa/PressReleaseCard";
import { Card } from "@/components/ui/Card";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getMediaAssets, getPressReleases } from "@/lib/sanity/api";

export const metadata = buildPageMetadata({
  title: "Prensa",
  description:
    "Comunicados, kit de prensa, fotos oficiales y contacto para medios.",
  pathname: "/prensa"
});

export default async function PressPage() {
  const [releases, mediaAssets] = await Promise.all([
    getPressReleases(),
    getMediaAssets()
  ]);

  return (
    <>
      <PageIntro
        eyebrow="Prensa"
        title="Recursos claros para medios y comunicación institucional."
        description="Este espacio concentra comunicados, materiales oficiales y un punto de contacto preparado para cobertura, entrevistas y solicitudes editoriales."
      />

      <section className="py-16 sm:py-20">
        <Container className="space-y-10">
          <div className="space-y-6">
            <h2 className="font-serif text-3xl text-foreground">Comunicados</h2>
            <div className="grid gap-5 md:grid-cols-2">
              {releases.map((release) => (
                <PressReleaseCard key={release.slug} release={release} />
              ))}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            <Card className="space-y-5">
              <h2 className="font-serif text-3xl text-foreground">Kit de prensa</h2>
              <p className="leading-8 text-slate-700">
                Incluye fichas rápidas, logotipos, fotografías oficiales,
                semblanza y líneas narrativas prioritarias para cobertura.
              </p>
              <div className="space-y-4">
                {mediaAssets.map((asset) => (
                  <div key={asset.title} className="rounded-2xl bg-surface-alt p-4">
                    <p className="font-semibold text-foreground">{asset.title}</p>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      {asset.description}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="space-y-4 bg-brand text-white">
              <h2 className="font-serif text-3xl">Contacto para medios</h2>
              <p className="leading-8 text-white/85">
                Para entrevistas, acreditaciones, fichas o fotografías oficiales,
                utiliza el formulario ciudadano seleccionando el tema “Prensa y medios”.
              </p>
              <p className="text-sm text-white/75">Respuesta prioritaria para medios.</p>
            </Card>
          </div>
        </Container>
      </section>
    </>
  );
}
