import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { footerLinks, navigationLinks } from "@/lib/constants/navigation";
import { getCandidate } from "@/lib/sanity/api";

export async function Footer() {
  const candidate = await getCandidate();

  return (
    <footer className="border-t border-line bg-brand-dark py-14 text-white sm:py-16">
      <Container className="grid gap-10 md:grid-cols-2 xl:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div className="space-y-4 md:col-span-2 xl:col-span-1">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/70">
            Impulso Comunitario
          </p>
          <h2 className="max-w-sm font-serif text-3xl leading-tight">
            Cercanía, claridad y seguimiento para construir confianza pública.
          </h2>
          <p className="max-w-md text-sm leading-7 text-white/75">
            Propuestas claras, agenda pública, noticias territoriales y
            participación ciudadana real para construir una comunidad mejor.
          </p>
        </div>

        <div className="md:max-w-xs">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
            Navegación
          </p>
          <div className="space-y-3 text-sm text-white/80">
            {[...navigationLinks, ...footerLinks].map((link) => (
              <div key={link.href}>
                <Link href={link.href} className="transition hover:text-white">
                  {link.label}
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="md:max-w-xs">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
            Contacto
          </p>
          <div className="space-y-3 text-sm text-white/80">
            <p>{candidate.email}</p>
            <p>{candidate.phone}</p>
            <p>{candidate.location}</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
