import os
import uuid

from db.document_repository import DocumentRepository
from db.vector_repository import VectorRepository
from models.document_model import Document, DocumentChunk
from schemas.document_schema import DocumentListResponse, DocumentResponse
from utils.chunker import chunk_text
from utils.document_parser import parse_document
from utils.embedding import generate_embeddings

UPLOAD_DIR = "uploads/documents"
ALLOWED_TYPES = {"pdf", "csv", "txt", "md"}


class DocumentController:
    def __init__(self, doc_repo: DocumentRepository, vector_repo: VectorRepository):
        self.doc_repo = doc_repo
        self.vector_repo = vector_repo

    async def upload_document(self, filename: str, content: bytes) -> Document:
        ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
        if ext not in ALLOWED_TYPES:
            raise ValueError(f"Unsupported file type: {ext}")

        doc_id = uuid.uuid4()
        os.makedirs(UPLOAD_DIR, exist_ok=True)
        file_path = os.path.join(UPLOAD_DIR, f"{doc_id}_{filename}")
        with open(file_path, "wb") as f:
            f.write(content)

        document = Document(
            id=doc_id,
            name=filename,
            file_type=ext,
            size_bytes=len(content),
            status="uploading",
        )
        document = await self.doc_repo.create(document)

        try:
            await self.doc_repo.update(document, {"status": "processing"})
            text = parse_document(content, ext)
            chunks_text = chunk_text(text)
            if not chunks_text:
                raise ValueError("No text could be extracted from the document")

            embeddings = await generate_embeddings(chunks_text)
            doc_chunks = [
                DocumentChunk(
                    document_id=doc_id,
                    content=chunk,
                    chunk_index=i,
                    embedding=emb,
                )
                for i, (chunk, emb) in enumerate(
                    zip(chunks_text, embeddings, strict=True)
                )
            ]
            await self.vector_repo.create_chunks(doc_chunks)
            await self.doc_repo.update(
                document, {"status": "indexed", "chunk_count": len(doc_chunks)}
            )
        except Exception as e:
            await self.doc_repo.update(
                document, {"status": "error", "error_message": str(e)}
            )

        return document

    async def list_documents(
        self, skip: int = 0, limit: int = 20
    ) -> DocumentListResponse:
        docs, total = await self.doc_repo.list_all(skip, limit)
        return DocumentListResponse(
            items=[DocumentResponse.model_validate(d) for d in docs],
            total=total,
        )

    async def delete_document(self, doc_id: uuid.UUID) -> None:
        document = await self.doc_repo.get_by_id(doc_id)
        if not document:
            raise FileNotFoundError(f"Document not found: {doc_id}")

        await self.vector_repo.delete_chunks_by_document(doc_id)
        await self.doc_repo.delete(document)

        file_path = os.path.join(UPLOAD_DIR, f"{doc_id}_{document.name}")
        if os.path.exists(file_path):
            os.remove(file_path)
