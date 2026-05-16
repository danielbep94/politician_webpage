import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { buttonVariants } from "@/components/ui/Button";
import { resolveImageUrl } from "@/lib/sanity/image";
import type { Activity } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

type ActivityCardProps = {
  activity: Activity;
  className?: string;
};

export function ActivityCard({ activity, className }: ActivityCardProps) {
  const coverImageUrl = resolveImageUrl(activity.coverImage, {
    width: 960,
    height: 540,
    fit: "crop"
  });

  const primaryCategory = activity.categories[0];

  return (
    <Card
      className={cn(
        "flex h-full flex-col overflow-hidden p-0 transition duration-200 hover:-translate-y-1 hover:border-brand/30",
        className
      )}
    >
      {coverImageUrl ? (
        <div className="aspect-[16/10] overflow-hidden border-b border-line bg-surface-alt">
          <Image
            src={coverImageUrl}
            alt={activity.coverImage.alt}
            width={960}
            height={600}
            sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
            className="h-full w-full object-cover transition duration-300 hover:scale-[1.02]"
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col gap-6 p-5 sm:p-6">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
            {primaryCategory ? <Badge>{primaryCategory.title}</Badge> : null}
            <span>{formatDate(activity.activityDate)}</span>
            {activity.featured ? <span className="font-medium text-brand">Destacada</span> : null}
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
              {activity.title}
            </h3>
            <p className="leading-7 text-slate-700">{activity.excerpt}</p>
            <p className="text-sm text-slate-500">{activity.location}</p>
          </div>
        </div>

        <Link
          href={`/actividades/${activity.slug}`}
          className={buttonVariants({
            variant: "secondary",
            className: "mt-auto w-full sm:w-fit"
          })}
        >
          Ver actividad
        </Link>
      </div>
    </Card>
  );
}
