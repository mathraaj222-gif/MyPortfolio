import ProjectCard from './ProjectCard';

export default function PortfolioProjects({ projects }) {
  return (
    <div>
      <h2 className="portfolio-section-title">Projects</h2>
      
      {projects.length === 0 ? (
        <div className="portfolio-card" style={{ textAlign: 'center', color: 'var(--pf-text-muted)', padding: '3rem' }}>
          No projects published yet. Use the admin projects panel to add elements to your showcase.
        </div>
      ) : (
        <div className="portfolio-projects-grid">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
