/**
 * aiApi.js
 * Client service to communicate with the Python AI Engine (ai-backend, port 8000).
 * Handles document uploads and metadata operations for Projects, Experience, Education, Skills.
 *
 * Document storage architecture:
 *   - ChromaDB (ai-backend local): stores raw text chunks + vector embeddings for AI search
 *   - Supabase ai_documents table: stores lightweight metadata for admin panel visibility
 */

const RAW_AI_URL = import.meta.env.VITE_AI_API_URL || 'http://localhost:8000/api/v1';
const AI_BASE_URL = RAW_AI_URL.replace(/\/+$/, '');

/**
 * Upload a document and index it into ChromaDB.
 * Also saves metadata to Supabase via ai-backend for admin visibility.
 */
export async function uploadEntityDocument(file, entityType = 'project', entityId = '', entityTitle = '') {
  if (!file) return null;

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('entity_type', entityType);
    formData.append('entity_id', String(entityId || ''));
    formData.append('entity_title', entityTitle || file.name);

    const res = await fetch(`${AI_BASE_URL}/documents/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('[AI API] Document upload warning:', err);
    return {
      success: false,
      message: err.message || 'Failed to upload document to AI Engine'
    };
  }
}

/**
 * List all documents from Supabase metadata table.
 * Optionally filter by entity_type and/or entity_id.
 */
export async function listEntityDocuments(entityType = null, entityId = null) {
  try {
    const params = new URLSearchParams();
    if (entityType) params.append('entity_type', entityType);
    if (entityId) params.append('entity_id', entityId);

    const url = `${AI_BASE_URL}/documents${params.toString() ? '?' + params.toString() : ''}`;
    const res = await fetch(url);
    return await res.json();
  } catch (err) {
    console.warn('[AI API] Failed to list documents:', err);
    return { success: false, data: [] };
  }
}

/**
 * Delete a document from both ChromaDB and Supabase.
 */
export async function deleteEntityDocument(docId) {
  try {
    const res = await fetch(`${AI_BASE_URL}/documents/${docId}`, {
      method: 'DELETE'
    });
    return await res.json();
  } catch (err) {
    console.warn('[AI API] Failed to delete document:', err);
    return { success: false, message: err.message };
  }
}
