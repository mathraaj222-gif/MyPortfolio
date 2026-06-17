import { useState, useEffect } from 'react';
import { Award, Plus, Edit2, Trash2, Save } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

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

export default function AdminCertificates() {
  const [certs, setCerts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form states
  const [name, setName] = useState("");
  const [bodies, setBodies] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [receivedMonth, setReceivedMonth] = useState("");
  const [receivedYear, setReceivedYear] = useState("");
  const [credentialId, setCredentialId] = useState("");

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/certificates`);
      const result = await res.json();
      if (result.success) {
        setCerts(result.data || []);
      }
    } catch (err) {
      console.error("Error fetching certificates:", err);
    }
  };

  const handleAddNew = () => {
    setEditingId(null);
    setName("");
    setBodies("");
    setImgUrl("");
    setReceivedMonth("");
    setReceivedYear("");
    setCredentialId("");
    setShowForm(true);
  };

  const handleEdit = (cert) => {
    setEditingId(cert.id);
    setName(cert.certificate_name || "");
    setBodies(cert.certificate_bodies || "");
    setImgUrl(cert.certificate_img_url || "");
    
    if (cert.date_received) {
      const d = new Date(cert.date_received);
      setReceivedMonth(String(d.getUTCMonth() + 1).padStart(2, '0'));
      setReceivedYear(String(d.getUTCFullYear()));
    } else {
      setReceivedMonth("");
      setReceivedYear("");
    }
    
    setCredentialId(cert.credential_id || "");
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this certificate?")) {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/certificates/${id}`, {
          method: 'DELETE'
        });
        const result = await res.json();
        if (result.success) {
          fetchCertificates();
        } else {
          alert("Error: " + result.message);
        }
      } catch (err) {
        console.error("Error deleting certificate:", err);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const composeISO = (month, year) => {
    if (!month || !year) return null;
    return new Date(Date.UTC(parseInt(year), parseInt(month) - 1, 1)).toISOString();
  };

  const formatPeriod = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString('default', { month: 'short', year: 'numeric', timeZone: 'UTC' });
  };

  const handleSaveAction = async (isDraft = false) => {
    if (!name || !bodies || !receivedMonth || !receivedYear || !credentialId) {
      alert("Please fill in all required fields (marked with *).");
      return;
    }

    const payload = {
      certificate_name: name,
      certificate_bodies: bodies,
      certificate_img_url: imgUrl || null,
      date_received: composeISO(receivedMonth, receivedYear),
      credential_id: credentialId
    };

    try {
      const url = editingId 
        ? `${API_BASE_URL}/admin/certificates/${editingId}` 
        : `${API_BASE_URL}/admin/certificates`;
      
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
        fetchCertificates();
        if (isDraft) {
          alert("Certificate details saved successfully as Draft.");
        }
      } else {
        alert("Failed to save: " + result.message);
      }
    } catch (err) {
      console.error("Error saving certificate:", err);
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
              <Award className="card-icon-container" style={{ width: '36px', height: '36px', padding: '6px' }} />
              {editingId ? 'Edit Certificate Details' : 'Add Certificate'}
            </h1>
            <p className="page-subtitle">{editingId ? 'Modify professional certification or course license.' : 'Register new professional certification to highlight on your resume.'}</p>
          </div>
          <button className="btn-secondary" onClick={handleCancel}>Cancel</button>
        </div>

        <form onSubmit={handleSaveSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Certificate Name *</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. AWS Certified Solutions Architect"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Certificate Body / Issuer *</label>
              <input
                type="text"
                className="form-input"
                value={bodies}
                onChange={(e) => setBodies(e.target.value)}
                placeholder="e.g. Amazon Web Services"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'end' }}>
            <div className="form-group">
              <label className="form-label">Date Received *</label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <select
                  className="form-input"
                  value={receivedMonth}
                  onChange={(e) => setReceivedMonth(e.target.value)}
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
                  value={receivedYear}
                  onChange={(e) => setReceivedYear(e.target.value)}
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

            <div className="form-group">
              <label className="form-label">Credential ID *</label>
              <input
                type="text"
                className="form-input"
                value={credentialId}
                onChange={(e) => setCredentialId(e.target.value)}
                placeholder="e.g. AWS-ASA-994"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Certification Image URL</label>
            <input
              type="url"
              className="form-input"
              value={imgUrl}
              onChange={(e) => setImgUrl(e.target.value)}
              placeholder="https://example.com/certificate.png"
            />
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
            <Award className="card-icon-container" style={{ width: '36px', height: '36px', padding: '6px' }} />
            Certificates & Licenses
          </h1>
          <p className="page-subtitle">Manage professional credentials and courses to highlight in the resume section.</p>
        </div>
        <button className="btn-primary" onClick={handleAddNew}>
          <Plus size={16} />
          <span>Add Certificate</span>
        </button>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Certificate Name</th>
              <th>Issuer</th>
              <th>Date Issued</th>
              <th>Credential ID</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {certs.map((cert) => (
              <tr key={cert.id}>
                <td style={{ fontWeight: '600' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {cert.certificate_img_url && (
                      <img src={cert.certificate_img_url} alt={cert.certificate_name} style={{ width: '28px', height: '28px', borderRadius: '4px', objectFit: 'cover' }} />
                    )}
                    <span>{cert.certificate_name}</span>
                  </div>
                </td>
                <td>{cert.certificate_bodies}</td>
                <td>
                  <span className="badge badge-purple">{formatPeriod(cert.date_received)}</span>
                </td>
                <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                  {cert.credential_id}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button className="btn-secondary" style={{ padding: '0.4rem' }} onClick={() => handleEdit(cert)}>
                      <Edit2 size={14} />
                    </button>
                    <button className="btn-secondary" style={{ padding: '0.4rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }} onClick={() => handleDelete(cert.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {certs.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  No certificates found. Click Add Certificate to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
