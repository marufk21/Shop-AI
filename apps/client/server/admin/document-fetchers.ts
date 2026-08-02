import { apiClient } from "@/server/api-client"
import type { Document, DocumentListResponse } from "@/types/document"

export async function fetchDocuments(
  skip: number = 0,
  limit: number = 20
) {
  return apiClient.get<DocumentListResponse>("/api/v1/documents", {
    params: { skip, limit },
  })
}

export async function uploadDocument(file: File) {
  const formData = new FormData()
  formData.append("file", file)
  return apiClient.post<Document>("/api/v1/documents/upload", formData)
}

export async function deleteDocument(documentId: string) {
  await apiClient.delete(`/api/v1/documents/${documentId}`)
}
