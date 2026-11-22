import { site } from "@/lib/site";

const engines = [
  "ChatGPT",
  "Perplexity",
  "Gemini",
  "Google AI Overviews",
  "AI agents",
];

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="wrap">
        <p className="eyebrow">Answer engine optimization</p>
        <h1 id="hero-heading">{site.headline}</h1>
        <p className="lede">
          Buyers ask ChatGPT, Perplexity, Gemini, Google AI Overviews, and AI agents
          which company to trust. {site.name} audits how those systems describe you,
          then changes the pages and signals an answer is built from, so you are
          named, and named correctly.
        </p>
        <div className="actions">
          <a className="button" href="#audit">
            Request a free audit
          </a>
          <a className="text-link" href="#process">
            How an engagement works
          </a>
        </div>
        <div className="engines">
          <p>Systems we read</p>
          <ul role="list">
            {engines.map((engine) => (
              <li key={engine}>{engine}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
