import type { SelectHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: SelectOption[];
  error?: string;
};

export function Select({
  label,
  options,
  error,
  className,
  id,
  ...props
}: SelectProps) {
  const errorId = id ? `${id}-error` : undefined;

  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-foreground" htmlFor={id}>
      <span>{label}</span>
      <select
        id={id}
        aria-describedby={error && errorId ? errorId : undefined}
        aria-invalid={error ? "true" : undefined}
        className={cn(
          "min-h-12 rounded-2xl border border-line bg-white px-4 py-3 text-base text-foreground outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-soft",
          className
        )}
        {...props}
      >
        <option value="">Selecciona una opción</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <span id={errorId} className="text-sm text-red-600" role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
}

