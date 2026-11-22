export type AuditInput = {
  name: string;
  email: string;
  website: string;
  message: string;
};

export type AuditField = keyof AuditInput;

export type ValidationResult =
  | { ok: true; spam: boolean; data: AuditInput }
  | { ok: false; error: string; fields: Partial<Record<AuditField, string>> };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LIMITS = {
  name: 120,
  email: 254,
  website: 300,
  message: 2000,
} as const;

function readString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function normalizeWebsite(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > LIMITS.website) return null;

  const withProtocol = /^[a-z][a-z0-9+.-]*:/i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  let url: URL;
  try {
    url = new URL(withProtocol);
  } catch {
    return null;
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") return null;

  const host = url.hostname.toLowerCase();
  const local = host === "localhost" || host === "127.0.0.1";
  if (!host || (!local && !host.includes("."))) return null;

  url.username = "";
  url.password = "";
  url.hash = "";
  return url.toString();
}

export function validateAuditRequest(body: unknown): ValidationResult {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return {
      ok: false,
      error: "The submission could not be read.",
      fields: {},
    };
  }

  const raw = body as Record<string, unknown>;
  const honeypot = readString(raw.hp_field).trim();

  const name = readString(raw.name).replace(/[\r\n]+/g, " ").replace(/\s{2,}/g, " ").trim();
  const email = readString(raw.email).trim();
  const websiteInput = readString(raw.website).trim();
  const message = readString(raw.message).trim();

  if (honeypot) {
    return {
      ok: true,
      spam: true,
      data: { name, email, website: websiteInput, message },
    };
  }

  const fields: Partial<Record<AuditField, string>> = {};

  if (!name || name.length > LIMITS.name) {
    fields.name = "Enter your name.";
  }

  if (!email || email.length > LIMITS.email || !EMAIL.test(email)) {
    fields.email = "Enter a valid email address.";
  }

  const website = normalizeWebsite(websiteInput);
  if (!website) {
    fields.website = "Enter the website we should audit, including the domain.";
  }

  if (message.length > LIMITS.message) {
    fields.message = "Keep the message to 2,000 characters or fewer.";
  }

  if (Object.keys(fields).length > 0) {
    return {
      ok: false,
      error: "Check the form and try again.",
      fields,
    };
  }

  return {
    ok: true,
    spam: false,
    data: {
      name,
      email,
      website: website as string,
      message,
    },
  };
}
