import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { buttonVariants } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="py-24">
      <Container className="max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand">
          404
        </p>
        <h1 className="mt-4 font-serif text-4xl text-foreground sm:text-5xl">
          No encontramos esta página.
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-700">
          Puede que el contenido haya cambiado o que la ruta todavía no exista en
          esta fase del proyecto.
        </p>
        <Link href="/" className={buttonVariants({ className: "mt-8" })}>
          Volver al inicio
        </Link>
      </Container>
    </section>
  );
}
