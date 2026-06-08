export default function PortfolioExperience({ experiences }) {
  const formatPeriod = (exp) => {
    if (!exp.start_date) return "";
    
    const parseDateUTC = (dateString) => {
      if (!dateString) return null;
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return null;
      return d;
    };

    const start = parseDateUTC(exp.start_date);
    const end = exp.currently_working ? null : parseDateUTC(exp.end_date);

    const formatMonthYear = (dateObj) => {
      if (!dateObj) return "";
      return dateObj.toLocaleString('default', { 
        month: 'short', 
        year: 'numeric', 
        timeZone: 'UTC' 
      });
    };

    const startText = start ? formatMonthYear(start) : "";
    const endText = exp.currently_working ? 'Present' : (end ? formatMonthYear(end) : 'Present');

    return startText && endText ? `${startText} - ${endText}` : startText || endText;
  };

  const sortedExperiences = [...experiences].sort((a, b) => {
    return new Date(b.start_date) - new Date(a.start_date);
  });

  return (
    <div>
      <h2 className="portfolio-section-title">Work Experience</h2>
      
      {sortedExperiences.length === 0 ? (
        <div className="portfolio-card" style={{ textAlign: 'center', color: 'var(--pf-text-muted)', padding: '3rem' }}>
          No work experiences published yet. Use the admin experience panel to add elements to your timeline.
        </div>
      ) : (
        <div className="portfolio-experience-stack">
          {sortedExperiences.map((exp, index) => (
            <div
              key={exp.id}
              className="portfolio-experience-card"
            >
              {/* Two Column Grid */}
              <div className="portfolio-experience-grid">
                {/* 1st Column: Company name (left top), Job Role, Job Description */}
                <div className="portfolio-experience-col1">
                  {/* Date Badge on the Top Right Corner of the 1st Column */}
                  <span className="portfolio-experience-date">
                    {formatPeriod(exp)}
                  </span>
                  <h4 className="portfolio-timeline-company" style={{ marginTop: 0 }}>
                    {exp.company_name}
                  </h4>
                  <h3 className="portfolio-timeline-role" style={{ marginTop: '0.5rem' }}>
                    {exp.job_role}
                  </h3>
                  <p className="portfolio-timeline-desc" style={{ marginTop: '1.25rem' }}>
                    {exp.description_job}
                  </p>
                </div>

                {/* 2nd Column: Tech stacks above project description, Project bullets below */}
                <div className="portfolio-experience-col2">
                  {/* Technical Stacks Tags (Capsules) */}
                  {exp.technical_stacks && exp.technical_stacks.length > 0 && (
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div className="portfolio-timeline-tags">
                        {exp.technical_stacks.map((stack, idx) => (
                          <span key={idx} className="portfolio-timeline-tag">
                            {stack}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Project worked on / achievements bullets */}
                  {exp.project_description && exp.project_description.length > 0 && (
                    <div>
                      <ul className="portfolio-timeline-bullets">
                        {exp.project_description.map((desc, idx) => (
                          <li key={idx}>{desc}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

