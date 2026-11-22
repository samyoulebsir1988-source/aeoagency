import { faq } from "@/lib/faq";
import { site } from "@/lib/site";

export function structuredData() {
  const origin = site.url;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "ProfessionalService"],
        "@id": `${origin}/#organization`,
        name: site.name,
        description: site.description,
        url: origin,
        serviceType: [
          "Answer engine optimization audit",
          "Answer engine optimization",
        ],
        knowsAbout: [
          "Answer engine optimization",
          "AI answer visibility",
          "Citation in AI assistants",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${origin}/#website`,
        name: site.name,
        url: origin,
        description: site.description,
        inLanguage: "en",
        publisher: { "@id": `${origin}/#organization` },
      },
      {
        "@type": "FAQPage",
        "@id": `${origin}/#faq`,
        isPartOf: { "@id": `${origin}/#website` },
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };
}
