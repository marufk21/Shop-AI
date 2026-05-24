from urllib.parse import parse_qs, urlencode, urlparse, urlunparse

from pydantic import field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/shopai"
    app_name: str = "ShopAI"
    debug: bool = False

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": False,
    }

    @field_validator("database_url", mode="before")
    @classmethod
    def clean_database_url(cls, v: str) -> str:
        if v.startswith("postgresql://"):
            v = v.replace("postgresql://", "postgresql+asyncpg://", 1)
        elif v.startswith("postgres://"):
            v = v.replace("postgres://", "postgresql+asyncpg://", 1)

        parsed = urlparse(v)
        query = parse_qs(parsed.query)

        # asyncpg doesn't support channel_binding — strip it
        query.pop("channel_binding", None)

        new_query = urlencode(query, doseq=True)
        v = urlunparse(parsed._replace(query=new_query))
        return v


settings = Settings()
