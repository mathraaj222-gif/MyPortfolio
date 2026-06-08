export default function PortfolioEducation({ education }) {
  const formatPeriod = (edu) => {
    if (!edu.start_date) return "";
    const start = new Date(edu.start_date).toLocaleString('default', { month: 'short', year: 'numeric', timeZone: 'UTC' });
    const end = edu.currently_studying ? 'Present' : (edu.end_date ? new Date(edu.end_date).toLocaleString('default', { month: 'short', year: 'numeric', timeZone: 'UTC' }) : 'Present');
    return `${start} - ${end}`;
  };

  const sortedEducation = [...education].sort((a, b) => {
    return new Date(b.start_date) - new Date(a.start_date);
  });

  return (
    <div>
      <h2 className="portfolio-section-title">Education</h2>
      
      {sortedEducation.length === 0 ? (
        <div className="portfolio-card" style={{ textAlign: 'center', color: 'var(--pf-text-muted)', padding: '3rem' }}>
          No education records published yet. Use the admin education panel to add academic history.
        </div>
      ) : (
        <div className="portfolio-education-grid">
          {sortedEducation.map((edu) => (
            <div key={edu.id} className="portfolio-card portfolio-edu-card">
              <div className="portfolio-edu-header">
                <div>
                  <h3 className="portfolio-edu-course">{edu.course_name}</h3>
                  <span className="portfolio-edu-uni">{edu.university_name}</span>
                </div>
              </div>

              <div className="portfolio-edu-meta">
                <span>{edu.uni_state}, {edu.uni_country}</span>
                <span style={{ fontWeight: 600, color: 'var(--pf-gradient-blue)', marginTop: '0.25rem' }}>
                  {formatPeriod(edu)}
                </span>
              </div>

              {edu.cgpa !== null && edu.cgpa !== undefined && (
                <div className="portfolio-edu-cgpa-box">
                  <span className="portfolio-edu-cgpa-lbl">Cumulative GPA</span>
                  <span className="portfolio-edu-cgpa-val">{Number(edu.cgpa).toFixed(2)} / 4.00</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
