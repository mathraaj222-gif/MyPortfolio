"""
document_metadata.py
Manages document metadata persistence in Supabase's ai_documents table.

This is the bridge between:
  - ChromaDB (vector chunks for AI search)
  - Supabase (metadata for admin panel visibility)

Every document has:
  - doc_id      : short UUID prefix (8 chars), primary key for both stores
  - filename    : original uploaded filename
  - entity_type : 'project' | 'experience' | 'education' | 'skills' | 'certificates'
  - entity_id   : UUID of the related Projects/Experiance/Education/Skills row
  - entity_title: human-readable name of the related entity
  - chunks_count: how many vector chunks were indexed
  - file_size_kb: file size in KB
  - uploaded_at : timestamp
"""

from typing import List, Dict, Any, Optional
from app.services.rag_engine import get_supabase_client

TABLE = "ai_documents"


def save_document_metadata(
    doc_id: str,
    filename: str,
    entity_type: str,
    entity_id: str,
    entity_title: str,
    chunks_count: int,
    file_size_kb: float = 0.0
) -> bool:
    """
    Inserts a new document metadata record into Supabase.
    Called immediately after ChromaDB indexing succeeds.
    Returns True on success, False on failure (non-fatal — ChromaDB still has the chunks).
    """
    try:
        client = get_supabase_client()
        payload = {
            "doc_id": doc_id,
            "filename": filename,
            "entity_type": entity_type,
            "entity_id": entity_id,
            "entity_title": entity_title,
            "chunks_count": chunks_count,
            "file_size_kb": float(file_size_kb)
        }
        client.table(TABLE).insert(payload).execute()
        print(f"[DocMetadata] Saved metadata for doc_id={doc_id} ({filename})")
        return True
    except Exception as e:
        print(f"[DocMetadata] WARNING: Could not save metadata to Supabase: {e}")
        # Non-fatal: ChromaDB still has the vectors, AI guide still works
        return False


def list_document_metadata(entity_type: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Lists all document metadata records, optionally filtered by entity_type.
    Used by the admin panel to show all uploaded documents.
    """
    try:
        client = get_supabase_client()
        query = client.table(TABLE).select("*").order("uploaded_at", desc=True)
        if entity_type:
            query = query.eq("entity_type", entity_type)
        result = query.execute()
        return result.data or []
    except Exception as e:
        print(f"[DocMetadata] WARNING: Could not list metadata from Supabase: {e}")
        return []


def list_documents_for_entity(entity_type: str, entity_id: str) -> List[Dict[str, Any]]:
    """
    Lists all documents uploaded for a specific entity (e.g. a specific project).
    Used in admin forms to show what documents are attached to the current item being edited.
    """
    try:
        client = get_supabase_client()
        result = (
            client.table(TABLE)
            .select("*")
            .eq("entity_type", entity_type)
            .eq("entity_id", entity_id)
            .order("uploaded_at", desc=True)
            .execute()
        )
        return result.data or []
    except Exception as e:
        print(f"[DocMetadata] WARNING: Could not list entity documents from Supabase: {e}")
        return []


def delete_document_metadata(doc_id: str) -> bool:
    """
    Deletes the document metadata record from Supabase.
    Should be called alongside delete_document_by_id() in vector_store.py.
    """
    try:
        client = get_supabase_client()
        client.table(TABLE).delete().eq("doc_id", doc_id).execute()
        print(f"[DocMetadata] Deleted metadata for doc_id={doc_id}")
        return True
    except Exception as e:
        print(f"[DocMetadata] WARNING: Could not delete metadata from Supabase: {e}")
        return False
