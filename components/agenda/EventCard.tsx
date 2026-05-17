"use client";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { buttonVariants } from "@/components/ui/Button";
import { TrackedLink } from "@/components/ui/TrackedLink";
import type { Event } from "@/lib/types";
import { formatDate } from "@/lib/utils";

type EventCardProps = {
  event: Event;
};

export function EventCard({ event }: EventCardProps) {
  return (
    <Card className="flex h-full flex-col gap-6 transition duration-200 hover:-translate-y-1 hover:border-brand/30">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Badge>{event.type}</Badge>
          <span className="text-sm text-slate-500">
            {formatDate(event.date)} · {event.time}
          </span>
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-foreground">{event.title}</h3>
          <p className="leading-7 text-slate-700">{event.summary}</p>
          <p className="text-sm text-slate-500">{event.location}</p>
        </div>
      </div>
      <TrackedLink
        href={event.ctaHref}
        trackingLabel={event.ctaLabel}
        trackingSection="agenda"
        className={buttonVariants({
          variant: "secondary",
          className: "mt-auto w-full sm:w-fit"
        })}
      >
        {event.ctaLabel}
      </TrackedLink>
    </Card>
  );
}

