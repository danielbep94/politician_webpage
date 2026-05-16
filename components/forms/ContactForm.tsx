"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState, useTransition } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { contactTopics } from "@/lib/constants/mock-content";
import { trackEvent } from "@/lib/analytics";
import { contactSchema, type ContactPayload } from "@/lib/validation/contact";

type FormErrors = Partial<Record<keyof ContactPayload, string>>;

const initialForm: ContactPayload = {
  name: "",
  email: "",
  phone: "",
  topic: "",
  message: ""
};

export function ContactForm() {
  const router = useRouter();
  const [form, setForm] = useState<ContactPayload>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();

  function updateField<K extends keyof ContactPayload>(
    field: K,
    value: ContactPayload[K]
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

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
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(result.data)
      });

      if (!response.ok) {
        setSubmitError("No pudimos enviar tu mensaje. Intenta nuevamente.");
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
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-5 md:grid-cols-2">
        <Input
          id="name"
          label="Nombre"
          placeholder="Tu nombre completo"
          value={form.name}
          error={errors.name}
          onChange={(event) => updateField("name", event.target.value)}
        />
        <Input
          id="email"
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
          id="phone"
          type="tel"
          label="Teléfono opcional"
          placeholder="55 0000 0000"
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

      {submitError ? <p className="text-sm text-red-600">{submitError}</p> : null}

      <Button type="submit" size="lg" disabled={isSubmitting || isPending}>
        {isSubmitting || isPending ? "Enviando..." : "Enviar mensaje"}
      </Button>
    </form>
  );
}
