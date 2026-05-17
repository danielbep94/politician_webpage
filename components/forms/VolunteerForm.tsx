"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useRef, useState, useTransition } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { availabilityOptions, volunteerAreas } from "@/lib/constants/mock-content";
import { trackEvent, trackFormStart } from "@/lib/analytics";
import {
  volunteerSchema,
  type VolunteerPayload
} from "@/lib/validation/volunteer";

type FormErrors = Partial<Record<keyof VolunteerPayload, string>>;

const initialForm: VolunteerPayload = {
  name: "",
  email: "",
  phone: "",
  community: "",
  area: "",
  availability: "",
  website: "" // honeypot
};

export function VolunteerForm() {
  const router = useRouter();
  const [form, setForm] = useState<VolunteerPayload>(initialForm);
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
      trackFormStart("volunteer");
    }
  }

  function updateField<K extends keyof VolunteerPayload>(
    field: K,
    value: VolunteerPayload[K]
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

    const result = volunteerSchema.safeParse(form);

    if (!result.success) {
      const nextErrors: FormErrors = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof VolunteerPayload;
        nextErrors[field] = issue.message;
      });

      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/volunteers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data)
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setSubmitError(
          data?.message ?? "No pudimos registrar tu participación. Intenta nuevamente."
        );
        return;
      }

      trackEvent("volunteer_form_submitted", { area: result.data.area });

      startTransition(() => {
        router.push("/gracias?origen=voluntariado");
      });
    } catch {
      setSubmitError("No pudimos registrar tu participación. Intenta nuevamente.");
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
          id="volunteer-name"
          label="Nombre"
          placeholder="Tu nombre completo"
          autoComplete="name"
          value={form.name}
          error={errors.name}
          onChange={(event) => updateField("name", event.target.value)}
          onFocus={handleFirstFocus}
        />
        <Input
          id="volunteer-email"
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
          id="volunteer-phone"
          type="tel"
          label="Teléfono"
          placeholder="55 0000 0000"
          autoComplete="tel"
          value={form.phone}
          error={errors.phone}
          onChange={(event) => updateField("phone", event.target.value)}
        />
        <Input
          id="community"
          label="Colonia o comunidad"
          placeholder="Ej. Colonia del Valle"
          autoComplete="address-level2"
          value={form.community}
          error={errors.community}
          onChange={(event) => updateField("community", event.target.value)}
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Select
          id="area"
          label="Área donde quieres ayudar"
          options={volunteerAreas}
          value={form.area}
          error={errors.area}
          onChange={(event) => updateField("area", event.target.value)}
        />
        <Select
          id="availability"
          label="Disponibilidad"
          options={availabilityOptions}
          value={form.availability}
          error={errors.availability}
          onChange={(event) => updateField("availability", event.target.value)}
        />
      </div>

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
          aria-describedby={privacyError ? "privacy-error-volunteer" : undefined}
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
          y el tratamiento de mis datos para coordinar mi participación como voluntario/a.
        </span>
      </label>

      {/* aria-live: announces submission status to screen readers */}
      <div aria-live="polite" aria-atomic="true">
        {privacyError ? (
          <p id="privacy-error-volunteer" className="text-sm text-red-600" role="alert">
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
        {isSubmitting || isPending ? "Registrando..." : "Quiero sumarme"}
      </Button>
    </form>
  );
}
