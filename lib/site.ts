/**
 * Placeholder brand. Change `name` here — the wordmark, page title,
 * structured data, and footer all read from this file.
 */
function resolveSiteUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  ];

  for (const candidate of candidates) {
    const value = candidate?.trim();
    if (!value) continue;
    try {
      const url = new URL(value.includes("://") ? value : `https://${value}`);
      if (url.protocol === "http:" || url.protocol === "https:") {
        return url.origin;
      }
    } catch {
      // Try the next candidate.
    }
  }

  return "http://localhost:3000";
}

export const site = {
  name: "Meridian",
  headline: "Be the source an answer is built from.",
  description:
    "Meridian is an answer engine optimization practice. We audit and improve how ChatGPT, Perplexity, Gemini, Google AI Overviews, and AI agents describe your company.",
  url: resolveSiteUrl(),
  locale: "en_US",
} as const;
