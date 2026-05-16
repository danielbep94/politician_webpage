import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Input({ label, error, className, id, ...props }: InputProps) {
  const errorId = id ? `${id}-error` : undefined;

  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-foreground" htmlFor={id}>
      <span>{label}</span>
      <input
        id={id}
        aria-describedby={error && errorId ? errorId : undefined}
        aria-invalid={error ? "true" : undefined}
        className={cn(
          "min-h-12 rounded-2xl border border-line bg-white px-4 py-3 text-base text-foreground outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand-soft",
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

