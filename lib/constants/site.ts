export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "Política Moderna",
  shortName: process.env.NEXT_PUBLIC_SITE_SHORT_NAME || "PM",
  description:
    "Plataforma institucional y de campaña para conectar propuestas claras con participación ciudadana real.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  locale: "es_MX",
  defaultOgImage: "/images/og-cover.svg",
  volunteerCtaLabel: "Súmate como voluntario"
};
