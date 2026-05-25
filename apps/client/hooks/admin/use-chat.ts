import { useCallback, useState } from "react"

import { streamChatMessage } from "@/server/admin/chat-fetchers"
import type { ChatMessage } from "@/types/chat"

type SendOptions = {
  temperature?: number
  useRag?: boolean
  topK?: number
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isStreaming, setIsStreaming] = useState(false)

  const sendMessage = useCallback(
    (content: string, options: SendOptions = {}) => {
      const { temperature = 0.7, useRag = true, topK = 5 } = options

      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content,
        timestamp: new Date().toLocaleTimeString(),
      }

      const assistantId = crypto.randomUUID()
      const assistantMsg: ChatMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
        timestamp: new Date().toLocaleTimeString(),
      }

      setMessages((prev) => [...prev, userMsg, assistantMsg])
      setIsStreaming(true)

      streamChatMessage(
        { message: content, temperature, use_rag: useRag, top_k: topK },
        {
          onToken: (token) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, content: m.content + token }
                  : m
              )
            )
          },
          onSources: (sources) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, sources } : m
              )
            )
          },
          onDone: () => {
            setIsStreaming(false)
          },
          onError: () => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, content: "Sorry, something went wrong." }
                  : m
              )
            )
            setIsStreaming(false)
          },
        }
      )
    },
    []
  )

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  return { messages, isStreaming, sendMessage, clearMessages }
}
