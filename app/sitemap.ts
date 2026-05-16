import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/constants/site";
import { getActivities, getPosts, getProposals } from "@/lib/sanity/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, proposals, activities] = await Promise.all([
    getPosts(),
    getProposals(),
    getActivities()
  ]);

  const staticRoutes = [
    "",
    "/sobre-mi",
    "/propuestas",
    "/noticias",
    "/actividades",
    "/agenda",
    "/prensa",
    "/contacto",
    "/sumate",
    "/gracias"
  ].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date()
  }));

  const proposalRoutes = proposals.map((proposal) => ({
    url: `${siteConfig.url}/propuestas/${proposal.slug}`,
    lastModified: new Date()
  }));

  const postRoutes = posts.map((post) => ({
    url: `${siteConfig.url}/noticias/${post.slug}`,
    lastModified: new Date(post.publishedAt)
  }));

  const activityRoutes = activities.map((activity) => ({
    url: `${siteConfig.url}/actividades/${activity.slug}`,
    lastModified: new Date(activity.publishedAt || activity.activityDate)
  }));

  return [...staticRoutes, ...proposalRoutes, ...postRoutes, ...activityRoutes];
}
