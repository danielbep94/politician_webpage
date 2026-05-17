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

/**
 * Social proof stats — hardcoded for now.
 * Update these numbers each sprint or wire to a CMS field later.
 */
export const socialProof = {
  volunteersCount: "120+",
  eventsHeld: 8,
  proposalsPublished: 4
};

/** Build a WhatsApp deep-link from a phone number string (any format). */
export function buildWhatsAppUrl(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

