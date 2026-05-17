"use client";

import { trackWhatsAppClick } from "@/lib/analytics";

type WhatsAppLinkProps = {
  /** Full wa.me URL already built by buildWhatsAppUrl() */
  href: string;
  /** Where this link appears — sent as GA4 event parameter */
  source: string;
  className?: string;
  children: React.ReactNode;
  "aria-label"?: string;
};

/**
 * Tracked WhatsApp anchor link.
 * Fires a whatsapp_click GA4 event with the source location before opening.
 * Always opens in a new tab with rel="noopener noreferrer".
 */
export function WhatsAppLink({
  href,
  source,
  className,
  children,
  "aria-label": ariaLabel
}: WhatsAppLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={ariaLabel}
      onClick={() => trackWhatsAppClick(source)}
    >
      {children}
    </a>
  );
}
