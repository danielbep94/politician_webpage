"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Container } from "@/components/layout/Container";
import { buttonVariants } from "@/components/ui/Button";
import { navigationLinks } from "@/lib/constants/navigation";
import { siteConfig } from "@/lib/constants/site";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close on outside click
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClick);
      // Prevent body scroll while menu is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <>
      {/* Backdrop — visible on mobile when menu is open */}
      {isOpen ? (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          aria-hidden="true"
          onClick={() => setIsOpen(false)}
        />
      ) : null}

      <header className="sticky top-0 z-50 border-b border-white/70 bg-background/90 backdrop-blur-xl">
        <Container className="flex min-h-[4.75rem] items-center justify-between gap-4">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand text-sm font-extrabold uppercase tracking-[0.2em] text-white">
              IC
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-brand">
                {siteConfig.shortName}
              </p>
              <p className="hidden text-xs text-slate-600 sm:block">
                Agenda ciudadana con resultados
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 lg:flex xl:gap-8" aria-label="Navegación principal">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "text-sm font-medium transition hover:text-brand",
                  isActive(link.href)
                    ? "font-semibold text-brand"
                    : "text-slate-700"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Link href="/sumate" className={buttonVariants({ size: "md" })}>
              {siteConfig.volunteerCtaLabel}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="relative lg:hidden" ref={menuRef}>
            <button
              type="button"
              aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isOpen}
              aria-controls="mobile-nav"
              onClick={() => setIsOpen((prev) => !prev)}
              className={cn(
                "flex min-h-11 cursor-pointer items-center rounded-full border border-line px-4 py-3 text-sm font-semibold text-foreground transition hover:border-brand hover:text-brand",
                isOpen && "bg-white text-brand border-brand"
              )}
            >
              {isOpen ? "Cerrar" : "Menú"}
            </button>

            {/* Mobile dropdown */}
            {isOpen ? (
              <div
                id="mobile-nav"
                role="navigation"
                aria-label="Menú de navegación"
                className="absolute right-0 top-[calc(100%+0.75rem)] w-[min(20rem,calc(100vw-2.5rem))] rounded-[1.75rem] border border-line bg-white p-5 shadow-soft"
              >
                <div className="flex flex-col gap-2">
                  {navigationLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={isActive(link.href) ? "page" : undefined}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "rounded-2xl px-4 py-3 text-sm font-medium transition",
                        isActive(link.href)
                          ? "bg-brand/10 font-semibold text-brand"
                          : "text-slate-700 hover:bg-surface-alt hover:text-brand"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    href="/sumate"
                    onClick={() => setIsOpen(false)}
                    className={buttonVariants({ className: "mt-2 w-full" })}
                  >
                    {siteConfig.volunteerCtaLabel}
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        </Container>
      </header>
    </>
  );
}
