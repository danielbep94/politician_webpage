type AnalyticsPayload = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Base event dispatcher. Logs to console in dev; sends to GA4 in production. */
export function trackEvent(name: string, payload?: AnalyticsPayload) {
  if (process.env.NODE_ENV !== "production") {
    console.info("[analytics:event]", name, payload);
    return;
  }

  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", name, payload);
  }
}

/**
 * Track a CTA button or link click.
 * @param label  - Human-readable label of the CTA (e.g. "Súmate como voluntario")
 * @param destination - Target URL or route (e.g. "/sumate")
 * @param section - Section of the page where the CTA lives (e.g. "hero", "agenda")
 */
export function trackCtaClick(label: string, destination: string, section: string) {
  trackEvent("cta_click", { label, destination, section });
}

/**
 * Track a WhatsApp link click.
 * @param source - Where the link appeared (e.g. "contacto", "footer")
 */
export function trackWhatsAppClick(source: string) {
  trackEvent("whatsapp_click", { source });
}

/**
 * Track the first field interaction on a form (fires once per component mount).
 * Use with a useRef flag in the form component so it only fires once.
 * @param formName - "contact" | "volunteer"
 */
export function trackFormStart(formName: "contact" | "volunteer") {
  trackEvent("form_start", { form: formName });
}

/**
 * Track a social media icon click.
 * @param platform - Platform label (e.g. "Instagram", "Facebook", "YouTube")
 */
export function trackSocialClick(platform: string) {
  trackEvent("social_link_click", { platform });
}
