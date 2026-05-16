"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState, useTransition } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { availabilityOptions, volunteerAreas } from "@/lib/constants/mock-content";
import { trackEvent } from "@/lib/analytics";
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
  availability: ""
};

export function VolunteerForm() {
  const router = useRouter();
  const [form, setForm] = useState<VolunteerPayload>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();

  function updateField<K extends keyof VolunteerPayload>(
    field: K,
    value: VolunteerPayload[K]
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

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
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(result.data)
      });

      if (!response.ok) {
        setSubmitError("No pudimos registrar tu participación. Intenta nuevamente.");
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
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-5 md:grid-cols-2">
        <Input
          id="volunteer-name"
          label="Nombre"
          placeholder="Tu nombre completo"
          value={form.name}
          error={errors.name}
          onChange={(event) => updateField("name", event.target.value)}
        />
        <Input
          id="volunteer-email"
          type="email"
          label="Email"
          placeholder="tu@email.com"
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
          value={form.phone}
          error={errors.phone}
          onChange={(event) => updateField("phone", event.target.value)}
        />
        <Input
          id="community"
          label="Colonia o comunidad"
          placeholder="Ej. Colonia del Valle"
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

      {submitError ? <p className="text-sm text-red-600">{submitError}</p> : null}

      <Button type="submit" size="lg" disabled={isSubmitting || isPending}>
        {isSubmitting || isPending ? "Registrando..." : "Quiero sumarme"}
      </Button>
    </form>
  );
}
