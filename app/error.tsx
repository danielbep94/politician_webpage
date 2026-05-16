"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Container } from "@/components/layout/Container";
import { buttonVariants } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log to an error reporting service in production
    console.error("[error-boundary]", error);
  }, [error]);

  return (
    <section className="py-24 sm:py-32">
      <Container className="max-w-2xl">
        <Card className="space-y-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand">
            Algo salió mal
          </p>
          <h1 className="font-serif text-3xl text-foreground sm:text-4xl">
            No pudimos cargar esta página.
          </h1>
          <p className="leading-8 text-slate-700">
            Ocurrió un error inesperado. Puedes intentar de nuevo o regresar al inicio.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <button
              onClick={reset}
              className={buttonVariants({ variant: "primary" })}
            >
              Intentar de nuevo
            </button>
            <Link href="/" className={buttonVariants({ variant: "secondary" })}>
              Ir al inicio
            </Link>
          </div>
          {error.digest ? (
            <p className="text-xs text-slate-400">Código: {error.digest}</p>
          ) : null}
        </Card>
      </Container>
    </section>
  );
}
