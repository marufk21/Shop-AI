"""Template-based product descriptions — fast, no AI calls.

Assembles descriptions from CSV metadata (gender, colour, season, usage, year).
All fields have dataset values; nothing needs AI generation.
"""

from scripts.csv_reader import CSVRow


def build_description(row: CSVRow) -> str:
    """Build a natural e-commerce product description from dataset metadata.

    Uses template-based composition — zero API calls, instant execution.
    Example output:
      "Turtle Check Men Navy Blue Shirt. A casual navy blue shirt for men,
       perfect for fall wear. Shop this 2011 style at ShopAI."
    """
    colour = row.base_colour.lower() if row.base_colour else ""
    usage = row.usage.lower() if row.usage else "versatile"
    gender_label = _gender_label(row.gender)
    season = row.season.lower() if row.season else "all-season"

    parts: list[str] = [row.name + "."]

    article = row.article_type.lower()
    desc_lines = _build_description_lines(
        usage=usage,
        colour=colour,
        article=article,
        gender_label=gender_label,
        season=season,
    )
    parts.extend(desc_lines)

    if row.year:
        parts.append(f"Originally from {row.year}.")

    parts.append("Shop this style at ShopAI.")

    return " ".join(parts)


def _gender_label(gender: str) -> str:
    mapping: dict[str, str] = {
        "Men": "men",
        "Women": "women",
        "Boys": "boys",
        "Girls": "girls",
        "Unisex": "anyone",
    }
    return mapping.get(gender, gender.lower()) if gender else "anyone"


def _build_description_lines(
    usage: str,
    colour: str,
    article: str,
    gender_label: str,
    season: str,
) -> list[str]:
    """Assemble the body of the description."""
    lines: list[str] = []

    # Primary line: usage + colour + article + gender + season
    primary_parts: list[str] = []
    if usage:
        primary_parts.append(f"A {usage}")
    if colour:
        primary_parts.append(colour)
    if article:
        primary_parts.append(article)
    if gender_label:
        primary_parts.append(f"for {gender_label}")

    if primary_parts:
        line = " ".join(primary_parts) + "."
        lines.append(line)

    # Season line
    if season and season != "all-season":
        lines.append(f"Perfect for {season} wear.")

    return lines
