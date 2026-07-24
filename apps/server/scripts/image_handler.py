"""Image validation and async Cloudinary upload."""

import asyncio
from pathlib import Path

from scripts.csv_reader import CSVRow
from utils.cloudinary import CloudinaryUploader


async def upload_product_images(
    rows: list[CSVRow],
    images_dir: Path,
    max_concurrent: int = 10,
) -> tuple[list[str | None], int]:
    """Upload product images to Cloudinary with async concurrency.

    Each image is read from disk and uploaded via CloudinaryUploader.
    Uses a semaphore to limit concurrent uploads.

    Returns (image_urls, uploaded_count).
    image_urls[i] is the Cloudinary secure_url or None if upload failed.
    """
    uploader = CloudinaryUploader()
    semaphore = asyncio.Semaphore(max_concurrent)
    urls: list[str | None] = [None] * len(rows)
    uploaded_count = 0
    completed = 0

    async def _upload_one(index: int, row: CSVRow) -> None:
        nonlocal uploaded_count, completed
        image_path = images_dir / f"{row.csv_id}.jpg"

        try:
            file_data = await asyncio.to_thread(image_path.read_bytes)
        except OSError:
            completed += 1
            return

        async with semaphore:
            try:
                result = await uploader.upload_image(file_data, folder="products")
                urls[index] = str(result["url"])
                uploaded_count += 1
            except Exception:
                pass

        completed += 1
        if completed % 50 == 0:
            print(f"  Images uploaded: {completed}/{len(rows)}")

    await asyncio.gather(*[_upload_one(i, row) for i, row in enumerate(rows)])
    return urls, uploaded_count
