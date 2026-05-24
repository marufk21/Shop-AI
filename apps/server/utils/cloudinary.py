import asyncio
from typing import Any

import cloudinary
import cloudinary.uploader

from core.config import cloudinary_settings

cloudinary.config(
    cloud_name=cloudinary_settings.cloud_name,
    api_key=cloudinary_settings.api_key,
    api_secret=cloudinary_settings.api_secret,
    secure=True,
)


class CloudinaryUploader:
    def __init__(self) -> None:
        preset = cloudinary_settings.upload_preset
        self.upload_preset = preset or None

    async def upload_image(
        self, file_data: bytes, folder: str = "products"
    ) -> dict[str, Any]:
        upload_options: dict[str, Any] = {
            "folder": folder,
            "resource_type": "image",
        }
        if self.upload_preset:
            upload_options["upload_preset"] = self.upload_preset

        result = await asyncio.to_thread(
            cloudinary.uploader.upload,
            file_data,
            **upload_options,
        )
        return {
            "url": result["secure_url"],
            "public_id": result["public_id"],
            "width": result["width"],
            "height": result["height"],
            "format": result["format"],
        }
