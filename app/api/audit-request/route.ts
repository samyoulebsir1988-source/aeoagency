import { validateAuditRequest } from "@/lib/audit";
import { site } from "@/lib/site";
import { forwardToWebhook, parseWebhookUrl } from "@/lib/webhook";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_BODY_BYTES = 30_000;

type FieldErrors = Partial<Record<"name" | "email" | "website" | "message", string>>;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function htmlPage(title: string, message: string): string {
  const name = escapeHtml(site.name);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <title>${escapeHtml(title)} — ${name}</title>
  <style>
    :root { color-scheme: light; }
    body { margin: 0; background: #f3f0e8; color: #1b1916; font-family: Georgia, "Iowan Old Style", Palatino, serif; }
    main { max-width: 36rem; margin: 0 auto; padding: 6rem 1.5rem; }
    h1 { font-weight: 500; font-size: 2.4rem; letter-spacing: -0.03em; line-height: 1.1; margin: 0 0 1rem; }
    p { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 1.05rem; line-height: 1.6; margin: 0 0 1.25rem; }
    a { color: #1b1916; }
  </style>
</head>
<body>
  <main>
    <p style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; letter-spacing: 0.14em; text-transform: uppercase; font-size: 0.75rem;">${name}</p>
    <h1>${escapeHtml(title)}</h1>
    <p>${escapeHtml(message)}</p>
    <p><a href="/#audit">Back to the audit form</a></p>
  </main>
</body>
</html>`;
}

function respond(
  asJson: boolean,
  status: number,
  body: { ok: boolean; error?: string; fields?: FieldErrors },
  page?: { title: string; message: string },
) {
  if (asJson) {
    return NextResponse.json(body, {
      status,
      headers: { "cache-control": "no-store" },
    });
  }

  return new NextResponse(htmlPage(page?.title ?? "Request not sent", page?.message ?? body.error ?? ""), {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

export async function GET() {
  return NextResponse.json(
    { ok: false, error: "Method not allowed. Use the audit form to send a request." },
    { status: 405, headers: { "cache-control": "no-store", allow: "POST" } },
  );
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  const asJson = contentType.includes("application/json");
  const declaredLength = Number(request.headers.get("content-length") || 0);

  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return respond(asJson, 413, {
      ok: false,
      error: "That submission is too large.",
    });
  }

  let payload: unknown;
  try {
    if (asJson) {
      const raw = await request.text();
      if (raw.length > MAX_BODY_BYTES) {
        return respond(asJson, 413, { ok: false, error: "That submission is too large." });
      }
      payload = raw.trim() ? JSON.parse(raw) : null;
    } else {
      const form = await request.formData();
      payload = {
        name: form.get("name"),
        email: form.get("email"),
        website: form.get("website"),
        message: form.get("message"),
        hp_field: form.get("hp_field"),
      };
    }
  } catch {
    return respond(
      asJson,
      400,
      { ok: false, error: "The submission could not be read." },
      { title: "Request not sent", message: "The submission could not be read." },
    );
  }

  const result = validateAuditRequest(payload);
  if (!result.ok) {
    return respond(
      asJson,
      400,
      { ok: false, error: result.error, fields: result.fields },
      { title: "Check the form", message: result.error },
    );
  }

  if (result.spam) {
    return respond(
      asJson,
      200,
      { ok: true },
      {
        title: "Request received.",
        message: "Thank you. We have it, and we will reply by email.",
      },
    );
  }

  const webhookUrl = parseWebhookUrl(process.env.AUDIT_WEBHOOK_URL);
  if (!process.env.AUDIT_WEBHOOK_URL?.trim()) {
    console.error("AUDIT_WEBHOOK_URL is not set.");
    return respond(
      asJson,
      500,
      {
        ok: false,
        error:
          "Audit requests are not configured. The server is missing AUDIT_WEBHOOK_URL.",
      },
      {
        title: "Request not sent",
        message:
          "Audit requests are not configured. The server is missing AUDIT_WEBHOOK_URL.",
      },
    );
  }

  if (!webhookUrl) {
    console.error("AUDIT_WEBHOOK_URL is not a valid https URL.");
    return respond(
      asJson,
      500,
      { ok: false, error: "AUDIT_WEBHOOK_URL must be an https URL." },
      { title: "Request not sent", message: "AUDIT_WEBHOOK_URL must be an https URL." },
    );
  }

  const forwarded = await forwardToWebhook(webhookUrl, {
    name: result.data.name,
    email: result.data.email,
    website: result.data.website,
    message: result.data.message,
    submittedAt: new Date().toISOString(),
  });

  if (!forwarded.ok) {
    const message =
      forwarded.reason === "unreachable"
        ? "We could not reach the submission service. Please try again in a moment."
        : "We could not save your request. The submission service did not accept it.";
    return respond(asJson, 502, { ok: false, error: message }, { title: "Request not sent", message });
  }

  return respond(
    asJson,
    200,
    { ok: true },
    {
      title: "Request received.",
      message: "Thank you. We have it, and we will reply by email to the address you entered.",
    },
  );
}
