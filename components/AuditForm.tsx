"use client";

import { validateAuditRequest, type AuditField } from "@/lib/audit";
import { useRef, useState, type FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";

const FIELD_ORDER: AuditField[] = ["name", "email", "website", "message"];

export function AuditForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<AuditField, string>>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const fields = {
    name: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    website: useRef<HTMLInputElement>(null),
    message: useRef<HTMLTextAreaElement>(null),
  };

  function focusField(field: AuditField) {
    fields[field].current?.focus();
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const submission = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      website: String(formData.get("website") ?? ""),
      message: String(formData.get("message") ?? ""),
      hp_field: String(formData.get("hp_field") ?? ""),
    };

    const checked = validateAuditRequest(submission);
    if (!checked.ok) {
      setStatus("error");
      setError(checked.error);
      setFieldErrors(checked.fields);
      const first = FIELD_ORDER.find((field) => checked.fields[field]);
      if (first) focusField(first);
      return;
    }

    setStatus("submitting");
    setError(null);
    setFieldErrors({});

    try {
      const response = await fetch("/api/audit-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(submission),
      });

      let payload: { ok?: boolean; error?: string; fields?: Partial<Record<AuditField, string>> } =
        {};
      try {
        payload = (await response.json()) as typeof payload;
      } catch {
        payload = {};
      }

      if (!response.ok || !payload.ok) {
        const nextFields = payload.fields ?? {};
        setStatus("error");
        setError(payload.error || "We could not send your request. Please try again.");
        setFieldErrors(nextFields);
        const first = FIELD_ORDER.find((field) => nextFields[field]);
        if (first) focusField(first);
        return;
      }

      form.reset();
      setStatus("success");
      requestAnimationFrame(() => successRef.current?.focus());
    } catch {
      setStatus("error");
      setError("We could not reach the server. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="success">
        <h3 ref={successRef} tabIndex={-1}>
          Request received.
        </h3>
        <p>Thank you. We have it, and we will reply by email to the address you entered.</p>
        <button
          type="button"
          className="button-quiet"
          onClick={() => {
            setStatus("idle");
            setError(null);
          }}
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      className="audit-form"
      action="/api/audit-request"
      method="post"
      onSubmit={onSubmit}
      noValidate
      aria-busy={status === "submitting"}
    >
      <p className="form-note" id="audit-note">
        Name, email, and website are required. A person reads each request. This is not
        a mailing list.
      </p>
      <p className="visually-hidden" aria-live="polite">
        {status === "submitting" ? "Sending your request." : ""}
      </p>
      {status === "error" && error ? (
        <p className="alert" role="alert">
          {error}
        </p>
      ) : null}

      <div className="hp" aria-hidden="true">
        <label htmlFor="hp_field">Company</label>
        <input
          id="hp_field"
          name="hp_field"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <div className="field">
        <label htmlFor="audit-name">Name</label>
        <input
          ref={fields.name}
          id="audit-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={120}
          aria-invalid={fieldErrors.name ? true : undefined}
          aria-describedby={fieldErrors.name ? "audit-name-error audit-note" : "audit-note"}
        />
        {fieldErrors.name ? (
          <p className="field-error" id="audit-name-error">
            {fieldErrors.name}
          </p>
        ) : null}
      </div>

      <div className="field">
        <label htmlFor="audit-email">Email</label>
        <input
          ref={fields.email}
          id="audit-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          autoCapitalize="none"
          required
          maxLength={254}
          aria-invalid={fieldErrors.email ? true : undefined}
          aria-describedby={fieldErrors.email ? "audit-email-error" : undefined}
        />
        {fieldErrors.email ? (
          <p className="field-error" id="audit-email-error">
            {fieldErrors.email}
          </p>
        ) : null}
      </div>

      <div className="field">
        <label htmlFor="audit-website">Website</label>
        <input
          ref={fields.website}
          id="audit-website"
          name="website"
          type="text"
          autoComplete="url"
          inputMode="url"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          required
          maxLength={300}
          aria-invalid={fieldErrors.website ? true : undefined}
          aria-describedby={
            fieldErrors.website ? "audit-website-hint audit-website-error" : "audit-website-hint"
          }
        />
        <p className="hint" id="audit-website-hint">
          The domain you want read. https:// is optional.
        </p>
        {fieldErrors.website ? (
          <p className="field-error" id="audit-website-error">
            {fieldErrors.website}
          </p>
        ) : null}
      </div>

      <div className="field">
        <label htmlFor="audit-message">Message</label>
        <textarea
          ref={fields.message}
          id="audit-message"
          name="message"
          rows={5}
          maxLength={2000}
          aria-invalid={fieldErrors.message ? true : undefined}
          aria-describedby={
            fieldErrors.message ? "audit-message-hint audit-message-error" : "audit-message-hint"
          }
        />
        <p className="hint" id="audit-message-hint">
          Optional. What should a buyer be able to ask about you?
        </p>
        {fieldErrors.message ? (
          <p className="field-error" id="audit-message-error">
            {fieldErrors.message}
          </p>
        ) : null}
      </div>

      <div className="form-actions">
        <button type="submit" className="button" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : "Request the audit"}
        </button>
      </div>
    </form>
  );
}
