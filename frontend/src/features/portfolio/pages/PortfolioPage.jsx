import { useState, useEffect } from 'react';
import PortfolioHome from '../components/PortfolioHome';
import PortfolioExperience from '../components/PortfolioExperience';
import PortfolioEducation from '../components/PortfolioEducation';
import PortfolioProjects from '../components/PortfolioProjects';
import PortfolioSkills from '../components/PortfolioSkills';
import PortfolioCertificates from '../components/PortfolioCertificates';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export default function PortfolioPage() {
  const [activeSection, setActiveSection] = useState('home');
  const [loading, setLoading] = useState(true);

  // Core portfolio state data
  const [homepageData, setHomepageData] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        // Fetch all endpoints in parallel
        const [
          homepageRes,
          experiencesRes,
          educationRes,
          projectsRes,
          skillsRes,
          certificatesRes,
        ] = await Promise.all([
          fetch(`${API_BASE_URL}/homepage`).then((r) => r.json()),
          fetch(`${API_BASE_URL}/experiences`).then((r) => r.json()),
          fetch(`${API_BASE_URL}/education`).then((r) => r.json()),
          fetch(`${API_BASE_URL}/projects`).then((r) => r.json()),
          fetch(`${API_BASE_URL}/skills`).then((r) => r.json()),
          fetch(`${API_BASE_URL}/certificates`).then((r) => r.json()),
        ]);

        if (homepageRes.success) setHomepageData(homepageRes.data);
        if (experiencesRes.success) setExperiences(experiencesRes.data || []);
        if (educationRes.success) setEducation(educationRes.data || []);
        if (projectsRes.success) setProjects(projectsRes.data || []);
        if (skillsRes.success) setSkills(skillsRes.data || []);
        if (certificatesRes.success) setCertificates(certificatesRes.data || []);
      } catch (error) {
        console.error('Failed to load portfolio database records', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // IntersectionObserver to spy on scroll positions and update active menu item
  useEffect(() => {
    if (loading) return;

    const sections = ['home', 'experience', 'education', 'projects', 'skills', 'certificates'];
    const observers = [];

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -50% 0px', // Trigger when section occupies the main center area of viewport
      threshold: 0,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [loading]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f4f4f7',
        color: '#1e293b',
        fontFamily: 'sans-serif'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid rgba(2, 132, 199, 0.1)',
          borderTop: '4px solid #0284c7',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '1rem'
        }} />
        <p style={{ fontWeight: 600, color: '#64748b' }}>Loading Portfolio...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Get name initials or first word for logo
  const logoInitial = homepageData?.contact_no ? 'ME' : 'ME';

  return (
    <div className="portfolio-root">
      {/* Background Glows */}
      <div className="portfolio-glow-container">
        <div className="portfolio-glow-blob1"></div>
        <div className="portfolio-glow-blob2"></div>
      </div>

      {/* Navigation Header */}
      <nav className="portfolio-nav">
        <div className="portfolio-nav-container">
          <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }} className="portfolio-logo-area">
            <div className="portfolio-logo-circle">{logoInitial}</div>
            <span className="portfolio-logo-text">Mathanraaj</span>
          </a>

          <ul className="portfolio-menu">
            <li>
              <a
                href="#home"
                onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}
                className={`portfolio-menu-link ${activeSection === 'home' ? 'active' : ''}`}
              >
                About Me
              </a>
            </li>
            <li>
              <a
                href="#experience"
                onClick={(e) => { e.preventDefault(); scrollToSection('experience'); }}
                className={`portfolio-menu-link ${activeSection === 'experience' ? 'active' : ''}`}
              >
                Experience
              </a>
            </li>
            <li>
              <a
                href="#education"
                onClick={(e) => { e.preventDefault(); scrollToSection('education'); }}
                className={`portfolio-menu-link ${activeSection === 'education' ? 'active' : ''}`}
              >
                Education
              </a>
            </li>
            <li>
              <a
                href="#projects"
                onClick={(e) => { e.preventDefault(); scrollToSection('projects'); }}
                className={`portfolio-menu-link ${activeSection === 'projects' ? 'active' : ''}`}
              >
                Projects
              </a>
            </li>
            <li>
              <a
                href="#skills"
                onClick={(e) => { e.preventDefault(); scrollToSection('skills'); }}
                className={`portfolio-menu-link ${activeSection === 'skills' ? 'active' : ''}`}
              >
                Skills
              </a>
            </li>
            <li>
              <a
                href="#certificates"
                onClick={(e) => { e.preventDefault(); scrollToSection('certificates'); }}
                className={`portfolio-menu-link ${activeSection === 'certificates' ? 'active' : ''}`}
              >
                Certificates
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Single Page Scrolling Content */}
      <div className="portfolio-container">
        <section id="home" className="portfolio-section">
          <div className="portfolio-section-inner">
            <PortfolioHome data={homepageData} />
          </div>
        </section>

        <section id="experience" className="portfolio-section">
          <div className="portfolio-section-inner">
            <PortfolioExperience experiences={experiences} />
          </div>
        </section>

        <section id="education" className="portfolio-section">
          <div className="portfolio-section-inner">
            <PortfolioEducation education={education} />
          </div>
        </section>

        <section id="projects" className="portfolio-section">
          <div className="portfolio-section-inner">
            <PortfolioProjects projects={projects} />
          </div>
        </section>

        <section id="skills" className="portfolio-section">
          <div className="portfolio-section-inner">
            <PortfolioSkills skills={skills} />
          </div>
        </section>

        <section id="certificates" className="portfolio-section">
          <div className="portfolio-section-inner">
            <PortfolioCertificates certificates={certificates} />
          </div>
        </section>
      </div>
    </div>
  );
}
