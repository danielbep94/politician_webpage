import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand text-white shadow-soft hover:-translate-y-0.5 hover:bg-brand-dark focus-visible:outline-brand",
  secondary:
    "border border-line bg-white text-foreground hover:-translate-y-0.5 hover:border-brand hover:text-brand focus-visible:outline-brand",
  ghost:
    "bg-transparent text-foreground hover:bg-brand-soft hover:text-brand-dark focus-visible:outline-brand"
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "min-h-12 px-5 py-3 text-sm font-semibold",
  lg: "min-h-12 px-6 py-3.5 text-base font-semibold"
};

export function buttonVariants({
  variant = "primary",
  size = "md",
  className
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
    variantClasses[variant],
    sizeClasses[size],
    className
  );
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  );
}
