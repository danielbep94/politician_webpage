"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

import { trackCtaClick } from "@/lib/analytics";

type TrackedLinkProps = ComponentProps<typeof Link> & {
  /** Human-readable label sent to GA4 (e.g. "Súmate como voluntario") */
  trackingLabel: string;
  /** Section of the page this link lives in (e.g. "hero", "agenda") */
  trackingSection: string;
};

/**
 * Drop-in replacement for Next.js <Link> that fires a cta_click GA4 event
 * before navigation. All standard Link props are forwarded unchanged.
 */
export function TrackedLink({
  trackingLabel,
  trackingSection,
  href,
  onClick,
  children,
  ...props
}: TrackedLinkProps) {
  return (
    <Link
      href={href}
      onClick={(e) => {
        trackCtaClick(trackingLabel, href.toString(), trackingSection);
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </Link>
  );
}
