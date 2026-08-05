export interface SourceCitation {
  document_name: string
  excerpt: string
  relevance_score: number | null
}

export interface ChatMessageInput {
  role: "user" | "assistant"
  content: string
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  sources?: SourceCitation[]
  agent?: string
  timestamp?: string
}

export interface ChatRequest {
  message: string
  history: ChatMessageInput[]
  temperature: number
  use_rag: boolean
  top_k: number
}
