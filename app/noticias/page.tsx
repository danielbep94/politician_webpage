import { Container } from "@/components/layout/Container";
import { NewsCard } from "@/components/noticias/NewsCard";
import { PageIntro } from "@/components/seo/PageIntro";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getPosts } from "@/lib/sanity/api";

export const metadata = buildPageMetadata({
  title: "Noticias",
  description:
    "Listado de noticias, recorridos y publicaciones con categorías y fecha de publicación.",
  pathname: "/noticias"
});

export default async function NewsPage() {
  const posts = await getPosts();

  return (
    <>
      <PageIntro
        eyebrow="Noticias"
        title="Lo que escuchamos, hacemos y publicamos con la comunidad."
        description="Un blog institucional para compartir recorridos, posicionamientos, agenda y avances con un lenguaje claro y trazable."
      />

      <section className="py-16 sm:py-20">
        <Container className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <NewsCard key={post.slug} post={post} />
          ))}
        </Container>
      </section>
    </>
  );
}
