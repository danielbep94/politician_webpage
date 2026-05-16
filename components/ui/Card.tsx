import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[1.75rem] border border-line bg-white p-5 shadow-soft sm:p-6 lg:p-7",
        className
      )}
      {...props}
    />
  );
}
