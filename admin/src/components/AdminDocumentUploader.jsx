import React, { useRef } from 'react';
import { FileText, UploadCloud, X, Sparkles } from 'lucide-react';

/**
 * AdminDocumentUploader
 * Reusable optional document upload component for Projects, Experience, Education, and Skills.
 * Allows attaching technical specs, case studies, or write-ups to power the AI Guide.
 */
export default function AdminDocumentUploader({
  file,
  onFileChange,
  label = "Supporting Technical Document for AI Guide",
  helperText = "Optional: Upload a PDF, Markdown, or text file (e.g. architecture spec, case study, project notes) to provide deep insights for your AI Guide.",
  disabled = false
}) {
  const inputRef = useRef(null);

  const handleFileSelect = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      // 20MB limit check
      if (selected.size > 20 * 1024 * 1024) {
        alert("File size exceeds 20MB limit.");
        return;
      }
      onFileChange(selected);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onFileChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div style={{ marginTop: '1.25rem', marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main, #f3f4f6)' }}>
          <Sparkles size={15} color="#8b5cf6" />
          <span>{label}</span>
          <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#9ca3af', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '4px' }}>
            Optional
          </span>
        </label>
      </div>

      <p style={{ fontSize: '0.78rem', color: '#9ca3af', marginBottom: '0.6rem', lineHeight: 1.4 }}>
        {helperText}
      </p>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.md,.markdown,.txt,.docx"
        onChange={handleFileSelect}
        disabled={disabled}
        style={{ display: 'none' }}
        id="admin-doc-input"
      />

      {file ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.35)',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(139, 92, 246, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#c084fc',
                flexShrink: 0
              }}
            >
              <FileText size={18} />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {file.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                {formatFileSize(file.size)} • Ready to index
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled}
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              padding: '6px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
            title="Remove attached file"
          >
            <X size={15} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => !disabled && inputRef.current?.click()}
          style={{
            border: '1px dashed rgba(139, 92, 246, 0.3)',
            borderRadius: '10px',
            padding: '1.25rem 1rem',
            textAlign: 'center',
            cursor: disabled ? 'not-allowed' : 'pointer',
            background: 'rgba(18, 14, 36, 0.3)',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <UploadCloud size={24} color="#a855f7" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0' }}>
            Click to attach an optional document (.pdf, .md, .txt)
          </span>
          <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>
            Maximum file size: 20MB
          </span>
        </div>
      )}
    </div>
  );
}
