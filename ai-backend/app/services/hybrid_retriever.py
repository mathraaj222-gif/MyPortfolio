"""
hybrid_retriever.py
Unified Hybrid Retriever: Fuses structured relational SQL records (Supabase)
with unstructured technical document vectors (ChromaDB).
"""

from typing import Dict, List, Any, Optional
from app.services.rag_engine import fetch_portfolio_data
from app.services.vector_store import search_similar_chunks

def retrieve_hybrid_context(
    query: str,
    target_category: str = "projects",
    routing_strategy: str = "hybrid"
) -> Dict[str, Any]:
    """
    Executes hybrid retrieval based on the routing strategy and target entity.
    Returns:
    {
        "sql_records": { ... },
        "document_chunks": [ ... ],
        "unified_evidence": [ ... ],
        "has_records": bool
    }
    """
    sql_data = {}
    doc_chunks = []

    # 1. Fetch SQL database records if strategy requires tables
    if routing_strategy in ("db_tables", "hybrid"):
        try:
            sql_data = fetch_portfolio_data()
        except Exception as e:
            print(f"[HybridRetriever] SQL fetch warning: {e}")

    # 2. Fetch vector document chunks if strategy requires docs
    if routing_strategy in ("vector_store", "hybrid"):
        try:
            # Query top 4 most relevant chunks
            where_filter = None
            if target_category in ("projects", "experience", "education", "skills", "certificates"):
                where_filter = {"entity_type": target_category}

            doc_chunks = search_similar_chunks(query=query, top_k=4, where_filter=where_filter)
            
            # If filtered search returned nothing, fall back to broad search without filter
            if not doc_chunks and where_filter:
                doc_chunks = search_similar_chunks(query=query, top_k=4)
        except Exception as e:
            print(f"[HybridRetriever] Vector search warning: {e}")

    # 3. Build unified evidence summary
    unified_evidence = []

    # Add matched document chunks as high-resolution evidence
    for chunk in doc_chunks:
        meta = chunk.get("metadata", {})
        unified_evidence.append({
            "source_type": "document",
            "title": meta.get("entity_title") or meta.get("filename", "Uploaded Spec"),
            "content": chunk.get("text", ""),
            "similarity": chunk.get("similarity_score", 1.0),
            "reference": f"{meta.get('filename', 'doc')} (Chunk {meta.get('chunk_index', 0)})",
            "citation_type": meta.get("entity_type", "project")
        })

    # Check if we have authentic records (either SQL or documents)
    has_sql_content = bool(
        sql_data.get("projects") or 
        sql_data.get("experiences") or 
        sql_data.get("certificates") or 
        sql_data.get("skills")
    )
    has_records = has_sql_content or bool(doc_chunks)

    return {
        "sql_records": sql_data,
        "document_chunks": doc_chunks,
        "unified_evidence": unified_evidence,
        "has_records": has_records
    }
