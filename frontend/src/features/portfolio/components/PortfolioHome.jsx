import { Linkedin, Github, Mail, FileText } from 'lucide-react';

const WhatsappIcon = ({ size = 20, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2.5"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

export default function PortfolioHome({ data }) {
  if (!data) return null;

  // Fallback avatar/placeholder image if none uploaded
  const avatarUrl = data.image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256';

  return (
    <div className="portfolio-home-grid">
      {/* Left: Bio Details */}
      <div className="portfolio-bio-content">
        <span className="portfolio-bio-greeting">Welcome to my Profile</span>
        <h1 className="portfolio-section-title" style={{ margin: 0 }}>About Me</h1>

        <p className="portfolio-bio-text">
          {data.bio || "Hello! I am a passionate developer. Use the admin panel to update this bio and write down details about your professional journey, technical vision, and current interests."}
        </p>

        {data.resume_url && (
          <div style={{ marginTop: '0.5rem' }}>
            <a
              href={data.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="portfolio-resume-btn"
            >
              <FileText size={16} style={{ marginRight: '8px' }} />
              Download Resume
            </a>
          </div>
        )}
      </div>

      {/* Right: Avatar & Social Links */}
      <div className="portfolio-avatar-container">
        <img
          src={avatarUrl}
          alt="Professional Profile"
          className="portfolio-avatar-img"
          onError={(e) => {
            // fallback on error
            e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256';
          }}
        />

        <div className="portfolio-social-list">
          {data.linkedin_url && (
            <a
              href={data.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="portfolio-social-btn linkedin"
              title="LinkedIn Profile"
            >
              <Linkedin size={20} />
            </a>
          )}
          {data.github_url && (
            <a
              href={data.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="portfolio-social-btn github"
              title="GitHub Profile"
            >
              <Github size={20} />
            </a>
          )}
          {data.email_address && (
            <a
              href={`mailto:${data.email_address}`}
              className="portfolio-social-btn email"
              title="Email Address"
            >
              <Mail size={20} />
            </a>
          )}
          {data.contact_no && (
            <a
              href={`https://wa.me/${data.contact_no.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="portfolio-social-btn whatsapp"
              title="WhatsApp Contact"
            >
              <WhatsappIcon size={20} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
