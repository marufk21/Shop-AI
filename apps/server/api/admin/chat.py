from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse

from controllers.admin.chat_controller import ChatController
from core.dependencies import get_chat_controller
from schemas.chat_schema import ChatRequest

router = APIRouter(prefix="/api/v1/chat", tags=["chat"])


@router.post("/message")
async def chat_message(
    request: ChatRequest,
    controller: ChatController = Depends(get_chat_controller),
) -> StreamingResponse:
    return await controller.stream_response(request)
