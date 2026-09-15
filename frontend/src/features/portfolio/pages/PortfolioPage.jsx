import { useState, useEffect, useRef } from 'react';
import PortfolioHome from '../components/PortfolioHome';
import PortfolioExperience from '../components/PortfolioExperience';
import PortfolioEducation from '../components/PortfolioEducation';
import PortfolioProjects from '../components/PortfolioProjects';
import PortfolioSkills from '../components/PortfolioSkills';
import PortfolioCertificates from '../components/PortfolioCertificates';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1').replace(/\/$/, '');
const CACHE_KEY = 'portfolio_data_cache';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes — matches server Cache-Control

// ─── Skeleton shimmer components ─────────────────────────────────────────────
function SkeletonBlock({ width = '100%', height = '1.2rem', radius = '8px', style = {} }) {
  return (
    <div className="skeleton-shimmer" style={{ width, height, borderRadius: radius, ...style }} />
  );
}

function HomeSkeleton() {
  return (
    <div className="portfolio-home-grid">
      <div className="portfolio-bio-content">
        <SkeletonBlock width="180px" height="1rem" />
        <SkeletonBlock width="260px" height="2.5rem" radius="12px" style={{ marginTop: '0.5rem' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
          <SkeletonBlock height="1rem" />
          <SkeletonBlock height="1rem" width="90%" />
          <SkeletonBlock height="1rem" width="80%" />
          <SkeletonBlock height="1rem" width="85%" />
        </div>
        <SkeletonBlock width="150px" height="2.5rem" radius="10px" style={{ marginTop: '0.5rem' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        <SkeletonBlock width="320px" height="320px" radius="44px" />
        <div style={{ display: 'flex', gap: '1rem' }}>
          {[1,2,3,4].map(i => <SkeletonBlock key={i} width="46px" height="46px" radius="12px" />)}
        </div>
      </div>
    </div>
  );
}

function SectionSkeleton({ rows = 3 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <SkeletonBlock width="200px" height="2.25rem" radius="12px" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="portfolio-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <SkeletonBlock width="60%" height="1.3rem" radius="8px" />
          <SkeletonBlock height="1rem" />
          <SkeletonBlock height="1rem" width="85%" />
          <SkeletonBlock height="1rem" width="70%" />
        </div>
      ))}
    </div>
  );
}

// ─── Cache helpers ────────────────────────────────────────────────────────────
function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL_MS) return null; // expired
    return data;
  } catch {
    return null;
  }
}

function writeCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
  } catch {
    // localStorage may be unavailable (private browsing) — silently ignore
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PortfolioPage() {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Individual loading states — each section renders independently
  const [homepageData, setHomepageData] = useState(null);
  const [experiences, setExperiences] = useState(null);   // null = loading, [] = loaded/empty
  const [education, setEducation] = useState(null);
  const [projects, setProjects] = useState(null);
  const [skills, setSkills] = useState(null);
  const [certificates, setCertificates] = useState(null);

  const [fetchError, setFetchError] = useState(false);
  const hasFetchedRef = useRef(false);

  // ── Data fetching with stale-while-revalidate ─────────────────────────────
  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const applyData = (data) => {
      setHomepageData(data.homepage ?? null);
      setExperiences(data.experiences ?? []);
      setEducation(data.education ?? []);
      setProjects(data.projects ?? []);
      setSkills(data.skills ?? []);
      setCertificates(data.certificates ?? []);
    };

    // 1️⃣ Immediately render from cache — zero perceived latency on repeat visits
    const cached = readCache();
    if (cached) applyData(cached);

    // 2️⃣ Always fetch fresh data in the background
    fetch(`${API_BASE_URL}/portfolio`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((res) => {
        if (res.success && res.data) {
          applyData(res.data);
          writeCache(res.data); // update cache for next visit
        }
      })
      .catch((err) => {
        console.error('Failed to load portfolio data:', err);
        // Only show error screen if there was no cached data to fall back on
        if (!cached) setFetchError(true);
      });
  }, []);

  // ── IntersectionObserver — active nav section spy ─────────────────────────
  useEffect(() => {
    // Wait until at least homepage data is loaded before observing
    if (homepageData === null && !fetchError) return;

    const sections = ['home', 'experience', 'education', 'projects', 'skills', 'certificates'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { root: null, rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [homepageData, fetchError]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
    setMobileNavOpen(false);
  };

  // ── Error screen ──────────────────────────────────────────────────────────
  if (fetchError) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        alignItems: 'center', minHeight: '100vh', backgroundColor: '#f4f4f7',
        color: '#1e293b', fontFamily: 'sans-serif', gap: '1rem', padding: '2rem'
      }}>
        <div style={{ fontSize: '3rem' }}>⚠️</div>
        <h2 style={{ fontWeight: 700, fontSize: '1.5rem', margin: 0 }}>Could not load portfolio</h2>
        <p style={{ color: '#64748b', textAlign: 'center', maxWidth: '400px' }}>
          The backend server appears to be offline or unreachable. Please try again in a moment.
        </p>
        <button
          onClick={() => { setFetchError(false); hasFetchedRef.current = false; }}
          style={{
            padding: '0.7rem 1.5rem', background: '#0284c7', color: 'white',
            border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  const navLinks = ['home', 'experience', 'education', 'projects', 'skills', 'certificates'];
  const navLabels = { home: 'About Me', experience: 'Experience', education: 'Education', projects: 'Projects', skills: 'Skills', certificates: 'Certificates' };

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
            <div className="portfolio-logo-circle">M</div>
            <span className="portfolio-logo-text">
              {homepageData?.full_name || 'Mathanraaj'}
            </span>
          </a>

          {/* Desktop nav */}
          <ul className="portfolio-menu">
            {navLinks.map((id) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={(e) => { e.preventDefault(); scrollToSection(id); }}
                  className={`portfolio-menu-link ${activeSection === id ? 'active' : ''}`}
                >
                  {navLabels[id]}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile hamburger */}
          <button
            id="mobile-menu-toggle"
            className="portfolio-hamburger"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileNavOpen}
            onClick={() => setMobileNavOpen((o) => !o)}
          >
            <span className={`hamburger-bar ${mobileNavOpen ? 'open' : ''}`}></span>
            <span className={`hamburger-bar ${mobileNavOpen ? 'open' : ''}`}></span>
            <span className={`hamburger-bar ${mobileNavOpen ? 'open' : ''}`}></span>
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {mobileNavOpen && (
          <div className="portfolio-mobile-menu">
            {navLinks.map((id) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => { e.preventDefault(); scrollToSection(id); }}
                className={`portfolio-mobile-link ${activeSection === id ? 'active' : ''}`}
              >
                {navLabels[id]}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* Main Single Page Scrolling Content */}
      <div className="portfolio-container">
        <section id="home" className="portfolio-section">
          <div className="portfolio-section-inner">
            {homepageData !== null ? <PortfolioHome data={homepageData} /> : <HomeSkeleton />}
          </div>
        </section>

        <section id="experience" className="portfolio-section">
          <div className="portfolio-section-inner">
            {experiences !== null ? <PortfolioExperience experiences={experiences} /> : <SectionSkeleton rows={2} />}
          </div>
        </section>

        <section id="education" className="portfolio-section">
          <div className="portfolio-section-inner">
            {education !== null ? <PortfolioEducation education={education} /> : <SectionSkeleton rows={2} />}
          </div>
        </section>

        <section id="projects" className="portfolio-section">
          <div className="portfolio-section-inner">
            {projects !== null ? <PortfolioProjects projects={projects} /> : <SectionSkeleton rows={2} />}
          </div>
        </section>

        <section id="skills" className="portfolio-section">
          <div className="portfolio-section-inner">
            {skills !== null ? <PortfolioSkills skills={skills} /> : <SectionSkeleton rows={1} />}
          </div>
        </section>

        <section id="certificates" className="portfolio-section">
          <div className="portfolio-section-inner">
            {certificates !== null ? <PortfolioCertificates certificates={certificates} /> : <SectionSkeleton rows={2} />}
          </div>
        </section>
      </div>
    </div>
  );
}
