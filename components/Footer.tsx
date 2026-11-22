import { site } from "@/lib/site";

const links = [
  { href: "#services", label: "Services" },
  { href: "#process", label: "Process" },
  { href: "#faq", label: "Questions" },
  { href: "#audit", label: "Free audit" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <p className="wordmark footer-mark">
            <span className="mark" aria-hidden="true" />
            {site.name}
          </p>
          <p className="footer-tagline">
            An answer engine optimization practice for companies that intend to be
            cited accurately.
          </p>
        </div>
        <nav aria-label="Footer">
          <ul role="list">
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="wrap footer-base">
        <p>
          © {year} {site.name}
        </p>
        <p>Answer engine optimization</p>
      </div>
    </footer>
  );
}
