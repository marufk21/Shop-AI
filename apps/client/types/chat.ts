export interface SourceCitation {
  document_name: string
  excerpt: string
  relevance_score: number | null
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  sources?: SourceCitation[]
  timestamp?: string
}

export interface ChatRequest {
  message: string
  temperature: number
  use_rag: boolean
  top_k: number
}
