import asyncio
import logging
import urllib.request
from typing import Any

from core.config import keep_alive_settings

logger = logging.getLogger(__name__)

_keep_alive_task: asyncio.Task[Any] | None = None


def _get_urls() -> list[str]:
    """Parse the comma-separated KEEP_ALIVE_URLS env var into a list."""
    urls_str = keep_alive_settings.keep_alive_urls.strip()
    if not urls_str:
        return []
    return [url.strip() for url in urls_str.split(",") if url.strip()]


async def _ping_url(url: str) -> None:
    """Send a GET request to a single URL via a thread to avoid blocking."""
    try:
        await asyncio.to_thread(urllib.request.urlopen, url, timeout=30)
        logger.info("Keep-alive ping succeeded: %s", url)
    except Exception:
        logger.warning("Keep-alive ping failed: %s", url, exc_info=True)


async def _keep_alive_loop(urls: list[str], interval: int) -> None:
    """Background loop that pings all configured URLs at the given interval."""
    while True:
        await asyncio.gather(
            *(_ping_url(url) for url in urls), return_exceptions=True
        )
        await asyncio.sleep(interval)


def start_keep_alive() -> None:
    """Start the keep-alive background task if URLs are configured in env."""
    global _keep_alive_task

    urls = _get_urls()
    if not urls:
        logger.debug("Keep-alive not started: no KEEP_ALIVE_URLS configured")
        return

    interval = keep_alive_settings.keep_alive_interval_seconds
    _keep_alive_task = asyncio.create_task(_keep_alive_loop(urls, interval))
    logger.info("Keep-alive started: %d URL(s) every %ds", len(urls), interval)


async def stop_keep_alive() -> None:
    """Cancel the keep-alive background task gracefully."""
    global _keep_alive_task
    if _keep_alive_task is not None:
        _keep_alive_task.cancel()
        try:
            await _keep_alive_task
        except asyncio.CancelledError:
            pass
        _keep_alive_task = None
        logger.info("Keep-alive stopped")
