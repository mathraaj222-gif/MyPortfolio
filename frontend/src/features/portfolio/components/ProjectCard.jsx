import { useState } from 'react';
import { ExternalLink, Github, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProjectCard({ project }) {
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  const images = project.project_pic_url && project.project_pic_url.length > 0
    ? project.project_pic_url
    : ['https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600&h=350'];

  const handlePrevImage = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveImgIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveImgIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="portfolio-card portfolio-project-card">
      {/* Project Banner Area (Carousel / Slider) */}
      <div className="portfolio-project-banner">
        <img
          src={images[activeImgIdx]}
          alt={`${project.project_title} screenshot`}
          className="portfolio-project-img"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600&h=350';
          }}
        />

        {/* Carousel Overlay Arrows */}
        {images.length > 1 && (
          <>
            <button
              id={`carousel-prev-${project.id}`}
              onClick={handlePrevImage}
              className="carousel-nav-btn carousel-prev"
              aria-label="Previous image"
            >
              <ChevronLeft size={16} strokeWidth={3} />
            </button>
            <button
              id={`carousel-next-${project.id}`}
              onClick={handleNextImage}
              className="carousel-nav-btn carousel-next"
              aria-label="Next image"
            >
              <ChevronRight size={16} strokeWidth={3} />
            </button>

            {/* Pagination Indicators */}
            <div className="carousel-dots">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={`carousel-dot ${idx === activeImgIdx ? 'active' : ''}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Card Info Body */}
      <div className="portfolio-project-body">
        <h3 className="portfolio-project-title">{project.project_title}</h3>
        <p className="portfolio-project-desc">{project.project_description}</p>

        {/* Tech Stack Footer */}
        {project.project_tech_stacks && project.project_tech_stacks.length > 0 && (
          <div className="portfolio-project-footer">
            {project.project_tech_stacks.map((tech, idx) => (
              <span key={idx} className="portfolio-project-stack">{tech}</span>
            ))}
          </div>
        )}

        {/* Action Link Buttons */}
        {(project.project_live_link || project.project_github_link) && (
          <div className="portfolio-project-links">
            {project.project_live_link && (
              <a
                href={project.project_live_link}
                target="_blank"
                rel="noopener noreferrer"
                className="portfolio-project-btn live-btn"
              >
                <ExternalLink size={16} style={{ marginRight: '6px' }} />
                Live Demo
              </a>
            )}
            {project.project_github_link && (
              <a
                href={project.project_github_link}
                target="_blank"
                rel="noopener noreferrer"
                className="portfolio-project-btn github-btn"
              >
                <Github size={16} style={{ marginRight: '6px' }} />
                Codebase
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
