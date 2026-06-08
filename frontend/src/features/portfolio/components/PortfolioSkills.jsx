import SkillBadge from './SkillBadge';

export default function PortfolioSkills({ skills }) {
  return (
    <div>
      <h3 className="portfolio-skills-title">Skills</h3>
      
      {skills.length === 0 ? (
        <div className="portfolio-card" style={{ textAlign: 'center', color: 'var(--pf-text-muted)', padding: '3rem' }}>
          No skills published yet. Use the admin skills panel to add your competencies.
        </div>
      ) : (
        <div className="portfolio-skills-container">
          <p style={{
            textAlign: 'center',
            color: 'var(--pf-text-muted)',
            fontSize: '0.95rem',
            lineHeight: 1.6,
            maxWidth: '600px',
            margin: '0 auto 2.5rem auto'
          }}>
            Here are the programming languages, framework stacks, databases, and professional development tools that I work with:
          </p>
          <div className="portfolio-skills-grid">
            {skills.map((skill) => (
              <SkillBadge key={skill.id} skill={skill} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
