"""CSV reader with validation and image existence checking."""

import csv
from dataclasses import dataclass
from pathlib import Path


@dataclass
class CSVRow:
    """Parsed and validated CSV row from the fashion dataset."""

    csv_id: int
    name: str
    gender: str
    master_category: str
    sub_category: str
    article_type: str
    base_colour: str
    season: str
    year: int | None
    usage: str


def validate_csv_row(raw: dict[str, str]) -> CSVRow | None:
    """Validate a raw CSV row and return a parsed CSVRow, or None if invalid."""
    raw_id = raw.get("id", "").strip()
    if not raw_id:
        return None

    try:
        csv_id = int(raw_id)
    except (ValueError, TypeError):
        return None

    name = raw.get("productDisplayName", "").strip()
    if not name or len(name) > 255:
        return None

    article_type = raw.get("articleType", "").strip()
    if not article_type:
        return None

    year_raw = raw.get("year", "").strip()
    year: int | None = None
    if year_raw:
        try:
            year = int(year_raw)
        except (ValueError, TypeError):
            year = None

    return CSVRow(
        csv_id=csv_id,
        name=name,
        gender=raw.get("gender", "").strip(),
        master_category=raw.get("masterCategory", "").strip(),
        sub_category=raw.get("subCategory", "").strip(),
        article_type=article_type,
        base_colour=raw.get("baseColour", "").strip(),
        season=raw.get("season", "").strip(),
        year=year,
        usage=raw.get("usage", "").strip(),
    )


def read_csv_limited(
    csv_path: Path, limit: int, offset: int = 0
) -> tuple[list[CSVRow], int]:
    """Read up to `limit` valid rows from the CSV file, skipping the first
    `offset` valid rows.

    Returns (valid_rows, skipped_invalid_count).
    """
    rows: list[CSVRow] = []
    skipped_invalid = 0
    skipped_offset = 0

    with open(csv_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for raw in reader:
            if len(rows) >= limit:
                break
            parsed = validate_csv_row(raw)
            if parsed is None:
                skipped_invalid += 1
                continue
            if skipped_offset < offset:
                skipped_offset += 1
                continue
            rows.append(parsed)

    return rows, skipped_invalid


def filter_rows_with_images(
    rows: list[CSVRow], images_dir: Path
) -> tuple[list[CSVRow], int]:
    """Filter rows to only those with an existing image file.

    Returns (rows_with_images, skipped_missing_image_count).
    """
    valid: list[CSVRow] = []
    skipped = 0

    for row in rows:
        image_path = images_dir / f"{row.csv_id}.jpg"
        if image_path.is_file():
            valid.append(row)
        else:
            skipped += 1

    return valid, skipped
