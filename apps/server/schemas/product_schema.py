import uuid
from datetime import datetime

from pydantic import BaseModel, Field


class ProductBase(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=2000)
    price: float = Field(ge=0)
    category: str = Field(min_length=1, max_length=100)
    inventory: int = Field(ge=0, default=0)
    status: str = Field(default="draft", pattern="^(draft|active|archived)$")


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=2000)
    price: float | None = Field(default=None, ge=0)
    category: str | None = Field(default=None, min_length=1, max_length=100)
    inventory: int | None = Field(default=None, ge=0)
    status: str | None = Field(default=None, pattern="^(draft|active|archived)$")


class ProductResponse(ProductBase):
    id: uuid.UUID
    slug: str
    image_url: str | None = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ProductListResponse(BaseModel):
    items: list[ProductResponse]
    total: int
