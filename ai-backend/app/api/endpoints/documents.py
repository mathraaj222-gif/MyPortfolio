"""
documents.py
API endpoints for document ingestion, listing, and deletion.
Documents are stored in two places:
  - ChromaDB (local): raw text chunks + embeddings for vector similarity search
  - Supabase ai_documents table: lightweight metadata for admin panel visibility
"""

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional, List, Dict, Any
from app.services.document_loader import process_and_chunk_document
from app.services.vector_store import add_document_chunks, search_similar_chunks, delete_document_by_id
from app.services.document_metadata import (
    save_document_metadata,
    list_document_metadata,
    delete_document_metadata,
    list_documents_for_entity
)

router = APIRouter()


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    entity_type: str = Form("project"),
    entity_id: Optional[str] = Form(""),
    entity_title: Optional[str] = Form("")
):
    """
    Ingests an optional technical document (PDF, Markdown, TXT) associated with an entity.
    Indexes chunks into ChromaDB AND saves metadata to Supabase for admin visibility.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file selected")

    try:
        content = await file.read()
        if len(content) > 20 * 1024 * 1024:  # 20MB limit
            raise HTTPException(status_code=400, detail="File size exceeds 20MB limit")

        file_size_kb = round(len(content) / 1024, 2)

        doc_id, chunks = process_and_chunk_document(
            file_bytes=content,
            filename=file.filename,
            entity_type=entity_type,
            entity_id=entity_id or "",
            entity_title=entity_title or ""
        )

        # 1. Index chunks into ChromaDB (vector search)
        indexed_count = add_document_chunks(chunks)

        # 2. Save metadata to Supabase (admin panel visibility)
        save_document_metadata(
            doc_id=doc_id,
            filename=file.filename,
            entity_type=entity_type,
            entity_id=entity_id or "",
            entity_title=entity_title or file.filename,
            chunks_count=indexed_count,
            file_size_kb=file_size_kb
        )

        return {
            "success": True,
            "message": f"Successfully indexed {indexed_count} chunks for '{file.filename}'",
            "data": {
                "doc_id": doc_id,
                "filename": file.filename,
                "entity_type": entity_type,
                "entity_id": entity_id,
                "entity_title": entity_title,
                "chunks_indexed": indexed_count,
                "file_size_kb": file_size_kb
            }
        }
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        print(f"[Document API] Upload failed: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to process and index document: {str(e)}")


@router.get("")
async def get_documents(entity_type: Optional[str] = None, entity_id: Optional[str] = None):
    """
    Returns list of all documents from Supabase metadata table.
    Optionally filter by entity_type and/or entity_id.
    """
    try:
        if entity_id:
            docs = list_documents_for_entity(entity_type=entity_type or "", entity_id=entity_id)
        else:
            docs = list_document_metadata(entity_type=entity_type)
        return {
            "success": True,
            "data": docs
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{doc_id}")
async def delete_document(doc_id: str):
    """
    Deletes a document from both ChromaDB (chunks) and Supabase (metadata).
    """
    # Delete from vector store (ChromaDB)
    vector_ok = delete_document_by_id(doc_id)

    # Delete metadata from Supabase
    meta_ok = delete_document_metadata(doc_id)

    if not vector_ok and not meta_ok:
        raise HTTPException(status_code=500, detail="Failed to delete document from vector index and metadata store")

    return {
        "success": True,
        "message": f"Document {doc_id} successfully deleted from vector index and metadata store"
    }
