import { faq } from "@/lib/faq";

export function Faq() {
  return (
    <section className="section" id="faq" aria-labelledby="faq-heading">
      <div className="wrap rail">
        <p className="eyebrow">Questions</p>
        <div>
          <h2 id="faq-heading">Common questions.</h2>
          <div className="faq-list">
            {faq.map((item) => (
              <article className="faq-item" key={item.question}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
