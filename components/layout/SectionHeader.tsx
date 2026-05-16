import Link from "next/link";

import { buttonVariants } from "@/components/ui/Button";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  ctaLabel?: string;
  ctaHref?: string;
};

/**
 * Reusable section header used across all home sections and listing pages.
 * Eyebrow + serif title on the left; optional "Ver todas" link on the right.
 */
export function SectionHeader({
  eyebrow,
  title,
  ctaLabel,
  ctaHref
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand">
          {eyebrow}
        </p>
        <h2 className="text-balance font-serif text-3xl text-foreground sm:text-4xl">
          {title}
        </h2>
      </div>
      {ctaLabel && ctaHref ? (
        <Link
          href={ctaHref}
          className={buttonVariants({
            variant: "secondary",
            className: "w-full sm:w-auto shrink-0"
          })}
        >
          {ctaLabel}
        </Link>
      ) : null}
    </div>
  );
}
