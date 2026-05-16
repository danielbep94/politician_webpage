import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { buttonVariants } from "@/components/ui/Button";
import type { PressRelease } from "@/lib/types";
import { formatDate } from "@/lib/utils";

type PressReleaseCardProps = {
  release: PressRelease;
};

export function PressReleaseCard({ release }: PressReleaseCardProps) {
  return (
    <Card className="flex h-full flex-col justify-between gap-6 transition duration-200 hover:-translate-y-1 hover:border-brand/30">
      <div className="space-y-3">
        <p className="text-sm text-slate-500">{formatDate(release.publishedAt)}</p>
        <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
          {release.title}
        </h3>
        <p className="leading-7 text-slate-700">{release.excerpt}</p>
        <p className="text-sm leading-7 text-slate-600">{release.summary}</p>
      </div>
      <Link
        href={release.downloadUrl}
        className={buttonVariants({
          variant: "secondary",
          className: "mt-auto w-full sm:w-fit"
        })}
      >
        Ver comunicado
      </Link>
    </Card>
  );
}
