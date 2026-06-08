import { Award, ExternalLink } from 'lucide-react';

export default function PortfolioCertificates({ certificates }) {
  const formatPeriod = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString('default', { month: 'short', year: 'numeric', timeZone: 'UTC' });
  };

  const sortedCertificates = [...certificates].sort((a, b) => {
    if (!a.date_received) return 1;
    if (!b.date_received) return -1;
    return new Date(b.date_received) - new Date(a.date_received);
  });

  return (
    <div>
      <h2 className="portfolio-section-title">Certifications</h2>
      
      {sortedCertificates.length === 0 ? (
        <div className="portfolio-card" style={{ textAlign: 'center', color: 'var(--pf-text-muted)', padding: '3rem' }}>
          No certificates published yet. Use the admin certificates panel to add achievements.
        </div>
      ) : (
        <div className="portfolio-card">
          <div className="portfolio-certs-grid">
            {sortedCertificates.map((cert) => (
              <div key={cert.id} className="portfolio-cert-card">
                {/* Decorative Icon */}
                <div className="portfolio-cert-icon-container">
                  <Award size={24} />
                </div>
                
                {/* Content details */}
                <div className="portfolio-cert-details">
                  <h3 className="portfolio-cert-name">{cert.certificate_name}</h3>
                  <span className="portfolio-cert-body">{cert.certificate_bodies}</span>
                  
                  <div className="portfolio-cert-meta">
                    {cert.date_received && (
                      <span>Issued {formatPeriod(cert.date_received)}</span>
                    )}
                    {cert.credential_id && (
                      <span style={{ display: 'block', fontSize: '0.75rem', marginTop: '0.15rem' }}>
                        ID: {cert.credential_id}
                      </span>
                    )}
                  </div>

                  {cert.certificate_img_url && (
                    <a
                      href={cert.certificate_img_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="portfolio-cert-link"
                    >
                      <span>View Credential</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
