from pydantic import BaseModel, Field


class ImproveRequest(BaseModel):
    text: str = Field(min_length=1, max_length=2000)
    field: str = Field(pattern="^(name|description)$")


class ImproveResponse(BaseModel):
    improved_text: str
