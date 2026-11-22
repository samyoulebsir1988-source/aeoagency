const services = [
  {
    index: "01",
    title: "AEO audit",
    summary: "A written account of how answer engines currently describe your company.",
    does: "We take the questions a buyer would ask about your company and your category, and we put them to ChatGPT, Perplexity, Gemini, Google AI Overviews, and agents that answer from the open web. We keep the wording of each answer, the sources it cites, and the names that appear in your place.",
    receives:
      "A written audit. It states whether you are mentioned, how you are described, which pages and third parties the answer relies on, and where the description is missing or wrong. It closes with changes, ranked by how directly they affect what an assistant can accurately say.",
  },
  {
    index: "02",
    title: "AEO optimization",
    summary: "Changes to the pages, proof, and structure those answers are drawn from.",
    does: "We revise the material an answer is assembled from: the definition of the company, the pages that answer the questions buyers ask, the evidence under important claims, and structured data where it matches the visible page. The scope comes from the audit.",
    receives:
      "The changes, implemented, and a short record of what was altered and why. You can hand that record to the people who own the site. This work does not start until you have approved the scope. The audit stands on its own.",
  },
];

export function Services() {
  return (
    <section className="section" id="services" aria-labelledby="services-heading">
      <div className="wrap rail">
        <p className="eyebrow">Services</p>
        <div>
          <h2 id="services-heading">A diagnosis, then the work.</h2>
          <p className="standfirst">
            Two engagements. The first tells you how you are represented. The second,
            if you want it, changes the sources an answer is built from.
          </p>
          <div className="service-list">
            {services.map((service) => (
              <article className="service" key={service.title}>
                <p className="index">{service.index}</p>
                <h3>{service.title}</h3>
                <p className="dek">{service.summary}</p>
                <div className="service-cols">
                  <div>
                    <h4>What we do</h4>
                    <p>{service.does}</p>
                  </div>
                  <div>
                    <h4>What you receive</h4>
                    <p>{service.receives}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
