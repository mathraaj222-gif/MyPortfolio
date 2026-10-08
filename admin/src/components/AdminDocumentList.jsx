import React, { useState, useEffect } from 'react';
import { FileText, Trash2, RefreshCw, HardDrive } from 'lucide-react';
import { listEntityDocuments, deleteEntityDocument } from '../services/aiApi';

/**
 * AdminDocumentList
 * Shows the list of uploaded documents for a specific entity (project, experience, etc.)
 * Fetches from Supabase via the AI backend's metadata endpoint.
 * 
 * Props:
 *   entityType  - 'project' | 'experience' | 'education' | 'skills' | 'certificates'
 *   entityId    - The UUID of the specific entity (e.g. project id)
 *   refreshKey  - Increment this from parent to trigger a re-fetch after upload
 */
export default function AdminDocumentList({ entityType, entityId, refreshKey = 0 }) {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (!entityId) return;
    fetchDocs();
  }, [entityId, entityType, refreshKey]);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const res = await listEntityDocuments(entityType, entityId);
      setDocs(res.data || []);
    } catch (err) {
      console.warn('[AdminDocumentList] Fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (docId, filename) => {
    if (!confirm(`Remove document "${filename}" from AI knowledge base?`)) return;
    setDeleting(docId);
    try {
      await deleteEntityDocument(docId);
      setDocs(prev => prev.filter(d => d.doc_id !== docId));
    } catch (err) {
      alert('Failed to delete document: ' + err.message);
    } finally {
      setDeleting(null);
    }
  };

  const formatSize = (kb) => {
    if (!kb) return '';
    if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MB`;
    return `${kb.toFixed(0)} KB`;
  };

  const formatDate = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('en-MY', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  if (!entityId) return null;

  return (
    <div style={{ marginTop: '0.75rem' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '0.5rem'
      }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <HardDrive size={13} />
          AI Knowledge Base ({loading ? '...' : docs.length} document{docs.length !== 1 ? 's' : ''})
        </span>
        <button
          onClick={fetchDocs}
          style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: '#6b7280', padding: '2px', display: 'flex', alignItems: 'center'
          }}
          title="Refresh document list"
        >
          <RefreshCw size={13} className={loading ? 'spinning' : ''} />
        </button>
      </div>

      {loading && docs.length === 0 && (
        <div style={{ fontSize: '0.78rem', color: '#6b7280', padding: '0.5rem 0' }}>
          Loading documents...
        </div>
      )}

      {!loading && docs.length === 0 && (
        <div style={{
          fontSize: '0.78rem', color: '#6b7280', padding: '0.6rem 0.8rem',
          background: 'rgba(255,255,255,0.03)', borderRadius: '8px',
          border: '1px dashed rgba(255,255,255,0.08)'
        }}>
          No documents indexed for this {entityType} yet.
        </div>
      )}

      {docs.map(doc => (
        <div
          key={doc.doc_id}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'rgba(139, 92, 246, 0.07)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '8px', padding: '0.6rem 0.85rem',
            marginBottom: '0.4rem', gap: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden', flex: 1 }}>
            <FileText size={15} color="#c084fc" style={{ flexShrink: 0 }} />
            <div style={{ overflow: 'hidden' }}>
              <div style={{
                fontSize: '0.83rem', fontWeight: 600, color: '#e2e8f0',
                textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'
              }}>
                {doc.filename}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>
                {doc.chunks_count} chunk{doc.chunks_count !== 1 ? 's' : ''} indexed
                {doc.file_size_kb ? ` • ${formatSize(doc.file_size_kb)}` : ''}
                {doc.uploaded_at ? ` • ${formatDate(doc.uploaded_at)}` : ''}
              </div>
            </div>
          </div>

          <button
            onClick={() => handleDelete(doc.doc_id, doc.filename)}
            disabled={deleting === doc.doc_id}
            style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#f87171', padding: '5px 7px', borderRadius: '6px',
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              flexShrink: 0, transition: 'all 0.2s ease',
              opacity: deleting === doc.doc_id ? 0.5 : 1
            }}
            title="Remove document from AI knowledge base"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}
