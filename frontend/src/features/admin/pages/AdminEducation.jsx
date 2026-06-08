import { useState, useEffect } from 'react';
import { GraduationCap, Plus, Edit2, Trash2, Save } from 'lucide-react';

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
const yearsList = Array.from({ length: 40 }, (_, i) => String(currentYear + 5 - i));

export default function AdminEducation() {
  const [educationList, setEducationList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form states
  const [courseName, setCourseName] = useState("");
  const [universityName, setUniversityName] = useState("");
  const [uniState, setUniState] = useState("");
  const [uniCountry, setUniCountry] = useState("");
  const [startMonth, setStartMonth] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [endYear, setEndYear] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [currentlyStudying, setCurrentlyStudying] = useState(false);

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/education`);
      const result = await res.json();
      if (result.success) {
        setEducationList(result.data || []);
      }
    } catch (err) {
      console.error("Error fetching education records:", err);
    }
  };

  const handleAddNew = () => {
    setEditingId(null);
    setCourseName("");
    setUniversityName("");
    setUniState("");
    setUniCountry("");
    setStartMonth("");
    setStartYear("");
    setEndMonth("");
    setEndYear("");
    setCgpa("");
    setCurrentlyStudying(false);
    setShowForm(true);
  };

  const handleEdit = (edu) => {
    setEditingId(edu.id);
    setCourseName(edu.course_name || "");
    setUniversityName(edu.university_name || "");
    setUniState(edu.uni_state || "");
    setUniCountry(edu.uni_country || "");

    if (edu.start_date) {
      const d = new Date(edu.start_date);
      setStartMonth(String(d.getUTCMonth() + 1).padStart(2, '0'));
      setStartYear(String(d.getUTCFullYear()));
    } else {
      setStartMonth("");
      setStartYear("");
    }

    if (edu.end_date) {
      const d = new Date(edu.end_date);
      setEndMonth(String(d.getUTCMonth() + 1).padStart(2, '0'));
      setEndYear(String(d.getUTCFullYear()));
    } else {
      setEndMonth("");
      setEndYear("");
    }

    setCgpa(edu.cgpa !== null && edu.cgpa !== undefined ? edu.cgpa.toFixed(2) : "");
    setCurrentlyStudying(edu.currently_studying || false);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this education record?")) {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/education/${id}`, {
          method: 'DELETE'
        });
        const result = await res.json();
        if (result.success) {
          fetchEducation();
        } else {
          alert("Error: " + result.message);
        }
      } catch (err) {
        console.error("Error deleting education record:", err);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const composeISO = (month, year) => {
    if (!month || !year) return null;
    return new Date(Date.UTC(parseInt(year), parseInt(month), 1)).toISOString();
  };

  const formatPeriod = (edu) => {
    if (!edu.start_date) return "";
    const start = new Date(edu.start_date).toLocaleString('default', { month: 'short', year: 'numeric', timeZone: 'UTC' });
    const end = edu.currently_studying ? 'Present' : (edu.end_date ? new Date(edu.end_date).toLocaleString('default', { month: 'short', year: 'numeric', timeZone: 'UTC' }) : '');
    return `${start} - ${end}`;
  };

  const handleSaveAction = async (isDraft = false) => {
    if (!courseName || !universityName || !uniState || !uniCountry || !startMonth || !startYear) {
      alert("Please fill in all required fields (marked with *).");
      return;
    }

    const payload = {
      course_name: courseName,
      university_name: universityName,
      uni_state: uniState,
      uni_country: uniCountry,
      start_date: composeISO(startMonth, startYear),
      end_date: currentlyStudying ? null : composeISO(endMonth, endYear),
      cgpa: cgpa ? parseFloat(parseFloat(cgpa).toFixed(2)) : null,
      currently_studying: currentlyStudying
    };

    try {
      const url = editingId
        ? `${API_BASE_URL}/admin/education/${editingId}`
        : `${API_BASE_URL}/admin/education`;

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
        fetchEducation();
        if (isDraft) {
          alert("Education details saved successfully as Draft.");
        }
      } else {
        alert("Failed to save: " + result.message);
      }
    } catch (err) {
      console.error("Error saving education record:", err);
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
              <GraduationCap className="card-icon-container" style={{ width: '36px', height: '36px', padding: '6px' }} />
              {editingId ? 'Edit Academic Background' : 'Add Academic Background'}
            </h1>
            <p className="page-subtitle">{editingId ? 'Modify academic degree or studies details.' : 'Provide academic milestones and degree information.'}</p>
          </div>
          <button className="btn-secondary" onClick={handleCancel}>Cancel</button>
        </div>

        <form onSubmit={handleSaveSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Course / Degree Major *</label>
              <input
                type="text"
                className="form-input"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="e.g. M.S. in Computer Science"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">University Name *</label>
              <input
                type="text"
                className="form-input"
                value={universityName}
                onChange={(e) => setUniversityName(e.target.value)}
                placeholder="e.g. Apex Technical University"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">State *</label>
              <input
                type="text"
                className="form-input"
                value={uniState}
                onChange={(e) => setUniState(e.target.value)}
                placeholder="e.g. Selangor"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Country *</label>
              <input
                type="text"
                className="form-input"
                value={uniCountry}
                onChange={(e) => setUniCountry(e.target.value)}
                placeholder="e.g. Malaysia"
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
                    checked={currentlyStudying}
                    onChange={(e) => {
                      setCurrentlyStudying(e.target.checked);
                      if (e.target.checked) {
                        setEndMonth("");
                        setEndYear("");
                      }
                    }}
                  />
                  <span>Currently Studying Here</span>
                </label>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <select
                  className="form-input"
                  value={endMonth}
                  onChange={(e) => setEndMonth(e.target.value)}
                  disabled={currentlyStudying}
                  style={{ flex: 1, backgroundColor: 'rgba(10, 7, 18, 0.3)', border: '1px solid var(--border-glass)', color: 'var(--text-main)' }}
                  required={!currentlyStudying}
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
                  disabled={currentlyStudying}
                  style={{ flex: 1, backgroundColor: 'rgba(10, 7, 18, 0.3)', border: '1px solid var(--border-glass)', color: 'var(--text-main)' }}
                  required={!currentlyStudying}
                >
                  <option value="" disabled style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>Year</option>
                  {yearsList.map(y => (
                    <option key={y} value={y} style={{ backgroundColor: 'var(--bg-secondary)' }}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">CGPA (Float e.g. 3.75)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="4"
                className="form-input"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                placeholder="e.g. 3.85"
              />
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
            <GraduationCap className="card-icon-container" style={{ width: '36px', height: '36px', padding: '6px' }} />
            Education
          </h1>
          <p className="page-subtitle">Manage your educational background and milestones details.</p>
        </div>
        <button className="btn-primary" onClick={handleAddNew}>
          <Plus size={16} />
          <span>Add Education</span>
        </button>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Degree / Major</th>
              <th>Institution</th>
              <th>Period</th>
              <th>CGPA / Grade</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {educationList.map((edu) => (
              <tr key={edu.id}>
                <td style={{ fontWeight: '600' }}>{edu.course_name}</td>
                <td>{edu.university_name} ({edu.uni_state}, {edu.uni_country})</td>
                <td>
                  <span className="badge badge-purple">{formatPeriod(edu)}</span>
                </td>
                <td>
                  <span className="badge badge-teal">{edu.cgpa !== null && edu.cgpa !== undefined ? `${edu.cgpa.toFixed(2)} / 4.0` : 'N/A'}</span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button className="btn-secondary" style={{ padding: '0.4rem' }} onClick={() => handleEdit(edu)}>
                      <Edit2 size={14} />
                    </button>
                    <button className="btn-secondary" style={{ padding: '0.4rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }} onClick={() => handleDelete(edu.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {educationList.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  No education entries found. Click Add Education to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
