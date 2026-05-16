import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { buttonVariants } from "@/components/ui/Button";
import { navigationLinks } from "@/lib/constants/navigation";
import { siteConfig } from "@/lib/constants/site";
import { cn } from "@/lib/utils";

export function Header() {
  return (
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

        <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-700 transition hover:text-brand"
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

        <details className="group relative lg:hidden">
          <summary
            className={cn(
              "flex min-h-11 cursor-pointer list-none items-center rounded-full border border-line px-4 py-2 text-sm font-semibold text-foreground transition hover:border-brand hover:text-brand",
              "group-open:bg-white group-open:text-brand"
            )}
          >
            Menú
          </summary>
          <div className="absolute right-0 top-[calc(100%+0.75rem)] w-[min(20rem,calc(100vw-2.5rem))] rounded-[1.75rem] border border-line bg-white p-5 shadow-soft">
            <div className="flex flex-col gap-3">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-2xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-surface-alt hover:text-brand"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/sumate"
                className={buttonVariants({ className: "mt-2 w-full" })}
              >
                {siteConfig.volunteerCtaLabel}
              </Link>
            </div>
          </div>
        </details>
      </Container>
    </header>
  );
}
