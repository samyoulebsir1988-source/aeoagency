const steps = [
  {
    title: "Tell us the site",
    body: "The form is the brief: your name, the domain, and the questions a buyer should be able to ask. We reply by email.",
  },
  {
    title: "We map the answers",
    body: "We ask those questions of the major answer engines and write down the result. Where you appear. The words used for you. The sources cited. Who appears instead.",
  },
  {
    title: "You read the diagnosis",
    body: "The audit is a document. Findings first, then the evidence, then the changes in the order we would make them. There is no score pretending this is a science.",
  },
  {
    title: "You decide on the work",
    body: "Optimization is a separate engagement, scoped from the audit. Nothing is changed until you approve it.",
  },
];

export function Process() {
  return (
    <section className="section band-dark" id="process" aria-labelledby="process-heading">
      <div className="wrap rail">
        <p className="eyebrow">Process</p>
        <div>
          <h2 id="process-heading">A short path. The decision stays yours.</h2>
          <ol className="steps" role="list">
            {steps.map((step, index) => (
              <li key={step.title}>
                <p className="index">{String(index + 1).padStart(2, "0")}</p>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
          <p className="process-end">
            <a className="text-link" href="#audit">
              Request a free audit
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
