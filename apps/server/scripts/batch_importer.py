"""Transactional batch DB insert with deduplication."""

from core.database import async_session
from db.product_repository import ProductRepository
from models.product_model import Product


async def generate_unique_slug(
    name: str, repo: ProductRepository, max_attempts: int = 100
) -> str:
    """Generate a unique slug from a product name.

    Reuses the same approach as AdminProductController._generate_unique_slug()
    but operates standalone for the import pipeline.
    """
    from utils.slug import slugify

    base_slug = slugify(name)
    slug = base_slug

    counter = 1
    while await repo.slug_exists(slug) and counter <= max_attempts:
        slug = f"{base_slug}-{counter}"
        counter += 1

    return slug


async def import_batch(
    products: list[Product],
    rows_for_logging: list[str],
    batch_index: int,
    total_batches: int,
) -> tuple[int, int]:
    """Import a batch of products into the database.

    Each batch runs in its own transaction. If the batch insert fails,
    products are retried individually to isolate problematic rows.

    Returns (imported_count, skipped_count).
    """
    imported = 0
    skipped = 0

    async with async_session() as session:
        repo = ProductRepository(session)

        # Phase 1: Generate unique slugs for all products in batch
        for product in products:
            try:
                product.slug = await generate_unique_slug(product.name, repo)
            except Exception:
                skipped += 1
                continue

        # Filter out products that failed slug generation
        valid_products = [p for p in products if p.slug and p.slug.strip()]

        if not valid_products:
            print(
                f"  Batch {batch_index}/{total_batches}: "
                "all products skipped (slug generation)"
            )
            return imported, skipped

        # Phase 2: Check for existing slugs in DB
        all_slugs = [p.slug for p in valid_products]
        existing_slugs = await repo.slugs_exist(all_slugs)

        new_products = [p for p in valid_products if p.slug not in existing_slugs]
        skipped += len(valid_products) - len(new_products)

        if not new_products:
            print(
                f"  Batch {batch_index}/{total_batches}: "
                "all products already exist (duplicate slugs)"
            )
            return imported, skipped

        # Phase 3: Batch insert
        try:
            await repo.create_batch(new_products)
            await session.commit()
            imported = len(new_products)
            print(
                f"  Batch {batch_index}/{total_batches}: "
                f"{imported} products committed"
            )
        except Exception as exc:
            await session.rollback()
            print(f"  Batch {batch_index}/{total_batches} failed: {exc}")
            print(f"  Retrying individually ({len(new_products)} products)...")

            # Phase 4: Fallback — retry one at a time
            sub_imported, sub_skipped = await _import_individually(new_products)
            imported += sub_imported
            skipped += sub_skipped

    return imported, skipped


async def _import_individually(products: list[Product]) -> tuple[int, int]:
    """Insert products one at a time with individual transactions.

    Returns (imported_count, skipped_count).
    """
    imported = 0
    skipped = 0

    for product in products:
        try:
            async with async_session() as session:
                repo = ProductRepository(session)
                await repo.create(product)
                await session.commit()
            imported += 1
        except Exception:
            skipped += 1

    return imported, skipped
