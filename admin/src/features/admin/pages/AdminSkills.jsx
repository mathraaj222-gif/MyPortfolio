import { useState, useEffect } from 'react';
import { Code, Plus, Trash2, Search } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const suggestedSkills = [
  { name: "React", iconSlug: "react" },
  { name: "Node.js", iconSlug: "nodejs" },
  { name: "JavaScript", iconSlug: "javascript" },
  { name: "TypeScript", iconSlug: "typescript" },
  { name: "Python", iconSlug: "python" },
  { name: "Java", iconSlug: "java" },
  { name: "MySQL", iconSlug: "mysql" },
  { name: "PostgreSQL", iconSlug: "postgresql" },
  { name: "MongoDB", iconSlug: "mongodb" },
  { name: "Docker", iconSlug: "docker" },
  { name: "Kubernetes", iconSlug: "kubernetes" },
  { name: "Git", iconSlug: "git" },
  { name: "Go", iconSlug: "go" },
  { name: "Rust", iconSlug: "rust" },
  { name: "Tailwind CSS", iconSlug: "tailwindcss" },
  { name: "HTML5", iconSlug: "html5" },
  { name: "CSS3", iconSlug: "css3" },
  { name: "Vue.js", iconSlug: "vuejs" },
  { name: "Angular", iconSlug: "angular" },
  { name: "PHP", iconSlug: "php" },
  { name: "Ruby", iconSlug: "ruby" },
  { name: "Swift", iconSlug: "swift" },
  { name: "Kotlin", iconSlug: "kotlin" },
  { name: "Flutter", iconSlug: "flutter" },
  { name: "Dart", iconSlug: "dart" },
  { name: "Redis", iconSlug: "redis" },
  { name: "GraphQL", iconSlug: "graphql", isPlain: true },
  { name: "Firebase", iconSlug: "firebase" },
  { name: "Supabase", iconSlug: "supabase" },
  { name: "Figma", iconSlug: "figma" },
  { name: "Linux", iconSlug: "linux" },
  { name: "C++", iconSlug: "cplusplus" },
  { name: "C#", iconSlug: "csharp" },
  { name: "Sass", iconSlug: "sass" },
  { name: "Webpack", iconSlug: "webpack" },
  { name: "Nginx", iconSlug: "nginx" }
];

export default function AdminSkills() {
  const [skills, setSkills] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Custom manual inputs
  const [customName, setCustomName] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [showCustomInputs, setShowCustomInputs] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/skills`);
      const result = await res.json();
      if (result.success) {
        setSkills(result.data || []);
      }
    } catch (err) {
      console.error("Error fetching skills:", err);
    }
  };

  const handleAddSuggestedSkill = async (skill) => {
    const slug = skill.iconSlug;
    const type = skill.isPlain ? "plain" : "original";
    const imageUrl = `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${slug}/${slug}-${type}.svg`;
    
    await saveSkill(skill.name, imageUrl);
  };

  const handleAddCustomSkill = async (e) => {
    e.preventDefault();
    const name = customName.trim();
    const url = customUrl.trim();
    if (!name) {
      alert("Skill Name is required.");
      return;
    }
    await saveSkill(name, url || null);
    setCustomName("");
    setCustomUrl("");
    setShowCustomInputs(false);
  };

  const saveSkill = async (name, imageUrl) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/skills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          skill_name: name,
          skill_image_url: imageUrl
        })
      });
      const result = await res.json();
      if (result.success) {
        fetchSkills();
        setSearchQuery("");
      } else {
        alert("Failed to add skill: " + result.message);
      }
    } catch (err) {
      console.error("Error adding skill:", err);
    }
  };

  const handleDeleteSkill = async (id) => {
    if (confirm("Are you sure you want to delete this skill?")) {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/skills/${id}`, {
          method: 'DELETE'
        });
        const result = await res.json();
        if (result.success) {
          fetchSkills();
        } else {
          alert("Failed to delete skill: " + result.message);
        }
      } catch (err) {
        console.error("Error deleting skill:", err);
      }
    }
  };

  // Filter suggested list based on query
  const filteredSuggestions = searchQuery.trim() === ""
    ? []
    : suggestedSkills.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div className="glass-panel" style={{ padding: '2rem', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1.5rem' }}>
        <div className="page-title-area">
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Code className="card-icon-container" style={{ width: '36px', height: '36px', padding: '6px' }} />
            Tech Stack Skills
          </h1>
          <p className="page-subtitle">Search, select, and manage technical abilities displayed on your portfolio.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2.5rem' }}>
        
        {/* Left Column: Search and Add Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="glass-panel" style={{ padding: '1.5rem', border: '1px solid var(--border-glass)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Search Developer Icons</h2>
            
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search skills e.g. React, Java, Docker..."
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>

            {/* Suggestions results dropdown list */}
            {searchQuery.trim() !== "" && (
              <div className="glass-panel" style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid var(--border-glass)', borderRadius: '8px', zIndex: 10 }}>
                {filteredSuggestions.map((skill, idx) => {
                  const slug = skill.iconSlug;
                  const type = skill.isPlain ? "plain" : "original";
                  const imageUrl = `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${slug}/${slug}-${type}.svg`;
                  return (
                    <div
                      key={idx}
                      onClick={() => handleAddSuggestedSkill(skill)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 1rem',
                        cursor: 'pointer',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        transition: 'var(--transition-smooth)'
                      }}
                      className="menu-item-link"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img src={imageUrl} alt={skill.name} style={{ width: '24px', height: '24px' }} onError={(e) => { e.target.src = "https://img.icons8.com/color/48/000000/code.png"; }} />
                        <span style={{ fontWeight: '500' }}>{skill.name}</span>
                      </div>
                      <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>Click to Add</span>
                    </div>
                  );
                })}
                {filteredSuggestions.length === 0 && (
                  <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    No matching suggested icons.
                  </div>
                )}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={() => setShowCustomInputs(!showCustomInputs)}
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
              >
                {showCustomInputs ? 'Hide Custom Input' : 'Add Custom Skill / Logo'}
              </button>
            </div>

            {/* Manual custom add form */}
            {showCustomInputs && (
              <form onSubmit={handleAddCustomSkill} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--border-glass)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Skill Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g. OpenCV, PyTorch"
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Logo Image URL (Optional)</label>
                  <input
                    type="url"
                    className="form-input"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://example.com/logo.svg"
                  />
                </div>
                <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', alignSelf: 'flex-start' }}>
                  <Plus size={14} />
                  <span>Register Skill</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Grid of skills in the Profile */}
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Current Skills Profile
            <span className="badge badge-purple">{skills.length}</span>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '1.25rem' }}>
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="glass-panel"
                style={{
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.75rem',
                  border: '1px solid var(--border-glass)',
                  position: 'relative',
                  textAlign: 'center',
                  transition: 'var(--transition-smooth)'
                }}
              >
                {/* Delete overlay hover button */}
                <button
                  onClick={() => handleDeleteSkill(skill.id)}
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    background: 'none',
                    border: 'none',
                    color: 'rgba(239, 68, 68, 0.6)',
                    cursor: 'pointer',
                    padding: '2px',
                    borderRadius: '4px',
                    transition: 'var(--transition-smooth)'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(239, 68, 68, 0.6)'; }}
                >
                  <Trash2 size={13} />
                </button>

                {/* Skill logo or placeholder code icon */}
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '8px',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}
                >
                  {skill.skill_image_url ? (
                    <img
                      src={skill.skill_image_url}
                      alt={skill.skill_name}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.parentNode.innerHTML = '<span>⚙️</span>';
                      }}
                    />
                  ) : (
                    <Code size={20} style={{ color: 'var(--text-muted)' }} />
                  )}
                </div>

                <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)', wordBreak: 'break-word' }}>
                  {skill.skill_name}
                </span>
              </div>
            ))}

            {skills.length === 0 && (
              <div
                style={{
                  gridColumn: '1 / -1',
                  padding: '3rem',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  border: '1px dashed var(--border-glass)',
                  borderRadius: '12px'
                }}
              >
                No skills registered in your portfolio yet. Search above to add.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
