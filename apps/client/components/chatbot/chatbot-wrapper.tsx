"use client"

import dynamic from "next/dynamic"

const FloatingChatbot = dynamic(
  () =>
    import("./floating-chatbot").then((mod) => ({
      default: mod.FloatingChatbot,
    })),
  { ssr: false }
)

export function ChatbotWrapper() {
  return <FloatingChatbot />
}
