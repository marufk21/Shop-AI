from collections.abc import AsyncGenerator
from urllib.parse import parse_qs, urlencode, urlparse, urlunparse

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from core.config import settings

SSL_REQUIRED_MODES = {"require", "verify-ca", "verify-full"}


def build_engine_config(database_url: str) -> tuple[str, dict[str, bool]]:
    parsed = urlparse(database_url)
    query = parse_qs(parsed.query)
    ssl_modes = query.pop("sslmode", [])
    query.pop("channel_binding", None)

    clean_url = urlunparse(parsed._replace(query=urlencode(query, doseq=True)))
    connect_args = (
        {"ssl": True}
        if any(ssl_mode in SSL_REQUIRED_MODES for ssl_mode in ssl_modes)
        else {}
    )

    return clean_url, connect_args


database_url, connect_args = build_engine_config(settings.database_url)
engine = create_async_engine(
    database_url,
    echo=settings.debug,
    connect_args=connect_args,
)
async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
