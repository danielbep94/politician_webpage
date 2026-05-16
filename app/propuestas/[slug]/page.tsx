import { notFound } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { PageIntro } from "@/components/seo/PageIntro";
import { StructuredData } from "@/components/seo/StructuredData";
import { ProposalDetail } from "@/components/propuestas/ProposalDetail";
import { buildProposalJsonLd } from "@/lib/seo/jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/constants/site";
import { getProposalBySlug, getProposals } from "@/lib/sanity/api";

type ProposalDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const proposals = await getProposals();
  return proposals.map((proposal) => ({ slug: proposal.slug }));
}

export async function generateMetadata({ params }: ProposalDetailPageProps) {
  const { slug } = await params;
  const proposal = await getProposalBySlug(slug);

  if (!proposal) {
    return buildPageMetadata({
      title: "Propuesta no encontrada",
      description: "La propuesta solicitada no existe.",
      pathname: `/propuestas/${slug}`
    });
  }

  return buildPageMetadata({
    title: proposal.title,
    description: proposal.summary,
    pathname: `/propuestas/${proposal.slug}`
  });
}

export default async function ProposalDetailPage({
  params
}: ProposalDetailPageProps) {
  const { slug } = await params;
  const proposal = await getProposalBySlug(slug);

  if (!proposal) {
    notFound();
  }

  return (
    <>
      <StructuredData data={buildProposalJsonLd(proposal, siteConfig.url)} />
      <PageIntro
        eyebrow={proposal.theme}
        title={proposal.title}
        description={proposal.summary}
      />

      <section className="py-16 sm:py-20">
        <Container>
          <ProposalDetail proposal={proposal} />
        </Container>
      </section>
    </>
  );
}
