from fastapi import APIRouter, HTTPException

from schemas.ai_schema import ImproveRequest, ImproveResponse
from utils.ai_generator import improve_text

router = APIRouter(prefix="/api/v1/ai", tags=["ai"])


@router.post("/improve", response_model=ImproveResponse)
async def improve(request: ImproveRequest) -> ImproveResponse:
    try:
        improved = improve_text(request.text, request.field)
        return ImproveResponse(improved_text=improved)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
