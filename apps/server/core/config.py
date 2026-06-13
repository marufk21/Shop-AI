from urllib.parse import parse_qs, urlencode, urlparse, urlunparse

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str
    app_name: str
    debug: bool
    gemini_api_key: str

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": False,
        "extra": "ignore",
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

    @field_validator("gemini_api_key", mode="before")
    @classmethod
    def strip_quotes(cls, v: str) -> str:
        return v.strip("'\"")


class CloudinarySettings(BaseSettings):
    cloud_name: str = Field(validation_alias="CLOUDINARY_CLOUD_NAME")
    api_key: str = Field(validation_alias="CLOUDINARY_API_KEY")
    upload_preset: str = Field(validation_alias="CLOUDINARY_UPLOAD_PRESET")
    api_secret: str = Field(validation_alias="CLOUDINARY_API_SECRET")

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": False,
        "extra": "ignore",
    }


settings = Settings()  # type: ignore[call-arg]
cloudinary_settings = CloudinarySettings()  # type: ignore[call-arg]
