import { site } from "@/lib/site";

export function Header() {
  return (
    <header className="site-header" id="top">
      <div className="wrap header-inner">
        <a className="wordmark" href="#top">
          <span className="mark" aria-hidden="true" />
          {site.name}
        </a>
        <nav className="nav" aria-label="Primary">
          <ul role="list">
            <li>
              <a href="#services">Services</a>
            </li>
            <li>
              <a href="#process">Process</a>
            </li>
            <li>
              <a href="#faq">Questions</a>
            </li>
            <li>
              <a className="button button-small" href="#audit">
                Request an audit
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
