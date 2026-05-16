"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { buttonVariants } from "@/components/ui/Button";

/**
 * Sticky mobile CTA bar — appears after the user scrolls past the hero section.
 * Visible only on mobile/tablet (hidden lg+). Drives volunteer conversion.
 * Uses IntersectionObserver to watch the hero element.
 */
export function StickyMobileCta() {
  const [visible, setVisible] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show bar once sentinel (bottom of hero) leaves viewport
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Sentinel placed at the bottom of the hero section via a portal-style div */}
      <div ref={sentinelRef} id="hero-sentinel" className="absolute bottom-0 left-0 h-px w-px opacity-0 pointer-events-none" aria-hidden="true" />

      <div
        role="complementary"
        aria-label="Acción rápida"
        className={[
          "fixed bottom-0 left-0 right-0 z-40 border-t border-line bg-white/95 px-5 py-4 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] backdrop-blur-sm transition-transform duration-300 lg:hidden",
          visible ? "translate-y-0" : "translate-y-full"
        ].join(" ")}
      >
        <Link
          href="/sumate"
          className={buttonVariants({ size: "lg", className: "w-full" })}
        >
          Súmate como voluntario →
        </Link>
      </div>
    </>
  );
}
