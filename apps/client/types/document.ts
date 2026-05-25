export type DocumentStatus = "uploading" | "processing" | "indexed" | "error"
export type DocumentType = "pdf" | "csv" | "txt" | "md"

export interface Document {
  id: string
  name: string
  file_type: DocumentType
  size_bytes: number
  status: DocumentStatus
  error_message: string | null
  chunk_count: number
  created_at: string
  updated_at: string
}

export interface DocumentListResponse {
  items: Document[]
  total: number
}
