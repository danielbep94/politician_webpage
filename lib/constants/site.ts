export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "Impulso Comunitario",
  shortName: "Impulso",
  description:
    "Plataforma institucional y de campaña para conectar propuestas claras con participación ciudadana real.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  locale: "es_MX",
  defaultOgImage: "/images/og-cover.svg",
  volunteerCtaLabel: "Súmate como voluntario"
};
