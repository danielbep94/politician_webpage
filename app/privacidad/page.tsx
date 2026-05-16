import { Container } from "@/components/layout/Container";
import { PageIntro } from "@/components/seo/PageIntro";
import { Card } from "@/components/ui/Card";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/constants/site";

export const metadata = buildPageMetadata({
  title: "Aviso de privacidad",
  description:
    "Información sobre cómo recopilamos, usamos y protegemos tus datos personales en este sitio.",
  pathname: "/privacidad"
});

const sections = [
  {
    title: "¿Quién recopila tus datos?",
    content:
      `El responsable del tratamiento de tus datos personales es el equipo de ${siteConfig.name}, ` +
      `contactable en ${process.env.CONTACT_RECIPIENT_EMAIL ?? "equipo@impulsocomunitario.mx"}.`
  },
  {
    title: "¿Qué datos recopilamos?",
    content:
      "Recopilamos únicamente los datos que tú proporcionas voluntariamente a través de nuestros formularios: " +
      "nombre completo, correo electrónico, número de teléfono (opcional en el formulario de contacto), " +
      "colonia o comunidad, área de interés y disponibilidad (en el formulario de voluntariado), " +
      "y el mensaje o comentario que nos envíes."
  },
  {
    title: "¿Para qué usamos tus datos?",
    content:
      "Utilizamos tus datos exclusivamente para: dar seguimiento a tu mensaje o solicitud ciudadana, " +
      "coordinarte como voluntario si así lo solicitaste, y mejorar nuestra comprensión de las " +
      "necesidades de la comunidad. No utilizamos tus datos para fines comerciales ni publicitarios."
  },
  {
    title: "¿Con quién compartimos tus datos?",
    content:
      "Tus datos son almacenados de forma segura en Sanity CMS y solo son accesibles por el equipo " +
      "de campaña. No vendemos, cedemos ni transferimos tus datos a terceros, salvo por obligación legal."
  },
  {
    title: "¿Cuánto tiempo conservamos tus datos?",
    content:
      "Conservamos tus datos personales por un máximo de 12 meses a partir de la fecha de envío. " +
      "Transcurrido ese periodo, los datos son eliminados de nuestros sistemas."
  },
  {
    title: "¿Cuáles son tus derechos?",
    content:
      "Tienes derecho a: acceder a tus datos, rectificarlos si son incorrectos, solicitar su eliminación, " +
      "y oponerte a su tratamiento. Para ejercer cualquiera de estos derechos, envíanos un correo a " +
      `${process.env.CONTACT_RECIPIENT_EMAIL ?? "equipo@impulsocomunitario.mx"} indicando tu solicitud.`
  },
  {
    title: "Cookies y análisis",
    content:
      "Este sitio puede utilizar cookies de análisis de terceros (como Google Analytics) para entender " +
      "el comportamiento de visita de forma agregada y anónima. No utilizamos cookies de seguimiento " +
      "entre sitios ni publicidad personalizada. Puedes deshabilitar cookies desde la configuración de tu navegador."
  },
  {
    title: "Cambios a este aviso",
    content:
      "Podemos actualizar este aviso de privacidad en cualquier momento. La versión vigente siempre " +
      "estará disponible en esta página con la fecha de última actualización."
  }
];

export default function PrivacyPage() {
  const updatedAt = new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date("2026-05-16"));

  return (
    <>
      <PageIntro
        eyebrow="Aviso de privacidad"
        title="Tus datos, tu confianza."
        description="Este aviso explica qué información recopilamos, cómo la usamos y cuáles son tus derechos sobre ella."
      />

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl space-y-6">
          <p className="text-sm text-slate-500">
            Última actualización: {updatedAt}
          </p>

          {sections.map((section) => (
            <Card key={section.title} className="space-y-3">
              <h2 className="font-serif text-xl font-semibold text-foreground sm:text-2xl">
                {section.title}
              </h2>
              <p className="leading-8 text-slate-700">{section.content}</p>
            </Card>
          ))}
        </Container>
      </section>
    </>
  );
}
