import { useState, useEffect } from 'react';
import { Briefcase, Plus, Edit2, Trash2, Save } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api/v1';

const monthsList = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" }
];

const currentYear = new Date().getFullYear();
const yearsList = Array.from({ length: 40 }, (_, i) => String(currentYear + 2 - i));

export default function AdminExperience() {
  const [experiences, setExperiences] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form states
  const [companyName, setCompanyName] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [startMonth, setStartMonth] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [endYear, setEndYear] = useState("");
  const [currentlyWorking, setCurrentlyWorking] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [techStacks, setTechStacks] = useState([]);
  const [newTech, setNewTech] = useState("");
  const [projectDescriptions, setProjectDescriptions] = useState([""]);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/experiences`);
      const result = await res.json();
      if (result.success) {
        setExperiences(result.data || []);
      }
    } catch (err) {
      console.error("Error fetching experiences:", err);
    }
  };

  const handleAddNew = () => {
    setEditingId(null);
    setCompanyName("");
    setJobRole("");
    setStartMonth("");
    setStartYear("");
    setEndMonth("");
    setEndYear("");
    setCurrentlyWorking(false);
    setJobDescription("");
    setTechStacks([]);
    setNewTech("");
    setProjectDescriptions([""]);
    setShowForm(true);
  };

  const handleEdit = (exp) => {
    setEditingId(exp.id);
    setCompanyName(exp.company_name || "");
    setJobRole(exp.job_role || "");

    if (exp.start_date) {
      const d = new Date(exp.start_date);
      setStartMonth(String(d.getUTCMonth() + 1).padStart(2, '0'));
      setStartYear(String(d.getUTCFullYear()));
    } else {
      setStartMonth("");
      setStartYear("");
    }

    if (exp.end_date) {
      const d = new Date(exp.end_date);
      setEndMonth(String(d.getUTCMonth() + 1).padStart(2, '0'));
      setEndYear(String(d.getUTCFullYear()));
    } else {
      setEndMonth("");
      setEndYear("");
    }

    setCurrentlyWorking(exp.currently_working || false);
    setJobDescription(exp.description_job || "");
    setTechStacks(exp.technical_stacks || []);
    setNewTech("");
    setProjectDescriptions(exp.project_description && exp.project_description.length > 0 ? exp.project_description : [""]);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this experience?")) {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/experiences/${id}`, {
          method: 'DELETE'
        });
        const result = await res.json();
        if (result.success) {
          fetchExperiences();
        } else {
          alert("Error: " + result.message);
        }
      } catch (err) {
        console.error("Error deleting experience:", err);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  // Helper date conversions
  const composeISO = (month, year) => {
    if (!month || !year) return null;
    return new Date(Date.UTC(parseInt(year), parseInt(month), 1)).toISOString();
  };

  const formatPeriod = (exp) => {
    if (!exp.start_date) return "";
    const start = new Date(exp.start_date).toLocaleString('default', { month: 'short', year: 'numeric', timeZone: 'UTC' });
    const end = exp.currently_working ? 'Present' : (exp.end_date ? new Date(exp.end_date).toLocaleString('default', { month: 'short', year: 'numeric', timeZone: 'UTC' }) : '');
    return `${start} - ${end}`;
  };

  // Tech Stack helpers
  const handleAddTech = (e) => {
    e.preventDefault();
    const clean = newTech.trim();
    if (clean && !techStacks.includes(clean)) {
      setTechStacks([...techStacks, clean]);
      setNewTech("");
    }
  };

  const handleRemoveTech = (tech) => {
    setTechStacks(techStacks.filter(t => t !== tech));
  };

  // Project description helpers
  const handleAddProjectDesc = () => {
    setProjectDescriptions([...projectDescriptions, ""]);
  };

  const handleProjectDescChange = (index, value) => {
    const updated = [...projectDescriptions];
    updated[index] = value;
    setProjectDescriptions(updated);
  };

  const handleRemoveProjectDesc = (index) => {
    setProjectDescriptions(projectDescriptions.filter((_, idx) => idx !== index));
  };

  // Save submit operation
  const handleSaveAction = async (isDraft = false) => {
    if (!companyName || !jobRole || !startMonth || !startYear || !jobDescription) {
      alert("Please fill in all required fields (marked with *).");
      return;
    }

    const payload = {
      company_name: companyName,
      job_role: jobRole,
      start_date: composeISO(startMonth, startYear),
      end_date: currentlyWorking ? null : composeISO(endMonth, endYear),
      currently_working: currentlyWorking,
      description_job: jobDescription,
      technical_stacks: techStacks,
      project_description: projectDescriptions.filter(desc => desc.trim() !== ""),
    };

    try {
      const url = editingId
        ? `${API_BASE_URL}/admin/experiences/${editingId}`
        : `${API_BASE_URL}/admin/experiences`;

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
        fetchExperiences();
        if (isDraft) {
          alert("Experience saved successfully as Draft.");
        }
      } else {
        alert("Failed to save: " + result.message);
      }
    } catch (err) {
      console.error("Error saving experience:", err);
      alert("Connection failure, failed to save.");
    }
  };

  const handleSaveSubmit = (e) => {
    e.preventDefault();
    handleSaveAction(false);
  };

  if (showForm) {
    return (
      <div className="glass-panel animate-fade-in" style={{ padding: '2rem', flexGrow: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem' }}>
          <div>
            <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Briefcase className="card-icon-container" style={{ width: '36px', height: '36px', padding: '6px' }} />
              {editingId ? 'Edit Work Experience' : 'Add Work Experience'}
            </h1>
            <p className="page-subtitle">{editingId ? 'Modify details for this career timeline entry.' : 'Fill in the information to add a new timeline entry.'}</p>
          </div>
          <button className="btn-secondary" onClick={handleCancel}>Cancel</button>
        </div>

        <form onSubmit={handleSaveSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Company Name *</label>
              <input
                type="text"
                className="form-input"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. TechNova"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Job Role / Title *</label>
              <input
                type="text"
                className="form-input"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                placeholder="e.g. Senior Software Engineer"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'end' }}>
            <div className="form-group">
              <label className="form-label">Start Date *</label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <select
                  className="form-input"
                  value={startMonth}
                  onChange={(e) => setStartMonth(e.target.value)}
                  style={{ flex: 1, backgroundColor: 'rgba(10, 7, 18, 0.3)', border: '1px solid var(--border-glass)', color: 'var(--text-main)' }}
                  required
                >
                  <option value="" disabled style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>Month</option>
                  {monthsList.map(m => (
                    <option key={m.value} value={m.value} style={{ backgroundColor: 'var(--bg-secondary)' }}>{m.label}</option>
                  ))}
                </select>
                <select
                  className="form-input"
                  value={startYear}
                  onChange={(e) => setStartYear(e.target.value)}
                  style={{ flex: 1, backgroundColor: 'rgba(10, 7, 18, 0.3)', border: '1px solid var(--border-glass)', color: 'var(--text-main)' }}
                  required
                >
                  <option value="" disabled style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>Year</option>
                  {yearsList.map(y => (
                    <option key={y} value={y} style={{ backgroundColor: 'var(--bg-secondary)' }}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>End Date</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  <input
                    type="checkbox"
                    checked={currentlyWorking}
                    onChange={(e) => {
                      setCurrentlyWorking(e.target.checked);
                      if (e.target.checked) {
                        setEndMonth("");
                        setEndYear("");
                      }
                    }}
                  />
                  <span>Currently Working Here</span>
                </label>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <select
                  className="form-input"
                  value={endMonth}
                  onChange={(e) => setEndMonth(e.target.value)}
                  disabled={currentlyWorking}
                  style={{ flex: 1, backgroundColor: 'rgba(10, 7, 18, 0.3)', border: '1px solid var(--border-glass)', color: 'var(--text-main)' }}
                  required={!currentlyWorking}
                >
                  <option value="" disabled style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>Month</option>
                  {monthsList.map(m => (
                    <option key={m.value} value={m.value} style={{ backgroundColor: 'var(--bg-secondary)' }}>{m.label}</option>
                  ))}
                </select>
                <select
                  className="form-input"
                  value={endYear}
                  onChange={(e) => setEndYear(e.target.value)}
                  disabled={currentlyWorking}
                  style={{ flex: 1, backgroundColor: 'rgba(10, 7, 18, 0.3)', border: '1px solid var(--border-glass)', color: 'var(--text-main)' }}
                  required={!currentlyWorking}
                >
                  <option value="" disabled style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>Year</option>
                  {yearsList.map(y => (
                    <option key={y} value={y} style={{ backgroundColor: 'var(--bg-secondary)' }}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Brief Description of the Job *</label>
            <textarea
              className="form-input"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Describe your core responsibilities and achievements..."
              style={{ minHeight: '120px', resize: 'vertical' }}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Technical Stacks</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <input
                type="text"
                className="form-input"
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                placeholder="e.g. React, Node.js, Python (Press Enter to add)"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddTech(e);
                  }
                }}
              />
              <button type="button" className="btn-secondary" onClick={handleAddTech} style={{ padding: '0.75rem 1.25rem' }}>Add</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {techStacks.map((tech, idx) => (
                <span key={idx} className="badge badge-purple" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.65rem', borderRadius: '6px' }}>
                  {tech}
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(tech)}
                    style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', padding: 0 }}
                  >
                    ×
                  </button>
                </span>
              ))}
              {techStacks.length === 0 && <span style={{ fontSize: '0.85rem', color: 'var(--text-dark)' }}>No tech stacks added yet.</span>}
            </div>
          </div>

          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Description of Projects</label>
              <button type="button" className="btn-secondary" onClick={handleAddProjectDesc} style={{ fontSize: '0.8rem', padding: '0.25rem 0.65rem' }}>
                + Add Project Description
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {projectDescriptions.map((desc, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="form-input"
                    value={desc}
                    onChange={(e) => handleProjectDescChange(idx, e.target.value)}
                    placeholder="Describe a project, task, or deliverable during this role..."
                  />
                  {projectDescriptions.length > 1 && (
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => handleRemoveProjectDesc(idx)}
                      style={{ padding: '0.75rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
              {projectDescriptions.length === 0 && <span style={{ fontSize: '0.85rem', color: 'var(--text-dark)' }}>No projects listed. Click add to list one.</span>}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', borderTop: '1px solid var(--border-glass)', paddingTop: '1.5rem' }}>
            <button type="submit" className="btn-primary">
              <Save size={16} />
              <span>Save & Publish</span>
            </button>
            <button type="button" className="btn-secondary" onClick={() => handleSaveAction(true)}>
              <span>Save as Draft</span>
            </button>
            <button type="button" className="btn-secondary" onClick={handleCancel} style={{ marginLeft: 'auto' }}>
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
            <Briefcase className="card-icon-container" style={{ width: '36px', height: '36px', padding: '6px' }} />
            Work Experience
          </h1>
          <p className="page-subtitle">Configure your career timeline details shown in the portfolio.</p>
        </div>
        <button className="btn-primary" onClick={handleAddNew}>
          <Plus size={16} />
          <span>Add Experience</span>
        </button>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Role / Title</th>
              <th>Company</th>
              <th>Period</th>
              <th>Tech Stacks</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {experiences.map((exp) => (
              <tr key={exp.id}>
                <td style={{ fontWeight: '600' }}>{exp.job_role}</td>
                <td>{exp.company_name}</td>
                <td>
                  <span className="badge badge-purple">{formatPeriod(exp)}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', maxWidth: '300px' }}>
                    {exp.technical_stacks?.slice(0, 3).map((stack, idx) => (
                      <span key={idx} className="badge badge-teal" style={{ fontSize: '0.7rem' }}>{stack}</span>
                    ))}
                    {exp.technical_stacks?.length > 3 && <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>+{exp.technical_stacks.length - 3}</span>}
                  </div>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button className="btn-secondary" style={{ padding: '0.4rem' }} onClick={() => handleEdit(exp)}>
                      <Edit2 size={14} />
                    </button>
                    <button className="btn-secondary" style={{ padding: '0.4rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }} onClick={() => handleDelete(exp.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {experiences.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  No experiences found. Click Add Experience to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
