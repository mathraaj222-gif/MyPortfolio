import { Github, Linkedin, Mail } from 'lucide-react';

export default function PortfolioFooter({ data }) {
  const rawName = data?.full_name?.trim() || 'Mathanraaj';
  const displayName = rawName.replace(/\.+$/, '');
  const year = new Date().getFullYear();

  // Social links from homepage data with sensible fallbacks
  const githubUrl = data?.github_url || 'https://github.com';
  const linkedinUrl = data?.linkedin_url || 'https://linkedin.com';
  const emailAddress = data?.email_address;

  return (
    <footer className="portfolio-footer-full" aria-label="Site Footer">
      <div className="portfolio-footer-inner">
        {/* Top Row: Brand & Socials */}
        <div className="pf-footer-top">
          <div className="pf-footer-brand">
            <span className="pf-footer-name">
              {displayName}<span className="pf-footer-dot">.</span>
            </span>
            <p className="pf-footer-tagline">Building, learning, and experimenting with AI.</p>
          </div>

          <div className="pf-footer-socials" aria-label="Social links">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pf-footer-social-link"
              title="GitHub Profile"
              aria-label="GitHub"
            >
              <Github size={20} strokeWidth={1.8} />
            </a>

            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pf-footer-social-link"
              title="LinkedIn Profile"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} strokeWidth={1.8} />
            </a>

            <a
              href={emailAddress ? `mailto:${emailAddress}` : '#home'}
              className="pf-footer-social-link"
              title={emailAddress ? 'Send an email' : 'Contact me'}
              aria-label="Email"
            >
              <Mail size={20} strokeWidth={1.8} />
            </a>
          </div>
        </div>

        {/* Divider */}
        <hr className="pf-footer-divider" />

        {/* Bottom Row: Copyright & Tagline */}
        <div className="pf-footer-bottom">
          <p className="pf-footer-copy">
            © {year} {displayName}. All rights reserved.
          </p>
          <p className="pf-footer-built">
            Designed & built with curiosity.
          </p>
        </div>
      </div>
    </footer>
  );
}
