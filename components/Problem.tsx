const points = [
  {
    title: "The question moved",
    body: "Buyers ask an assistant for a recommendation, a comparison, or an explanation. The assistant answers in prose. The links, when they appear, support a sentence that has already been written.",
  },
  {
    title: "A mention can be wrong",
    body: "Being named is not enough. An outdated description, the wrong category, or a competitor’s framing attached to your name sends the buyer elsewhere just as surely as silence.",
  },
  {
    title: "The material is usually yours",
    body: "Answer engines describe you from pages they can retrieve and statements they will repeat. Clear definitions, answered questions, and cited evidence give them something accurate to use.",
  },
];

export function Problem() {
  return (
    <section className="section" id="problem" aria-labelledby="problem-heading">
      <div className="wrap rail">
        <p className="eyebrow">The problem</p>
        <div>
          <h2 id="problem-heading">
            If you are not in the answer, you are not in the decision.
          </h2>
          <p className="standfirst">
            A search used to end on a list of links. More of those questions now end
            inside a paragraph. The person asking sees a few names, a reason, and
            sometimes a source. A company missing from that paragraph is missing from
            the decision.
          </p>
          <figure className="pull">
            <blockquote>You cannot improve a mention that never happens.</blockquote>
          </figure>
          <ol className="points" role="list">
            {points.map((point, index) => (
              <li className="point" key={point.title}>
                <p className="index">{String(index + 1).padStart(2, "0")}</p>
                <h3>{point.title}</h3>
                <p>{point.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
