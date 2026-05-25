import csv
import io

from pypdf import PdfReader


def parse_pdf(content: bytes) -> str:
    reader = PdfReader(io.BytesIO(content))
    texts: list[str] = []
    for page in reader.pages:
        text = page.extract_text()
        if text:
            texts.append(text)
    return "\n\n".join(texts)


def parse_csv(content: bytes) -> str:
    text = content.decode("utf-8")
    rows: list[str] = []
    reader = csv.reader(io.StringIO(text))
    for row in reader:
        rows.append(", ".join(row))
    return "\n".join(rows)


def parse_text(content: bytes) -> str:
    return content.decode("utf-8")


PARSERS = {
    "pdf": parse_pdf,
    "csv": parse_csv,
    "txt": parse_text,
    "md": parse_text,
}


def parse_document(content: bytes, file_type: str) -> str:
    parser = PARSERS.get(file_type)
    if not parser:
        raise ValueError(f"Unsupported file type: {file_type}")
    return parser(content)
