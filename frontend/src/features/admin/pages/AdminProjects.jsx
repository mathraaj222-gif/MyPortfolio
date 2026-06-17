import { useState, useEffect } from 'react';
import { FolderGit2, Plus, Edit2, Trash2, ExternalLink, Save, Upload } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form states
  const [projectPicUrl, setProjectPicUrl] = useState([]);
  const [picUrlInput, setPicUrlInput] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectTechStacks, setProjectTechStacks] = useState([]);
  const [newTech, setNewTech] = useState("");
  const [projectLiveLink, setProjectLiveLink] = useState("");
  const [projectGithubLink, setProjectGithubLink] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/projects`);
      const result = await res.json();
      if (result.success) {
        setProjects(result.data || []);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  const handleAddNew = () => {
    setEditingId(null);
    setProjectPicUrl([]);
    setPicUrlInput("");
    setProjectTitle("");
    setProjectDescription("");
    setProjectTechStacks([]);
    setNewTech("");
    setProjectLiveLink("");
    setProjectGithubLink("");
    setShowForm(true);
  };

  const handleEdit = (project) => {
    setEditingId(project.id);
    setProjectPicUrl(project.project_pic_url || []);
    setPicUrlInput("");
    setProjectTitle(project.project_title || "");
    setProjectDescription(project.project_description || "");
    setProjectTechStacks(project.project_tech_stacks || []);
    setNewTech("");
    setProjectLiveLink(project.project_live_link || "");
    setProjectGithubLink(project.project_github_link || "");
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/projects/${id}`, {
          method: 'DELETE'
        });
        const result = await res.json();
        if (result.success) {
          fetchProjects();
        } else {
          alert("Error: " + result.message);
        }
      } catch (err) {
        console.error("Error deleting project:", err);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  // Tech stack chips helpers
  const handleAddTech = (e) => {
    e.preventDefault();
    const clean = newTech.trim();
    if (clean && !projectTechStacks.includes(clean)) {
      setProjectTechStacks([...projectTechStacks, clean]);
      setNewTech("");
    }
  };

  const handleRemoveTech = (tech) => {
    setProjectTechStacks(projectTechStacks.filter(t => t !== tech));
  };

  // Image helpers
  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProjectPicUrl(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddPicUrl = () => {
    const clean = picUrlInput.trim();
    if (clean) {
      setProjectPicUrl(prev => [...prev, clean]);
      setPicUrlInput("");
    }
  };

  const handleRemovePicUrl = (index) => {
    setProjectPicUrl(projectPicUrl.filter((_, idx) => idx !== index));
  };

  // Submit Save
  const handleSaveAction = async () => {
    if (!projectTitle || !projectDescription) {
      alert("Please fill in all required fields (marked with *).");
      return;
    }

    const payload = {
      project_title: projectTitle,
      project_description: projectDescription,
      project_tech_stacks: projectTechStacks,
      project_live_link: projectLiveLink || null,
      project_github_link: projectGithubLink || null,
      project_pic_url: projectPicUrl,
    };

    try {
      const url = editingId 
        ? `${API_BASE_URL}/admin/projects/${editingId}` 
        : `${API_BASE_URL}/admin/projects`;
      
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (result.success) {
        setShowForm(false);
        fetchProjects();
      } else {
        alert("Failed to save project: " + result.message);
      }
    } catch (err) {
      console.error("Error saving project:", err);
      alert("Connection failure, failed to save.");
    }
  };

  const handleSaveSubmit = (e) => {
    e.preventDefault();
    handleSaveAction();
  };

  if (showForm) {
    return (
      <div className="glass-panel animate-fade-in" style={{ padding: '2rem', flexGrow: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem' }}>
          <div>
            <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <FolderGit2 className="card-icon-container" style={{ width: '36px', height: '36px', padding: '6px' }} />
              {editingId ? 'Edit Showcase Project' : 'New Showcase Project'}
            </h1>
            <p className="page-subtitle">{editingId ? 'Modify details of this showcase project.' : 'Provide details to showcase a new build.'}</p>
          </div>
          <button className="btn-secondary" onClick={handleCancel}>Cancel</button>
        </div>

        <form onSubmit={handleSaveSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Picture Box - can upload many pics */}
          <div className="form-group">
            <label className="form-label">Project Images * (Upload multiple pictures)</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <label className="btn-secondary" style={{ display: 'inline-flex', cursor: 'pointer', fontSize: '0.85rem' }}>
                  <Upload size={14} />
                  <span>Choose Images</span>
                  <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleImagesChange} />
                </label>
                <div style={{ flexGrow: 1 }}>
                  <input
                    type="text"
                    className="form-input"
                    value={picUrlInput}
                    onChange={(e) => setPicUrlInput(e.target.value)}
                    placeholder="Or enter image URL and press Add"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddPicUrl();
                      }
                    }}
                  />
                </div>
                <button type="button" className="btn-secondary" onClick={handleAddPicUrl}>Add</button>
              </div>

              {/* Grid of Preview Boxes */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                {projectPicUrl.map((url, idx) => (
                  <div key={idx} style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-glass)' }}>
                    <img src={url} alt={`preview-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                      type="button"
                      onClick={() => handleRemovePicUrl(idx)}
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        backgroundColor: 'rgba(239, 68, 68, 0.9)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '18px',
                        height: '18px',
                        fontSize: '10px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        lineHeight: 1
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                {projectPicUrl.length === 0 && (
                  <div style={{ flexGrow: 1, border: '1px dashed var(--border-glass)', borderRadius: '8px', padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    No pictures uploaded yet. Add at least one image URL or select files.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Project Title *</label>
              <input
                type="text"
                className="form-input"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="e.g. AI Recruiting Platform"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Tech Stacks (Chips)</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="text"
                  className="form-input"
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  placeholder="e.g. React, Node.js (Press Enter)"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddTech(e);
                    }
                  }}
                />
                <button type="button" className="btn-secondary" onClick={handleAddTech}>Add</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {projectTechStacks.map((tech, idx) => (
                  <span key={idx} className="badge badge-purple" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                    {tech}
                    <button type="button" onClick={() => handleRemoveTech(tech)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '0.7rem' }}>×</button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Project Description *</label>
            <textarea
              className="form-input"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Provide a detailed description of the project..."
              style={{ minHeight: '120px', resize: 'vertical' }}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Live / Webpage URL</label>
              <input
                type="url"
                className="form-input"
                value={projectLiveLink}
                onChange={(e) => setProjectLiveLink(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <div className="form-group">
              <label className="form-label">GitHub Repository URL</label>
              <input
                type="url"
                className="form-input"
                value={projectGithubLink}
                onChange={(e) => setProjectGithubLink(e.target.value)}
                placeholder="https://github.com/username/repo"
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', borderTop: '1px solid var(--border-glass)', paddingTop: '1.5rem' }}>
            <button type="submit" className="btn-primary">
              <Save size={16} />
              <span>Save & Publish</span>
            </button>
            <button type="button" className="btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ padding: '2rem', flexGrow: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div className="page-title-area">
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FolderGit2 className="card-icon-container" style={{ width: '36px', height: '36px', padding: '6px' }} />
            Portfolio Projects
          </h1>
          <p className="page-subtitle">Add, edit, or archive project showcases displayed on your homepage.</p>
        </div>
        <button className="btn-primary" onClick={handleAddNew}>
          <Plus size={16} />
          <span>New Project</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
        {projects.map((project) => (
          <div key={project.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', border: '1px solid var(--border-glass)' }}>
            
            {/* Show first image as header banner if exists */}
            {project.project_pic_url && project.project_pic_url.length > 0 && (
              <div style={{ height: '180px', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.25rem', border: '1px solid var(--border-glass)' }}>
                <img src={project.project_pic_url[0]} alt={project.project_title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>{project.project_title}</h3>
            </div>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '1rem 0', flexGrow: 1 }}>
              {project.project_description}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
              {project.project_tech_stacks?.map((tag, idx) => (
                <span key={idx} style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.04)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                  {tag}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-glass)', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn-secondary" style={{ padding: '0.4rem' }} onClick={() => handleEdit(project)}>
                  <Edit2 size={13} />
                </button>
                <button className="btn-secondary" style={{ padding: '0.4rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }} onClick={() => handleDelete(project.id)}>
                  <Trash2 size={13} />
                </button>
              </div>
              
              {project.project_live_link && (
                <a href={project.project_live_link} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.3rem', textDecoration: 'none' }}>
                  <span>Demo</span>
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border-glass)', borderRadius: '16px' }}>
            No projects found. Click New Project to add one.
          </div>
        )}
      </div>
    </div>
  );
}
