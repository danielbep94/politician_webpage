"use client";

import { useEffect, useState } from "react";

/**
 * Back-to-top button — appears after the user scrolls 400px.
 * Fixed bottom-right, visible only on md+. Mobile has the sticky CTA.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 400);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Volver al inicio de la página"
      className={[
        "fixed bottom-6 right-6 z-30 hidden h-11 w-11 items-center justify-center rounded-full border border-line bg-white shadow-soft transition-all duration-300 hover:border-brand hover:text-brand md:flex",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      ].join(" ")}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  );
}
