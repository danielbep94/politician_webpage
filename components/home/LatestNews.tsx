import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { NewsCard } from "@/components/noticias/NewsCard";
import { buttonVariants } from "@/components/ui/Button";
import type { Post } from "@/lib/types";

type LatestNewsProps = {
  posts: Post[];
};

export function LatestNews({ posts }: LatestNewsProps) {
  return (
    <section className="py-14 sm:py-16 lg:py-20">
      <Container className="space-y-8 sm:space-y-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand">
              Noticias recientes
            </p>
            <h2 className="font-serif text-3xl text-foreground sm:text-4xl">
              Presencia pública, rendición de cuentas y conversación continua con la ciudadanía.
            </h2>
          </div>
          <Link
            href="/noticias"
            className={buttonVariants({
              variant: "secondary",
              className: "w-full sm:w-auto"
            })}
          >
            Ir al blog
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <NewsCard key={post.slug} post={post} />
          ))}
        </div>
      </Container>
    </section>
  );
}
