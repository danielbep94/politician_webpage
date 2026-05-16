import type { TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
};

export function Textarea({
  label,
  error,
  className,
  id,
  ...props
}: TextareaProps) {
  const errorId = id ? `${id}-error` : undefined;

  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-foreground" htmlFor={id}>
      <span>{label}</span>
      <textarea
        id={id}
        aria-describedby={error && errorId ? errorId : undefined}
        aria-invalid={error ? "true" : undefined}
        className={cn(
          "min-h-36 rounded-2xl border border-line bg-white px-4 py-3 text-base text-foreground outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand-soft",
          className
        )}
        {...props}
      />
      {error ? (
        <span id={errorId} className="text-sm text-red-600" role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
}

