export type WebhookPayload = {
  name: string;
  email: string;
  website: string;
  message: string;
  submittedAt: string;
};

export type WebhookResult =
  | { ok: true }
  | { ok: false; reason: "invalid-url" | "unreachable" | "rejected" };

/**
 * Apps Script web apps answer the first POST with a 302 to a content URL.
 * The script runs on that first POST. The Fetch spec then turns the follow-up
 * into a GET, which is what returns the JSON body. Following redirects is
 * required; re-POSTing the redirect target is rejected with 405.
 */
export function parseWebhookUrl(raw: string | undefined): URL | null {
  const value = raw?.trim();
  if (!value) return null;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }

  const local = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  if (url.protocol === "https:") return url;
  if (url.protocol === "http:" && local) return url;
  return null;
}

export async function forwardToWebhook(
  url: URL,
  payload: WebhookPayload,
): Promise<WebhookResult> {
  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
        Accept: "application/json",
        "User-Agent": "MeridianAuditForm/1.0",
      },
      body: JSON.stringify(payload),
      redirect: "follow",
      signal: AbortSignal.timeout(20_000),
    });
  } catch (error) {
    console.error("Audit webhook request failed.", {
      message: error instanceof Error ? error.message : "unknown",
    });
    return { ok: false, reason: "unreachable" };
  }

  const text = (await response.text()).replace(/^\uFEFF/, "").trim();
  let parsed: unknown = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = null;
  }

  const accepted =
    response.ok &&
    typeof parsed === "object" &&
    parsed !== null &&
    "ok" in parsed &&
    (parsed as { ok: unknown }).ok === true;

  if (!accepted) {
    console.error("Audit webhook rejected the submission.", {
      status: response.status,
    });
    return { ok: false, reason: "rejected" };
  }

  return { ok: true };
}
