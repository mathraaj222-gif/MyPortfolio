import { useState, useEffect } from 'react';
import {
  User,
  Image,
  Upload,
  Linkedin,
  Github,
  Mail,
  Save,
  FileText
} from 'lucide-react';

const Whatsapp = ({ size = 16, style, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ ...style }}
    {...props}
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const API_BASE_URL = 'http://localhost:5000/api/v1';

export default function AdminHome() {
  const [aboutText, setAboutText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [email, setEmail] = useState("");
  const [contact_no, setContactNumber] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchHomepage = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/homepage`);
        const result = await response.json();
        if (result.success && result.data) {
          setAboutText(result.data.bio || "");
          setImageUrl(result.data.image_url || "");
          setLinkedin(result.data.linkedin_url || "");
          setGithub(result.data.github_url || "");
          setEmail(result.data.email_address || "");
          setContactNumber(result.data.contact_no || "");
          setResumeUrl(result.data.resume_url || "");
        }
      } catch (err) {
        console.error("Failed to fetch homepage data", err);
      }
    };
    fetchHomepage();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setResumeUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/homepage`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bio: aboutText,
          image_url: imageUrl,
          linkedin_url: linkedin,
          github_url: github,
          email_address: email,
          contact_no: contact_no,
          resume_url: resumeUrl,
        }),
      });
      const result = await response.json();
      if (result.success) {
        setIsSaved(true);
        setTimeout(() => {
          setIsSaved(false);
        }, 3000);
      } else {
        alert("Failed to save changes: " + result.message);
      }
    } catch (err) {
      console.error("Failed to save homepage data", err);
      alert("Failed to connect to backend server.");
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', flexGrow: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="page-title-area">
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <User className="card-icon-container" style={{ width: '36px', height: '36px', padding: '6px' }} />
            About Me
          </h1>
          <p className="page-subtitle">Manage your public profile description, avatar, and social links.</p>
        </div>
        
        <button className="btn-primary" onClick={handleSave} style={{ gap: '0.5rem', alignSelf: 'center' }}>
          <Save size={16} />
          <span>{isSaved ? 'Saved!' : 'Save Changes'}</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
        {/* Left Column: About Me Bio */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem' }}>
            Bio Details
          </h2>
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '0.5rem' }}>
            <label className="form-label">Professional Biography</label>
            <textarea
              className="form-input"
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              placeholder="Tell the world about yourself..."
              style={{
                minHeight: '240px',
                flexGrow: 1,
                resize: 'vertical',
                lineHeight: '1.6',
                fontSize: '0.95rem',
                backgroundColor: 'rgba(10, 7, 18, 0.3)',
                border: '1px solid var(--border-glass)'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span>Use standard markdown formatting for links or rich text.</span>
              <span>{aboutText.length} characters</span>
            </div>
          </div>
        </div>

        {/* Right Column: Image and Social Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Profile Image Box */}
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem' }}>
              Profile Photo
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              {/* Image Preview Container */}
              <div style={{
                position: 'relative',
                width: '120px',
                height: '120px',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '2px dashed var(--border-glass)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(10, 7, 18, 0.4)'
              }}>
                {imageUrl ? (
                  <img src={imageUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <Image size={32} style={{ color: 'var(--text-muted)' }} />
                )}
              </div>

              {/* Upload actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flexGrow: 1 }}>
                <div>
                  <label className="btn-secondary" style={{ display: 'inline-flex', cursor: 'pointer', fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                    <Upload size={14} />
                    <span>Upload Image</span>
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
                  </label>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <span className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Or Image URL</span>
                  <input
                    type="text"
                    className="form-input"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
                    style={{ fontSize: '0.8rem', padding: '0.5rem 0.75rem' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Resume Upload Box */}
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem' }}>
              Resume / CV
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <label className="btn-secondary" style={{ display: 'inline-flex', cursor: 'pointer', fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                  <Upload size={14} />
                  <span>Upload Resume (PDF)</span>
                  <input type="file" accept="application/pdf" style={{ display: 'none' }} onChange={handleResumeChange} />
                </label>
                {resumeUrl ? (
                  <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>
                    Resume Uploaded ✔
                  </span>
                ) : (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    No resume uploaded
                  </span>
                )}
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <span className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Or Resume URL</span>
                <input
                  type="text"
                  className="form-input"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  placeholder="https://..."
                  style={{ fontSize: '0.8rem', padding: '0.5rem 0.75rem' }}
                />
              </div>
            </div>
          </div>

          {/* Social Links Box */}
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem' }}>
              Contact & Social Links
            </h2>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Linkedin size={16} style={{ color: '#0077b5' }} />
                LinkedIn URL
              </label>
              <input
                type="text"
                className="form-input"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/..."
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Github size={16} style={{ color: '#f3f4f6' }} />
                GitHub URL
              </label>
              <input
                type="text"
                className="form-input"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/..."
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Whatsapp size={16} style={{ color: '#f3f4f6' }} />
                Contact Number
              </label>
              <input
                type="text"
                className="form-input"
                value={contact_no}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="+60 1234567890"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} style={{ color: '#10b981' }} />
                Email Address
              </label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
