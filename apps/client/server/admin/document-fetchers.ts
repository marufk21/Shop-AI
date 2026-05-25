import { axiosClient, axiosMultipart } from "@/server/axios-client"
import type { Document, DocumentListResponse } from "@/types/document"

export async function fetchDocuments(
  skip: number = 0,
  limit: number = 20
) {
  const { data } = await axiosClient.get<DocumentListResponse>(
    "/api/v1/documents",
    { params: { skip, limit } }
  )
  return data
}

export async function uploadDocument(file: File) {
  const client = axiosMultipart()
  const formData = new FormData()
  formData.append("file", file)
  const { data } = await client.post<Document>(
    "/api/v1/documents/upload",
    formData
  )
  return data
}

export async function deleteDocument(documentId: string) {
  await axiosClient.delete(`/api/v1/documents/${documentId}`)
}
