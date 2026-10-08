import { ExternalLink, Github, ArrowUpRight, CheckCircle2, ShieldAlert, Award, Briefcase, Terminal, Layers } from 'lucide-react';

export default function EditorialGrid({ genUi }) {
  if (!genUi) return null;

  const { title, subtitle, badge, layoutType, card, cards = [] } = genUi;
  const currentCard = card || cards[0];

  if (!currentCard) return null;

  // Determine layout archetype from layoutType or card fields
  const type = layoutType || currentCard.type || 'modular_systems';

  return (
    <div className="editorial-canvas">
      {/* ── Dynamic AI Presentation Header ── */}
      <header className="editorial-masthead">
        <div className="editorial-title-block">
          <div className="editorial-header-top-row">
            {badge && (
              <div className="editorial-badge-pill">
                <span>{badge}</span>
              </div>
            )}
          </div>
          <h1 className="editorial-main-title">{title || 'AI PORTFOLIO ANALYSIS'}</h1>
          {subtitle && <p className="editorial-subtitle">{subtitle}</p>}
        </div>
      </header>

      {/* ── Single Layout Presentation (Exactly ONE layout per question) ── */}
      <div className="editorial-single-layout-container">
        {(type === 'project_showcase' || type === 'case_study') && (
          <SingleProjectShowcase card={currentCard} />
        )}

        {(type === 'experience_highlight' || type === 'callout_highlights') && (
          <SingleExperienceHighlight card={currentCard} />
        )}

        {(type === 'credential_card' || type === 'visual_hierarchy' || type === 'typographic_rules') && (
          <SingleCredentialCard card={currentCard} />
        )}

        {(type === 'modular_systems' || type === 'structural_systems') && (
          <SingleModularSystems card={currentCard} />
        )}

        {(type === 'gap_analysis' || type === 'no_direct_match') && (
          <SingleGapAnalysis card={currentCard} />
        )}
      </div>
    </div>
  );
}

// ─── Layout 1: Project Showcase (Single Project Case Study) ─────────────────
function SingleProjectShowcase({ card }) {
  const { projectTitle, imageUrl, narrative, stacks = [], githubUrl, liveUrl } = card;

  return (
    <div className="editorial-card single-project-card">
      <div className="project-showcase-header">
        <div className="project-title-meta">
          <span className="showcase-tag">FEATURED PROJECT IMPLEMENTATION</span>
          <h2 className="project-display-title">{projectTitle || card.title}</h2>
        </div>
      </div>

      <div className="project-showcase-grid">
        {imageUrl && (
          <div className="project-showcase-media">
            <img src={imageUrl} alt={projectTitle || 'Project Preview'} className="project-hero-image" />
          </div>
        )}

        <div className="project-showcase-content">
          <h3 className="section-mini-heading">TECHNICAL ARCHITECTURE & SOLUTION</h3>
          <p className="project-narrative-text">{narrative || card.narrative || card.description}</p>

          {stacks && stacks.length > 0 && (
            <div className="project-stacks-wrap">
              <span className="stacks-label">Applied Technologies:</span>
              <div className="project-tech-chips">
                {stacks.map((tech, idx) => (
                  <span key={idx} className="tech-chip">{tech}</span>
                ))}
              </div>
            </div>
          )}

          <div className="project-links-row">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="showcase-action-btn github"
              >
                <Github size={15} />
                <span>View Source Code</span>
                <ArrowUpRight size={13} />
              </a>
            )}
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="showcase-action-btn live"
              >
                <ExternalLink size={15} />
                <span>Live Deployment</span>
                <ArrowUpRight size={13} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Layout 2: Commercial Experience Highlight ──────────────────────────────
function SingleExperienceHighlight({ card }) {
  const { company, role, tenure, insightTitle, bullets = [], quote, stacks = [] } = card;

  return (
    <div className="editorial-card single-experience-card">
      <div className="experience-showcase-header">
        <div className="exp-meta-badge">
          <Briefcase size={15} />
          <span>{company || 'Commercial Organization'}</span>
          {tenure && <span className="exp-tenure">• {tenure}</span>}
        </div>
        <h2 className="exp-role-title">{role || card.title || 'Engineering Role'}</h2>
      </div>

      <div className="experience-body-layout">
        <div className="exp-main-col">
          <h3 className="insight-title-heading">{insightTitle || 'Demonstrated Commercial Delivery'}</h3>
          <ul className="exp-bullets-list">
            {bullets.map((bullet, idx) => (
              <li key={idx} className="exp-bullet-item">
                <span className="bullet-indicator">↗</span>
                <span className="bullet-text">{bullet}</span>
              </li>
            ))}
          </ul>

          {stacks && stacks.length > 0 && (
            <div className="exp-tech-row">
              <span className="stacks-label">Tools & Frameworks:</span>
              <div className="project-tech-chips">
                {stacks.map((tech, idx) => (
                  <span key={idx} className="tech-chip">{tech}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {quote && (
          <div className="exp-quote-box">
            <span className="quote-mark">“</span>
            <p className="quote-content">{quote}</p>
            <span className="quote-author">— {role} at {company}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Layout 3: Verified Credential Card ──────────────────────────────────────
function SingleCredentialCard({ card }) {
  const { certificateName, issuer, credentialId, issueDate, verificationSummary, levels } = card;

  return (
    <div className="editorial-card single-credential-card">
      <div className="credential-top-bar">
        <div className="cred-badge-wrap">
          <Award size={18} className="cred-icon" />
          <span className="cred-official-label">VERIFIED PROFESSIONAL CREDENTIAL</span>
        </div>
        {issuer && <span className="issuer-pill">{issuer}</span>}
      </div>

      <h2 className="credential-main-title">{certificateName || card.title || 'Professional Certification'}</h2>

      <div className="credential-details-grid">
        <div className="cred-field-box">
          <span className="field-label">ISSUING ORGANIZATION</span>
          <span className="field-value highlight">{issuer || 'Accredited Institution'}</span>
        </div>
        <div className="cred-field-box">
          <span className="field-label">CREDENTIAL IDENTIFIER</span>
          <span className="field-value font-mono">{credentialId || card.credId || 'Verified Record'}</span>
        </div>
        {issueDate && (
          <div className="cred-field-box">
            <span className="field-label">DATE ACCREDITED</span>
            <span className="field-value">{issueDate}</span>
          </div>
        )}
      </div>

      {verificationSummary && (
        <div className="credential-summary-box">
          <h4 className="summary-box-title">VERIFICATION SCOPE</h4>
          <p className="summary-box-desc">{verificationSummary}</p>
        </div>
      )}

      {levels && levels.length > 0 && (
        <div className="credential-levels-list">
          {levels.map((lvl, lIdx) => (
            <div key={lIdx} className="cred-level-item">
              <span className="level-label">{lvl.label}</span>
              <span className="level-desc">{lvl.desc}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Layout 4: Modular Systems (Multi-Component Architecture) ────────────────
function SingleModularSystems({ card }) {
  const { systemsTitle, description, boxes = [] } = card;

  return (
    <div className="editorial-card single-systems-card">
      <div className="systems-top-header">
        <div className="systems-tag-wrap">
          <Layers size={16} />
          <span>ENGINEERING ARCHITECTURE & PILLARS</span>
        </div>
        <h2 className="systems-headline">{systemsTitle || card.title || 'MODULAR ARCHITECTURE'}</h2>
        {description && <p className="systems-desc">{description}</p>}
      </div>

      <div className="systems-boxes-grid">
        {boxes.map((box, bIdx) => (
          <div key={bIdx} className="system-pillar-box">
            <div className="pillar-header">
              <span className="pillar-code">{box.code || `SYS-0${bIdx + 1}`}</span>
              <h3 className="pillar-title">{box.label || box.title}</h3>
            </div>
            <p className="pillar-desc">{box.desc || box.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Layout 5: Honest Gap Analysis (0 Direct Matches) ────────────────────────
function SingleGapAnalysis({ card }) {
  const { topic, headline, bullets = [], transferableSkills = [], clarification } = card;

  return (
    <div className="editorial-card single-gap-card">
      <div className="gap-top-header">
        <div className="gap-status-badge">
          <ShieldAlert size={15} />
          <span>HONEST EVALUATION • 0 DIRECT COMMERCIAL MATCHES</span>
        </div>
        <h2 className="gap-headline">{headline || `No Direct Records in ${topic || 'Requested Topic'}`}</h2>
        {clarification && <p className="gap-clarification">{clarification}</p>}
      </div>

      {bullets && bullets.length > 0 && (
        <div className="gap-records-eval">
          <h4 className="eval-heading">EVALUATION SUMMARY</h4>
          <ul className="gap-bullet-list">
            {bullets.map((b, idx) => (
              <li key={idx} className="gap-bullet-item">
                <span className="gap-x-mark">✕</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {transferableSkills && transferableSkills.length > 0 && (
        <div className="gap-transferable-wrap">
          <span className="transferable-heading">TRANSFERABLE CORE FOUNDATIONS:</span>
          <div className="transferable-skills-chips">
            {transferableSkills.map((skill, sIdx) => (
              <span key={sIdx} className="transfer-chip">{skill}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
