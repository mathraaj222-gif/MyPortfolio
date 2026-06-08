export default function SkillBadge({ skill }) {
  if (!skill) return null;

  return (
    <div className="portfolio-skill-item">
      {skill.skill_image_url ? (
        <img
          src={skill.skill_image_url}
          alt={`${skill.skill_name} logo`}
          className="portfolio-skill-icon"
          onError={(e) => {
            // fallback if image URL fails (e.g. devicon CDN down)
            e.target.style.display = 'none';
          }}
        />
      ) : (
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #0284c7, #10b981)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.95rem'
        }}>
          {skill.skill_name ? skill.skill_name.charAt(0).toUpperCase() : 'S'}
        </div>
      )}
      <span className="portfolio-skill-name">{skill.skill_name || 'Skill'}</span>
    </div>
  );
}
