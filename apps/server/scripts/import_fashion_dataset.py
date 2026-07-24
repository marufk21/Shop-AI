"""Fashion Product Dataset Importer — main orchestrator.

Imports the first N valid products from the Fashion Product Images (Small)
dataset into the Shop-AI PostgreSQL database.

Usage:
    cd apps/server && python -m scripts.import_fashion_dataset

    # Optional flags:
    python -m scripts.import_fashion_dataset --limit 500
    python -m scripts.import_fashion_dataset --batch-size 200
    python -m scripts.import_fashion_dataset --dry-run
    python -m scripts.import_fashion_dataset --seed 42
"""

import argparse
import asyncio
import random
from pathlib import Path

from models.product_model import Product
from scripts.batch_importer import import_batch
from scripts.csv_reader import CSVRow, filter_rows_with_images, read_csv_limited
from scripts.description_builder import build_description
from scripts.image_handler import upload_product_images
from scripts.price_generator import generate_price
from scripts.report import ImportReport

# Paths relative to the server directory
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent.parent
DATASET_DIR = PROJECT_ROOT / "dataset"
CSV_PATH = DATASET_DIR / "styles.csv"
IMAGES_DIR = DATASET_DIR / "images"

DEFAULT_LIMIT = 2000
DEFAULT_BATCH_SIZE = 100
DEFAULT_CLOUDINARY_CONCURRENCY = 10


def build_product(row: CSVRow, image_url: str | None) -> Product:
    """Build a Product ORM instance from a CSV row and image URL."""
    category = f"{row.master_category} > {row.sub_category} > {row.article_type}"
    if len(category) > 100:
        category = f"{row.master_category} > {row.article_type}"

    description = build_description(row)
    if len(description) > 2000:
        description = description[:1997] + "..."

    return Product(
        name=row.name,
        slug="",  # filled by batch_importer.generate_unique_slug()
        description=description,
        price=generate_price(row.article_type, row.master_category),
        category=category,
        inventory=random.randint(10, 200),
        status="active",
        image_url=image_url,
    )


async def run_import(
    limit: int,
    batch_size: int,
    dry_run: bool = False,
    seed: int | None = None,
) -> ImportReport:
    """Run the full import pipeline."""
    report = ImportReport()

    if seed is not None:
        random.seed(seed)

    print("=" * 60)
    print("FASHION PRODUCT DATASET IMPORTER")
    print("=" * 60)
    print(f"Dataset:  {CSV_PATH}")
    print(f"Images:   {IMAGES_DIR}")
    print(f"Limit:    {limit} products")
    print(f"Batch:    {batch_size}")
    print(f"Dry run:  {dry_run}")
    print()

    # ── Phase 1: Read CSV ──────────────────────────────────────────
    print("[Phase 1/5] Reading CSV...")
    rows, invalid = read_csv_limited(CSV_PATH, limit)
    report.csv_rows_read = limit
    report.csv_valid = len(rows)
    report.csv_skipped_invalid = invalid
    total_read = len(rows) + invalid
    print(f"  Read {total_read} rows, {len(rows)} valid, {invalid} skipped (invalid)")

    if not rows:
        print("No valid rows found. Exiting.")
        report.finish()
        return report

    # ── Phase 2: Check images exist ─────────────────────────────────
    print("\n[Phase 2/5] Checking images exist...")
    rows, missing_images = filter_rows_with_images(rows, IMAGES_DIR)
    report.rows_with_images = len(rows)
    report.skipped_missing_image = missing_images
    print(f"  {len(rows)} with images, {missing_images} skipped (missing image)")

    if not rows:
        print("No rows with valid images. Exiting.")
        report.finish()
        return report

    # ── Phase 3: Upload images to Cloudinary ────────────────────────
    print("\n[Phase 3/5] Uploading images to Cloudinary...")
    image_urls: list[str | None]
    if dry_run:
        image_urls = [
            f"https://res.cloudinary.com/dry-run/image_{r.csv_id}.jpg"
            for r in rows
        ]
        report.images_uploaded = len(rows)
        print(f"  [DRY RUN] Would upload {len(rows)} images")
    else:
        image_urls, uploaded = await upload_product_images(
            rows, IMAGES_DIR, max_concurrent=DEFAULT_CLOUDINARY_CONCURRENCY
        )
        report.images_uploaded = uploaded
        report.images_upload_failed = len(rows) - uploaded
        print(f"  Uploaded: {uploaded}/{len(rows)}")

    # ── Phase 4: Build Product objects ──────────────────────────────
    print("\n[Phase 4/5] Building product objects...")
    products: list[Product] = []
    skipped_image = 0
    for i, row in enumerate(rows):
        img_url = image_urls[i]
        if img_url is None:
            skipped_image += 1
            continue
        product = build_product(row, img_url)
        products.append(product)
    report.descriptions_built = len(products)
    report.skipped_image_upload = skipped_image
    print(
        f"  Built {len(products)} product objects "
        f"({skipped_image} skipped: upload failed)"
    )

    # ── Phase 5: Batch insert to database ───────────────────────────
    print("\n[Phase 5/5] Importing to database...")
    total_batches = (len(products) + batch_size - 1) // batch_size

    if dry_run:
        print(
            f"  [DRY RUN] Would insert {len(products)} products "
            f"in {total_batches} batches"
        )
        report.imported = len(products)
    else:
        total_imported = 0
        total_skipped = 0
        for batch_idx in range(total_batches):
            start = batch_idx * batch_size
            end = min(start + batch_size, len(products))
            batch_products = products[start:end]
            batch_names = [p.name for p in batch_products]

            imported, skipped = await import_batch(
                batch_products,
                batch_names,
                batch_index=batch_idx + 1,
                total_batches=total_batches,
            )
            total_imported += imported
            total_skipped += skipped

        report.imported = total_imported
        report.skipped_duplicate_slug = total_skipped

    report.total_processed = len(products)
    report.finish()

    # ── Final Report ────────────────────────────────────────────────
    report.print()
    return report


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Import fashion products from CSV dataset into Shop-AI"
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=DEFAULT_LIMIT,
        help=f"Max products to import (default: {DEFAULT_LIMIT})",
    )
    parser.add_argument(
        "--batch-size",
        type=int,
        default=DEFAULT_BATCH_SIZE,
        help=f"Products per DB batch (default: {DEFAULT_BATCH_SIZE})",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Run without inserting to DB or uploading to Cloudinary",
    )
    parser.add_argument(
        "--seed",
        type=int,
        default=42,
        help="Random seed for reproducible prices/inventory (default: 42)",
    )
    args = parser.parse_args()

    asyncio.run(
        run_import(
            limit=args.limit,
            batch_size=args.batch_size,
            dry_run=args.dry_run,
            seed=args.seed,
        )
    )


if __name__ == "__main__":
    main()
