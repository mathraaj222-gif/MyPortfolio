import { useState, useEffect, useRef } from 'react';
import PortfolioHome from '../components/PortfolioHome';
import PortfolioExperience from '../components/PortfolioExperience';
import PortfolioEducation from '../components/PortfolioEducation';
import PortfolioProjects from '../components/PortfolioProjects';
import PortfolioSkills from '../components/PortfolioSkills';
import PortfolioCertificates from '../components/PortfolioCertificates';
import FloatingElementsBackground from '../components/FloatingElementsBackground';
import LotusLoader from '../components/LotusLoader';
import PortfolioFooter from '../components/PortfolioFooter';

import { AiGuideProvider, useAiGuide } from '../../ai-guide/context/AiGuideContext';
import AiGuideBar from '../../ai-guide/components/AiGuideBar';
import AiGuideCanvas from '../../ai-guide/components/AiGuideCanvas';
import AiFloatingTrigger from '../../ai-guide/components/AiFloatingTrigger';
import { Sparkles, ArrowLeft } from 'lucide-react';

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
          {[1, 2, 3, 4].map((i) => (
            <SkeletonBlock key={i} width="46px" height="46px" radius="12px" />
          ))}
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

// ─── Inner Page View that consumes AiGuideContext ──────────────────────────────
function PortfolioInnerView({
  homepageData,
  experiences,
  education,
  projects,
  skills,
  certificates,
  portfolioData,
}) {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { activeMode, isMinimized, exitGuide, enterGenUI } = useAiGuide();
  const navContainerRef = useRef(null);

  const isGenUiActive = activeMode === 'genui' && !isMinimized;

  // ── Scroll active nav item into view ─────────────────────────
  useEffect(() => {
    if (navContainerRef.current && activeSection && !isGenUiActive) {
      const activeElement = navContainerRef.current.querySelector('.active');
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeSection, isGenUiActive]);

  // ── IntersectionObserver — active nav section spy ─────────────────────────
  useEffect(() => {
    if (isGenUiActive || homepageData === null) return;

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
  }, [homepageData, isGenUiActive]);

  const scrollToSection = (id) => {
    if (isGenUiActive) {
      exitGuide();
    }
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        setActiveSection(id);
      }
    }, 50);
    setMobileNavOpen(false);
  };

  const navLinks = ['home', 'experience', 'education', 'projects', 'skills', 'certificates'];
  const navLabels = {
    home: 'About Me',
    experience: 'Experience',
    education: 'Education',
    projects: 'Projects',
    skills: 'Skills',
    certificates: 'Certificates',
  };

  return (
    <div className="portfolio-root">
      {/* Background Floating Elements (Books, Equations, Graphs, AI Robots) */}
      <FloatingElementsBackground />

      {/* Background Glows */}
      <div className="portfolio-glow-container">
        <div className="portfolio-glow-blob1"></div>
        <div className="portfolio-glow-blob2"></div>
      </div>

      {/* Navigation Header */}
      <nav className="portfolio-nav">
        <div className="portfolio-nav-container">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('home');
            }}
            className="portfolio-logo-area"
          >
            <img src="/mrblack.png" alt="Mathanraaj Logo" style={{ objectFit: 'contain', width: '45px', height: '45px', background: 'transparent', border: 'none' }} />
            <span className="portfolio-logo-text">
              {homepageData?.full_name || 'Mathanraaj'}
            </span>
          </a>

          {/* Desktop nav & GenUI actions */}
          <div className="portfolio-nav-right" style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
            {isGenUiActive ? (
              <div style={{ display: 'flex', alignItems: 'center', flex: 1, paddingLeft: '1rem' }}>
                <button
                  onClick={exitGuide}
                  className="ai-canvas-back-btn"
                  title="Return to static portfolio view"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: '#1e293b', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}
                >
                  <ArrowLeft size={16} />
                  <span>Go Back to Portfolio</span>
                </button>
              </div>
            ) : (
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  paddingRight: '1rem',
                }}
              >
                <div
                  className="cylinder-nav-container"
                  style={{
                    height: '36px',
                    overflow: 'hidden',
                    position: 'relative',
                    borderRadius: '18px',
                    backgroundColor: 'rgba(255, 255, 255, 0.55)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    padding: '0 1.25rem',
                    border: '1px solid rgba(255, 255, 255, 0.7)',
                    boxShadow: '0 4px 14px rgba(43, 45, 51, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                  }}
                >
                  <ul
                    style={{
                      listStyle: 'none',
                      margin: 0,
                      padding: 0,
                      transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: `translateY(-${Math.max(0, navLinks.indexOf(activeSection)) * 36}px)`,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {navLinks.map((id) => (
                      <li key={id} style={{ height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--pf-accent)', display: 'inline-block' }} />
                        <a
                          href={`#${id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            scrollToSection(id);
                          }}
                          style={{
                            textDecoration: 'none',
                            color: 'var(--pf-charcoal)',
                            fontWeight: 600,
                            fontSize: '0.825rem',
                            letterSpacing: '0.6px',
                            textTransform: 'uppercase'
                          }}
                        >
                          {navLabels[id]}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div style={{ paddingLeft: '1rem' }}>
              <button
                className={`portfolio-menu-ai-btn ${isGenUiActive ? 'active' : ''}`}
                onClick={() => {
                  if (isGenUiActive) {
                    const bar = document.getElementById('home');
                    if (bar) bar.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    enterGenUI();
                  }
                }}
              >
                <Sparkles size={14} />
                <span>AI Guide</span>
              </button>
            </div>
          </div>

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
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(id);
                }}
                className={`portfolio-mobile-link ${activeSection === id && !isGenUiActive ? 'active' : ''}`}
              >
                {navLabels[id]}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <div className="portfolio-container">
        {isGenUiActive ? (
          /* ── GenUI Active View Mode ── */
          <div className="portfolio-genui-wrapper">
            <AiGuideCanvas portfolioData={portfolioData} />
          </div>
        ) : (
          /* ── Normal Static Portfolio View ── */
          <>
            {/* Hero / About Section */}
            <section id="home" className="portfolio-section">
              <div className="portfolio-section-inner">
                {homepageData !== null ? <PortfolioHome data={homepageData} /> : <HomeSkeleton />}

                {/* Interactive AI Guide Command Bar */}
                <div id="ai-guide-bar-anchor" style={{ marginTop: '2.5rem' }}>
                  <AiGuideBar />
                </div>
              </div>
            </section>

            {/* Work Experience */}
            <section id="experience" className="portfolio-section">
              <div className="portfolio-section-inner">
                {experiences !== null ? <PortfolioExperience experiences={experiences} /> : <SectionSkeleton rows={2} />}
              </div>
            </section>

            {/* Education */}
            <section id="education" className="portfolio-section">
              <div className="portfolio-section-inner">
                {education !== null ? <PortfolioEducation education={education} /> : <SectionSkeleton rows={2} />}
              </div>
            </section>

            {/* Projects */}
            <section id="projects" className="portfolio-section">
              <div className="portfolio-section-inner">
                {projects !== null ? <PortfolioProjects projects={projects} /> : <SectionSkeleton rows={2} />}
              </div>
            </section>

            {/* Skills */}
            <section id="skills" className="portfolio-section">
              <div className="portfolio-section-inner">
                {skills !== null ? <PortfolioSkills skills={skills} /> : <SectionSkeleton rows={1} />}
              </div>
            </section>

            {/* Certificates */}
            <section id="certificates" className="portfolio-section">
              <div className="portfolio-section-inner">
                {certificates !== null ? <PortfolioCertificates certificates={certificates} /> : <SectionSkeleton rows={2} />}
              </div>
            </section>

            {/* Footer matching reference design */}
            <PortfolioFooter data={homepageData} />
          </>
        )}
      </div>

      {/* Floating minimized trigger badge */}
      <AiFloatingTrigger />
    </div>
  );
}

// ─── Main Component with State & Provider ─────────────────────────────────────
export default function PortfolioPage() {
  // Individual loading states
  const [homepageData, setHomepageData] = useState(null);
  const [experiences, setExperiences] = useState(null);
  const [education, setEducation] = useState(null);
  const [projects, setProjects] = useState(null);
  const [skills, setSkills] = useState(null);
  const [certificates, setCertificates] = useState(null);

  const [fetchError, setFetchError] = useState(false);
  // true only when there is no cache — shows the full-page lotus loader
  const [isInitialLoading, setIsInitialLoading] = useState(!readCache());
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
      setIsInitialLoading(false); // dismiss loader once data is ready
    };

    // 1️⃣ Immediately render from cache
    const cached = readCache();
    if (cached) applyData(cached);

    // 2️⃣ Always fetch fresh data in background
    fetch(`${API_BASE_URL}/portfolio`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((res) => {
        if (res.success && res.data) {
          applyData(res.data);
          writeCache(res.data);
        }
      })
      .catch((err) => {
        console.error('Failed to load portfolio data:', err);
        if (!cached) setFetchError(true);
      });
  }, []);

  if (fetchError) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#f4f4f7',
          color: '#1e293b',
          fontFamily: 'sans-serif',
          gap: '1rem',
          padding: '2rem',
        }}
      >
        <div style={{ fontSize: '3rem' }}>⚠️</div>
        <h2 style={{ fontWeight: 700, fontSize: '1.5rem', margin: 0 }}>Could not load portfolio</h2>
        <p style={{ color: '#64748b', textAlign: 'center', maxWidth: '400px' }}>
          The backend server appears to be offline or unreachable. Please try again in a moment.
        </p>
        <button
          onClick={() => {
            setFetchError(false);
            hasFetchedRef.current = false;
          }}
          style={{
            padding: '0.7rem 1.5rem',
            background: '#0284c7',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.95rem',
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  const portfolioData = {
    homepage: homepageData,
    experiences: experiences || [],
    education: education || [],
    projects: projects || [],
    skills: skills || [],
    certificates: certificates || [],
  };

  return (
    <>
      {/* Full-screen lotus spinner — only shown on cold load (no cache) */}
      <LotusLoader isLoading={isInitialLoading} />

      <AiGuideProvider portfolioData={portfolioData}>
      <PortfolioInnerView
        homepageData={homepageData}
        experiences={experiences}
        education={education}
        projects={projects}
        skills={skills}
        certificates={certificates}
        portfolioData={portfolioData}
      />
    </AiGuideProvider>
    </>
  );
}
