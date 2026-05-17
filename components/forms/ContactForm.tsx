"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useRef, useState, useTransition } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { contactTopics } from "@/lib/constants/mock-content";
import { trackEvent, trackFormStart } from "@/lib/analytics";
import { contactSchema, type ContactPayload } from "@/lib/validation/contact";

type FormErrors = Partial<Record<keyof ContactPayload, string>>;

const initialForm: ContactPayload = {
  name: "",
  email: "",
  phone: "",
  topic: "",
  message: "",
  website: "" // honeypot
};

export function ContactForm() {
  const router = useRouter();
  const [form, setForm] = useState<ContactPayload>(initialForm);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [privacyError, setPrivacyError] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();
  // Fires form_start only on the first field interaction — never again
  const hasTrackedStart = useRef(false);

  function handleFirstFocus() {
    if (!hasTrackedStart.current) {
      hasTrackedStart.current = true;
      trackFormStart("contact");
    }
  }

  function updateField<K extends keyof ContactPayload>(
    field: K,
    value: ContactPayload[K]
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);
    setPrivacyError(false);

    if (!privacyAccepted) {
      setPrivacyError(true);
      return;
    }

    const result = contactSchema.safeParse(form);

    if (!result.success) {
      const nextErrors: FormErrors = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ContactPayload;
        nextErrors[field] = issue.message;
      });

      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data)
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setSubmitError(
          data?.message ?? "No pudimos enviar tu mensaje. Intenta nuevamente."
        );
        return;
      }

      trackEvent("contact_form_submitted", { topic: result.data.topic });

      startTransition(() => {
        router.push("/gracias?origen=contacto");
      });
    } catch {
      setSubmitError("No pudimos enviar tu mensaje. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      {/* Honeypot: hidden from humans, filled by bots — reject server-side if non-empty */}
      <input
        type="text"
        name="website"
        value={form.website ?? ""}
        onChange={(e) => updateField("website", e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="sr-only"
      />

      <div className="grid gap-5 md:grid-cols-2">
        <Input
          id="name"
          label="Nombre"
          placeholder="Tu nombre completo"
          autoComplete="name"
          value={form.name}
          error={errors.name}
          onChange={(event) => updateField("name", event.target.value)}
          onFocus={handleFirstFocus}
        />
        <Input
          id="email"
          type="email"
          label="Email"
          placeholder="tu@email.com"
          autoComplete="email"
          value={form.email}
          error={errors.email}
          onChange={(event) => updateField("email", event.target.value)}
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Input
          id="phone"
          type="tel"
          label="Teléfono (opcional)"
          placeholder="55 0000 0000"
          autoComplete="tel"
          value={form.phone}
          error={errors.phone}
          onChange={(event) => updateField("phone", event.target.value)}
        />
        <Select
          id="topic"
          label="Tema de interés"
          options={contactTopics}
          value={form.topic}
          error={errors.topic}
          onChange={(event) => updateField("topic", event.target.value)}
        />
      </div>

      <Textarea
        id="message"
        label="Mensaje"
        placeholder="Cuéntanos qué sucede, qué propones o cómo podemos ayudarte."
        value={form.message}
        error={errors.message}
        onChange={(event) => updateField("message", event.target.value)}
      />

      <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-700">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-line accent-brand"
          checked={privacyAccepted}
          onChange={(e) => {
            setPrivacyAccepted(e.target.checked);
            setPrivacyError(false);
          }}
          aria-required="true"
          aria-describedby={privacyError ? "privacy-error-contact" : undefined}
        />
        <span>
          Acepto el{" "}
          <Link
            href="/privacidad"
            className="font-medium text-brand underline underline-offset-4"
            target="_blank"
          >
            aviso de privacidad
          </Link>{" "}
          y el tratamiento de mis datos para dar seguimiento a mi mensaje.
        </span>
      </label>

      {/* aria-live: announces submission status to screen readers */}
      <div aria-live="polite" aria-atomic="true">
        {privacyError ? (
          <p id="privacy-error-contact" className="text-sm text-red-600" role="alert">
            Debes aceptar el aviso de privacidad para continuar.
          </p>
        ) : null}
        {submitError ? (
          <p className="text-sm text-red-600" role="alert">
            {submitError}
          </p>
        ) : null}
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting || isPending}>
        {isSubmitting || isPending ? "Enviando..." : "Enviar mensaje"}
      </Button>
    </form>
  );
}
