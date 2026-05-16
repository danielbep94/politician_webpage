import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/layout/Container";
import { PortableTextRenderer } from "@/components/portable-text/PortableTextRenderer";
import { PageIntro } from "@/components/seo/PageIntro";
import { StructuredData } from "@/components/seo/StructuredData";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { siteConfig } from "@/lib/constants/site";
import { buildArticleJsonLd } from "@/lib/seo/jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getCandidate, getPostBySlug, getPosts } from "@/lib/sanity/api";
import { formatDate } from "@/lib/utils";

type NewsDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return buildPageMetadata({
      title: "Nota no encontrada",
      description: "La noticia solicitada no existe.",
      pathname: `/noticias/${slug}`
    });
  }

  return buildPageMetadata({
    title: post.title,
    description: post.excerpt,
    pathname: `/noticias/${post.slug}`,
    type: "article",
    publishedTime: post.publishedAt
  });
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const [post, candidate] = await Promise.all([getPostBySlug(slug), getCandidate()]);

  if (!post) {
    notFound();
  }

  return (
    <>
      <StructuredData data={buildArticleJsonLd(post, candidate, siteConfig.url)} />
      <PageIntro
        eyebrow="Nota informativa"
        title={post.title}
        description={post.excerpt}
      >
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: "Noticias", href: "/noticias" },
            { label: post.title }
          ]}
        />
        <Card className="space-y-4">
          <Badge>{post.category}</Badge>
          <p className="text-sm text-slate-500">{formatDate(post.publishedAt)}</p>
          <p className="text-sm text-slate-500">{post.readingTime}</p>
        </Card>
      </PageIntro>

      <section className="py-16 sm:py-20">
        <Container className="max-w-4xl">
          <Card className="p-6 sm:p-8 lg:p-10">
            <PortableTextRenderer value={post.body} />
          </Card>
        </Container>
      </section>
    </>
  );
}
