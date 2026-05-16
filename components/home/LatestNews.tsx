import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { NewsCard } from "@/components/noticias/NewsCard";
import type { Post } from "@/lib/types";

type LatestNewsProps = {
  posts: Post[];
};

export function LatestNews({ posts }: LatestNewsProps) {
  return (
    <section className="py-14 sm:py-16 lg:py-20">
      <Container className="space-y-8 sm:space-y-10">
        <SectionHeader
          eyebrow="Noticias recientes"
          title="Presencia pública, rendición de cuentas y conversación continua."
          ctaLabel="Ir al blog"
          ctaHref="/noticias"
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <NewsCard key={post.slug} post={post} />
          ))}
        </div>
      </Container>
    </section>
  );
}
