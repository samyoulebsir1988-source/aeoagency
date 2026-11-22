import { AuditForm } from "@/components/AuditForm";

export function Audit() {
  return (
    <section className="section" id="audit" aria-labelledby="audit-heading">
      <div className="wrap audit-grid">
        <div>
          <p className="eyebrow">Free audit</p>
          <h2 id="audit-heading">Request a free audit.</h2>
          <p className="standfirst">
            Tell us where to look. We use the submission to reply about your site, and
            for nothing else.
          </p>
        </div>
        <AuditForm />
      </div>
    </section>
  );
}
