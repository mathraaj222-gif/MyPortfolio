from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from app.services.rag_engine import fetch_portfolio_data, analyze_portfolio_strictly

router = APIRouter()

class ChatRequest(BaseModel):
    query: str
    history: Optional[List[Dict[str, Any]]] = None

class ChatResponse(BaseModel):
    success: bool
    data: Dict[str, Any]

@router.post("/guide", response_model=ChatResponse)
async def ask_guide(request: ChatRequest):
    if not request.query or not request.query.strip():
        raise HTTPException(status_code=400, detail="Query string cannot be empty")

    try:
        data = fetch_portfolio_data()
        result = analyze_portfolio_strictly(request.query, data)
        return ChatResponse(success=True, data=result)
    except Exception as e:
        print(f"Error in ask_guide: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to process guide query: {str(e)}")
