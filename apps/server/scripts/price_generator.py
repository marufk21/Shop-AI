"""Rule-based price generation by article type — no AI needed."""

import random

# Price ranges keyed by articleType (lowercased). Each tuple is (min, max) in USD.
PRICE_RANGES: dict[str, tuple[float, float]] = {
    # Apparel — Topwear
    "shirts": (15.00, 80.00),
    "tshirts": (10.00, 50.00),
    "tops": (10.00, 60.00),
    "sweaters": (25.00, 120.00),
    "sweatshirts": (20.00, 100.00),
    "jackets": (40.00, 250.00),
    "blazers": (50.00, 300.00),
    "suits": (80.00, 500.00),
    "kurtas": (20.00, 100.00),
    "kurta sets": (30.00, 150.00),
    "rain jacket": (25.00, 120.00),
    "wind cheater": (20.00, 100.00),
    "waistcoat": (25.00, 120.00),
    "nehru jackets": (30.00, 150.00),
    # Apparel — Bottomwear
    "jeans": (25.00, 120.00),
    "trousers": (20.00, 100.00),
    "track pants": (15.00, 70.00),
    "shorts": (12.00, 60.00),
    "leggings": (15.00, 70.00),
    "chinos": (20.00, 90.00),
    "cargos": (20.00, 90.00),
    "jeggings": (15.00, 60.00),
    "salwar": (15.00, 70.00),
    "churidar": (15.00, 70.00),
    "patiala": (18.00, 80.00),
    # Apparel — Dresses
    "dresses": (30.00, 200.00),
    "skirts": (15.00, 80.00),
    "tunics": (18.00, 80.00),
    "kurtis": (15.00, 70.00),
    "sarees": (30.00, 250.00),
    "lehenga choli": (50.00, 400.00),
    "dupatta": (8.00, 40.00),
    # Footwear
    "shoes": (30.00, 200.00),
    "sandals": (15.00, 80.00),
    "sneakers": (35.00, 180.00),
    "casual shoes": (25.00, 150.00),
    "formal shoes": (40.00, 200.00),
    "sports shoes": (30.00, 180.00),
    "heels": (25.00, 120.00),
    "flats": (15.00, 70.00),
    "flip flops": (5.00, 30.00),
    "boots": (40.00, 200.00),
    "ballerinas": (15.00, 70.00),
    # Accessories
    "watches": (30.00, 500.00),
    "socks": (5.00, 25.00),
    "belts": (10.00, 60.00),
    "bags": (25.00, 300.00),
    "backpacks": (20.00, 150.00),
    "wallets": (10.00, 100.00),
    "handbags": (25.00, 250.00),
    "clutches": (15.00, 120.00),
    "sunglasses": (15.00, 150.00),
    "ties": (10.00, 50.00),
    "cufflinks": (15.00, 80.00),
    "scarves": (10.00, 60.00),
    "stoles": (10.00, 60.00),
    "caps": (10.00, 40.00),
    "hats": (15.00, 60.00),
    "gloves": (10.00, 50.00),
    "suspenders": (10.00, 40.00),
    "wristbands": (5.00, 25.00),
    "headbands": (5.00, 20.00),
    "hair accessories": (3.00, 20.00),
    "umbrellas": (10.00, 50.00),
    # Jewellery
    "earrings": (10.00, 100.00),
    "necklaces": (15.00, 200.00),
    "bracelets": (15.00, 150.00),
    "rings": (20.00, 300.00),
    "pendants": (15.00, 120.00),
    "bangles": (12.00, 100.00),
    "chains": (15.00, 150.00),
    "brooches": (10.00, 60.00),
    "jewellery set": (30.00, 300.00),
    "anklets": (8.00, 50.00),
    "maa tikka": (10.00, 60.00),
    "mangalsutra": (25.00, 200.00),
    "nose pin": (5.00, 30.00),
    "studs": (5.00, 40.00),
    # Beauty / Personal Care
    "perfume": (20.00, 150.00),
    "deodorant": (5.00, 25.00),
    "lipstick": (10.00, 50.00),
    "nail polish": (5.00, 30.00),
    "foundation": (10.00, 60.00),
    "eyeliner": (5.00, 30.00),
    "compact": (8.00, 40.00),
    "kajal": (3.00, 20.00),
    "mascara": (8.00, 40.00),
    "lip gloss": (5.00, 30.00),
    "makeup remover": (5.00, 25.00),
    "sunscreen": (8.00, 40.00),
    "body lotion": (8.00, 40.00),
    "face wash": (5.00, 30.00),
    "moisturizer": (8.00, 50.00),
    "shampoo": (8.00, 40.00),
    "shower gel": (5.00, 30.00),
    "body spray": (8.00, 40.00),
    # Lingerie / Innerwear
    "bras": (15.00, 60.00),
    "briefs": (5.00, 25.00),
    "boxers": (8.00, 35.00),
    "trunks": (8.00, 35.00),
    "vests": (5.00, 25.00),
    "camisoles": (10.00, 40.00),
    "shapewear": (15.00, 60.00),
    "night suits": (20.00, 80.00),
    "night dress": (18.00, 70.00),
    "bath robe": (20.00, 80.00),
    "pyjamas": (15.00, 60.00),
    "loungewear": (20.00, 90.00),
    "rompers": (18.00, 70.00),
    # Home
    "towels": (8.00, 40.00),
    "cushion covers": (8.00, 35.00),
    "bed sheets": (15.00, 80.00),
    "curtains": (15.00, 80.00),
    "mats": (10.00, 50.00),
    "table covers": (10.00, 50.00),
    "vases": (15.00, 80.00),
    "clocks": (15.00, 80.00),
    "candles": (5.00, 30.00),
    "photo frames": (8.00, 40.00),
    "wall hangings": (15.00, 80.00),
    # Sports
    "tracksuits": (25.00, 120.00),
    "swimwear": (15.00, 70.00),
    "swim trunks": (10.00, 50.00),
    "gym vests": (10.00, 40.00),
    "sports sandals": (20.00, 80.00),
}

# Fallback ranges by masterCategory (used when articleType is not found above)
CATEGORY_FALLBACK: dict[str, tuple[float, float]] = {
    "Apparel": (12.00, 100.00),
    "Accessories": (10.00, 150.00),
    "Footwear": (20.00, 120.00),
    "Personal Care": (5.00, 50.00),
    "Home": (8.00, 60.00),
    "Sports": (15.00, 80.00),
}

DEFAULT_RANGE: tuple[float, float] = (12.00, 80.00)


def generate_price(article_type: str, master_category: str = "") -> float:
    """Generate a realistic price for a product based on its article type.

    Uses a lookup table of (min, max) ranges per article type with ±10%
    random variation. Falls back to masterCategory-based ranges, then a
    global default.
    """
    article_key = article_type.strip().lower()
    category_key = master_category.strip()

    min_price, max_price = PRICE_RANGES.get(
        article_key,
        CATEGORY_FALLBACK.get(category_key, DEFAULT_RANGE),
    )

    # Add ±10% random variation for natural price diversity
    mid = (min_price + max_price) / 2
    spread = (max_price - min_price) * 0.1
    price = random.uniform(mid - spread, mid + spread)
    return round(max(0.01, price), 2)
