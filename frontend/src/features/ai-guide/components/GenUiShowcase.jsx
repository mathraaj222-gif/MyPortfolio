import ProjectCard from '../../portfolio/components/ProjectCard';
import SkillBadge from '../../portfolio/components/SkillBadge';
import { Award, Briefcase, Sparkles, CheckCircle, ExternalLink, FileText, ArrowRight, AlertCircle, ShieldAlert, Compass } from 'lucide-react';
import { useAiGuide } from '../context/AiGuideContext';

export default function GenUiShowcase({ genUi, portfolioData }) {
  const { activeCitationId, askGuide } = useAiGuide();
  const { projects = [], experiences = [], certificates = [], skills = [], education = [], homepage = {} } = portfolioData || {};

  if (!genUi) return null;

  const formatPeriod = (exp) => {
    if (!exp.start_date) return '';
    const parse = (d) => (d ? new Date(d).toLocaleString('default', { month: 'short', year: 'numeric', timeZone: 'UTC' }) : '');
    const start = parse(exp.start_date);
    const end = exp.currently_working ? 'Present' : parse(exp.end_date) || 'Present';
    return `${start} - ${end}`;
  };

  const formatCertDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleString('default', { month: 'short', year: 'numeric', timeZone: 'UTC' });
  };

  // ─── Minimalist "No Direct Match" State ───
  if (genUi.layout === 'no_direct_match' || (!genUi.sections || genUi.sections.length === 0)) {
    return (
      <div className="genui-showcase-container">
        <div className="genui-banner minimal-no-match">
          <div className="genui-banner-badge neutral">
            <ShieldAlert size={14} />
            <span>Honest Evaluation • Zero Padding</span>
          </div>
          <h2 className="genui-banner-title">{genUi.title || 'No Direct Match Found'}</h2>
          <p className="genui-banner-summary">{genUi.summary}</p>
        </div>

        <div className="genui-no-match-card">
          <div className="no-match-status-grid">
            <div className="status-item fail">
              <span className="status-bullet">✕</span>
              <span>No direct commercial projects on record</span>
            </div>
            <div className="status-item fail">
              <span className="status-bullet">✕</span>
              <span>No specialized certifications on record</span>
            </div>
          </div>

          {genUi.transferableSkills && genUi.transferableSkills.length > 0 && (
            <div className="transferable-skills-wrap">
              <span className="transferable-label">Transferable Core Foundations:</span>
              <div className="transferable-chips">
                {genUi.transferableSkills.map((name, i) => (
                  <span key={i} className="transferable-chip">{name}</span>
                ))}
              </div>
            </div>
          )}

          <div className="no-match-explore-box">
            <div className="explore-header">
              <Compass size={16} />
              <span>Explore Verified Specializations Instead:</span>
            </div>
            <div className="explore-buttons">
              <button
                className="explore-btn"
                onClick={() => askGuide('Tell me about your AI work and Hate Speech Detection')}
              >
                <span>Hate Speech Detection System (AI/NLP)</span>
                <ArrowRight size={13} />
              </button>
              <button
                className="explore-btn"
                onClick={() => askGuide('What verified certifications do you have?')}
              >
                <span>IBM Certified Software Developer Credential</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Standard Strictly Matched Showcase ───
  return (
    <div className="genui-showcase-container">
      {/* GenUI Header Banner */}
      <div className="genui-banner">
        <div className="genui-banner-badge">
          <Sparkles size={14} className="sparkle-icon" />
          <span>{genUi.badge || 'Verified Ground Truth'}</span>
        </div>
        <h2 className="genui-banner-title">{genUi.title}</h2>
        {genUi.summary && <p className="genui-banner-summary">{genUi.summary}</p>}
      </div>

      {/* Dynamic Sections (Only renders sections that have matched items!) */}
      <div className="genui-sections-stack">
        {genUi.sections.map((section, sIdx) => {
          // ─── 1. Projects Section ──────────────────────────────────────────
          if (section.type === 'projects') {
            const matchedProjects = (section.itemIds || [])
              .map((id) => projects.find((p) => p.id === id))
              .filter(Boolean);

            if (matchedProjects.length === 0) return null;

            return (
              <div key={sIdx} className="genui-section-card">
                <div className="genui-section-header">
                  <div className="genui-section-title-wrap">
                    <span className="genui-section-indicator proj"></span>
                    <h3 className="genui-section-heading">{section.heading || 'Applied Projects'}</h3>
                  </div>
                  {section.highlightReason && (
                    <p className="genui-section-reason">{section.highlightReason}</p>
                  )}
                </div>

                <div className="portfolio-projects-grid">
                  {matchedProjects.map((project) => (
                    <div
                      key={project.id}
                      id={`genui-item-project-${project.id}`}
                      className="genui-item-wrapper"
                    >
                      <ProjectCard project={project} />
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          // ─── 2. Work Experience Section ──────────────────────────────────
          if (section.type === 'experience') {
            const matchedExp = (section.itemIds || [])
              .map((id) => experiences.find((e) => e.id === id))
              .filter(Boolean);

            if (matchedExp.length === 0) return null;

            return (
              <div key={sIdx} className="genui-section-card">
                <div className="genui-section-header">
                  <div className="genui-section-title-wrap">
                    <span className="genui-section-indicator exp"></span>
                    <h3 className="genui-section-heading">{section.heading || 'Work Experience'}</h3>
                  </div>
                  {section.highlightReason && (
                    <p className="genui-section-reason">{section.highlightReason}</p>
                  )}
                </div>

                <div className="portfolio-experience-stack">
                  {matchedExp.map((exp) => (
                    <div
                      key={exp.id}
                      id={`genui-item-experience-${exp.id}`}
                      className="portfolio-experience-card genui-item-wrapper"
                    >
                      <div className="portfolio-experience-grid">
                        <div className="portfolio-experience-col1">
                          <span className="portfolio-experience-date">{formatPeriod(exp)}</span>
                          <h4 className="portfolio-timeline-company">{exp.company_name}</h4>
                          <h3 className="portfolio-timeline-role">{exp.job_role}</h3>
                          <p className="portfolio-timeline-desc">{exp.description_job}</p>

                          {exp.project_description && exp.project_description.length > 0 && (
                            <ul className="portfolio-timeline-projects">
                              {exp.project_description.map((projPoint, idx) => (
                                <li key={idx}>{projPoint}</li>
                              ))}
                            </ul>
                          )}
                        </div>

                        <div className="portfolio-experience-col2">
                          {exp.technical_stacks && exp.technical_stacks.length > 0 && (
                            <div className="portfolio-timeline-stacks">
                              {exp.technical_stacks.map((stack, sIdx2) => (
                                <span key={sIdx2} className="portfolio-stack-badge">
                                  {stack}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          // ─── 3. Verified Certifications Section ──────────────────────────
          if (section.type === 'certificates') {
            const matchedCerts = (section.itemIds || [])
              .map((id) => certificates.find((c) => c.id === id))
              .filter(Boolean);

            if (matchedCerts.length === 0) return null;

            return (
              <div key={sIdx} className="genui-section-card">
                <div className="genui-section-header">
                  <div className="genui-section-title-wrap">
                    <span className="genui-section-indicator cert"></span>
                    <h3 className="genui-section-heading">{section.heading || 'Verified Credentials'}</h3>
                  </div>
                  {section.highlightReason && (
                    <p className="genui-section-reason">{section.highlightReason}</p>
                  )}
                </div>

                <div className="portfolio-certs-grid">
                  {matchedCerts.map((cert) => (
                    <div
                      key={cert.id}
                      id={`genui-item-certificate-${cert.id}`}
                      className="portfolio-cert-card genui-item-wrapper"
                    >
                      <div className="portfolio-cert-icon-container">
                        <Award size={24} />
                      </div>
                      <div className="portfolio-cert-details">
                        <h3 className="portfolio-cert-name">{cert.certificate_name}</h3>
                        <span className="portfolio-cert-body">{cert.certificate_bodies}</span>
                        <div className="portfolio-cert-meta">
                          {cert.date_received && (
                            <span>Issued {formatCertDate(cert.date_received)}</span>
                          )}
                          {cert.credential_id && (
                            <span style={{ display: 'block', fontSize: '0.75rem', marginTop: '0.2rem' }}>
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
                            <span>Verify Credential</span>
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          // ─── 4. Associated Skills Section ───────────────────────────────
          if (section.type === 'skills') {
            const matchedSkills = section.items || (section.itemIds || [])
              .map((id) => skills.find((s) => s.id === id))
              .filter(Boolean);

            if (matchedSkills.length === 0) return null;

            return (
              <div key={sIdx} className="genui-section-card">
                <div className="genui-section-header">
                  <div className="genui-section-title-wrap">
                    <span className="genui-section-indicator skill"></span>
                    <h3 className="genui-section-heading">{section.heading || 'Matching Skills & Tools'}</h3>
                  </div>
                </div>

                <div className="portfolio-skills-grid" style={{ marginTop: '1rem' }}>
                  {matchedSkills.map((skill) => (
                    <SkillBadge key={skill.id || skill.skill_name} skill={skill} />
                  ))}
                </div>
              </div>
            );
          }

          // ─── 5. Education Section ────────────────────────────────────────
          if (section.type === 'education') {
            const matchedEdu = (section.itemIds || [])
              .map((id) => education.find((e) => e.id === id))
              .filter(Boolean);

            if (matchedEdu.length === 0) return null;

            return (
              <div key={sIdx} className="genui-section-card">
                <div className="genui-section-header">
                  <div className="genui-section-title-wrap">
                    <span className="genui-section-indicator edu"></span>
                    <h3 className="genui-section-heading">{section.heading || 'Academic Background'}</h3>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                  {matchedEdu.map((edu) => (
                    <div key={edu.id} className="portfolio-card" style={{ padding: '1.25rem' }}>
                      <h4 style={{ color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: 600 }}>{edu.course_name}</h4>
                      <p style={{ color: 'var(--accent-teal)', fontSize: '0.9rem', marginTop: '0.25rem' }}>{edu.university_name} — {edu.uni_state}, {edu.uni_country}</p>
                      {edu.cgpa && <span style={{ display: 'inline-block', marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>CGPA: {edu.cgpa}</span>}
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
