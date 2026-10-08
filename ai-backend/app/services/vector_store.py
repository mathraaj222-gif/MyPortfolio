"""
vector_store.py
Persistent ChromaDB Vector Store integration for portfolio documents.
Handles chunk indexing, similarity search with cosine distance, and collection management.
"""

import os
from typing import List, Dict, Any, Optional
from app.core.config import settings

_chroma_client = None
_collection = None
COLLECTION_NAME = "portfolio_documents"

def get_chroma_client():
    global _chroma_client
    if _chroma_client is None:
        import chromadb
        persist_dir = settings.CHROMA_PERSIST_DIRECTORY
        os.makedirs(persist_dir, exist_ok=True)
        _chroma_client = chromadb.PersistentClient(path=persist_dir)
    return _chroma_client

def get_document_collection():
    global _collection
    if _collection is None:
        client = get_chroma_client()
        # Chroma default embedding function (fast and local)
        _collection = client.get_or_create_collection(
            name=COLLECTION_NAME,
            metadata={"hnsw:space": "cosine"}
        )
    return _collection

def add_document_chunks(chunks: List[Dict[str, Any]]) -> int:
    """
    Ingests document chunks into ChromaDB.
    Each chunk dict must have:
      - id: unique string
      - text: text content
      - metadata: dict with entity_type, entity_id, filename, chunk_index, etc.
    """
    if not chunks:
        return 0

    collection = get_document_collection()

    ids = [c["id"] for c in chunks]
    documents = [c["text"] for c in chunks]
    metadatas = [c.get("metadata", {}) for c in chunks]

    # Clean None values in metadata for ChromaDB compatibility
    cleaned_metadatas = []
    for m in metadatas:
        clean = {}
        for k, v in m.items():
            if v is not None:
                clean[k] = str(v) if not isinstance(v, (str, int, float, bool)) else v
            else:
                clean[k] = ""
        cleaned_metadatas.append(clean)

    collection.upsert(
        ids=ids,
        documents=documents,
        metadatas=cleaned_metadatas
    )
    return len(chunks)

def search_similar_chunks(
    query: str,
    top_k: int = 4,
    where_filter: Optional[Dict[str, Any]] = None
) -> List[Dict[str, Any]]:
    """
    Queries the vector store for semantic matches.
    Returns list of dicts with text, metadata, and distance.
    """
    collection = get_document_collection()
    
    # If collection is empty, return empty list
    if collection.count() == 0:
        return []

    try:
        kwargs = {
            "query_texts": [query],
            "n_results": min(top_k, collection.count())
        }
        if where_filter:
            kwargs["where"] = where_filter

        results = collection.query(**kwargs)

        matched_chunks = []
        if results and "documents" in results and results["documents"]:
            docs = results["documents"][0]
            metas = results["metadatas"][0] if "metadatas" in results else [{}] * len(docs)
            distances = results["distances"][0] if "distances" in results else [0.0] * len(docs)
            ids = results["ids"][0] if "ids" in results else [""] * len(docs)

            for doc_id, doc_text, meta, dist in zip(ids, docs, metas, distances):
                matched_chunks.append({
                    "chunk_id": doc_id,
                    "text": doc_text,
                    "metadata": meta,
                    "similarity_score": round(1.0 - dist, 4) if dist is not None else 1.0
                })

        return matched_chunks
    except Exception as e:
        print(f"[VectorStore] Query error: {e}")
        return []

def list_indexed_documents() -> List[Dict[str, Any]]:
    """
    Returns high-level summary of all distinct documents in the vector store.
    """
    collection = get_document_collection()
    if collection.count() == 0:
        return []

    data = collection.get(include=["metadatas"])
    metadatas = data.get("metadatas", [])

    docs_map = {}
    for m in metadatas:
        doc_id = m.get("doc_id", "unknown")
        if doc_id not in docs_map:
            docs_map[doc_id] = {
                "doc_id": doc_id,
                "filename": m.get("filename", "Untitled"),
                "entity_type": m.get("entity_type", "general"),
                "entity_id": m.get("entity_id", ""),
                "entity_title": m.get("entity_title", ""),
                "total_chunks": 0,
                "uploaded_at": m.get("uploaded_at", "")
            }
        docs_map[doc_id]["total_chunks"] += 1

    return list(docs_map.values())

def delete_document_by_id(doc_id: str) -> bool:
    """
    Deletes all chunks belonging to a document.
    """
    try:
        collection = get_document_collection()
        collection.delete(where={"doc_id": doc_id})
        return True
    except Exception as e:
        print(f"[VectorStore] Delete error: {e}")
        return False
