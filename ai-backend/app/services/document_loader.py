"""
document_loader.py
Extracts and chunks unstructured documents (PDF, Markdown, TXT) for RAG vector indexing.
"""

import io
import uuid
import datetime
from typing import List, Dict, Any, Tuple

def extract_text_from_file(file_bytes: bytes, filename: str) -> str:
    """
    Extracts raw text content from uploaded file bytes based on file extension.
    """
    ext = filename.lower().split(".")[-1] if "." in filename else ""

    if ext == "pdf":
        try:
            import pypdf
            reader = pypdf.PdfReader(io.BytesIO(file_bytes))
            pages_text = []
            for i, page in enumerate(reader.pages):
                text = page.extract_text()
                if text:
                    pages_text.append(f"[Page {i+1}]\n{text}")
            return "\n\n".join(pages_text)
        except Exception as e:
            print(f"[DocumentLoader] PDF parsing error: {e}")
            raise ValueError(f"Failed to extract text from PDF: {e}")

    # Plain text / Markdown / Text-based files
    try:
        return file_bytes.decode("utf-8")
    except UnicodeDecodeError:
        try:
            return file_bytes.decode("latin-1")
        except Exception as e:
            raise ValueError(f"Could not decode document text: {e}")


def process_and_chunk_document(
    file_bytes: bytes,
    filename: str,
    entity_type: str = "project",
    entity_id: str = "",
    entity_title: str = ""
) -> Tuple[str, List[Dict[str, Any]]]:
    """
    Extracts text, splits into semantic chunks with overlap, and attaches rich metadata.
    Returns:
      (doc_id, list_of_chunk_dicts)
    """
    text = extract_text_from_file(file_bytes, filename)
    if not text.strip():
        raise ValueError("Document contains no extractable text.")

    from langchain_text_splitters import RecursiveCharacterTextSplitter

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=600,
        chunk_overlap=80,
        separators=["\n\n", "\n", " ", ""]
    )

    raw_chunks = splitter.split_text(text)
    doc_id = str(uuid.uuid4())[:8]
    uploaded_at = datetime.datetime.utcnow().isoformat()

    chunks = []
    for idx, chunk_text in enumerate(raw_chunks):
        chunk_id = f"{doc_id}_{idx}"
        chunks.append({
            "id": chunk_id,
            "text": chunk_text,
            "metadata": {
                "doc_id": doc_id,
                "filename": filename,
                "chunk_index": idx,
                "total_chunks": len(raw_chunks),
                "entity_type": entity_type,
                "entity_id": str(entity_id),
                "entity_title": entity_title or filename,
                "uploaded_at": uploaded_at
            }
        })

    return doc_id, chunks
