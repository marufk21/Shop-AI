"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@workspace/ui/components/button"
import { Textarea } from "@workspace/ui/components/textarea"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet"
import {
  ChatCircle,
  PaperPlaneTilt,
  Sparkle,
  UserCircle,
  X,
  FileText,
} from "@phosphor-icons/react"

type ChatMessage = {
  id: number
  role: "user" | "assistant"
  content: string
  sources?: { title: string; excerpt: string }[]
}

const quickReplies = [
  "What's your shipping policy?",
  "How do I track my order?",
  "What's your return policy?",
  "Do you offer gift wrapping?",
]

const mockReply = (question: string): ChatMessage => {
  const replies: Record<
    string,
    { content: string; sources?: { title: string; excerpt: string }[] }
  > = {
    shipping: {
      content:
        "We offer free standard shipping on orders over $50 (3-5 business days). Express shipping is $12.99 (1-2 business days). All orders are processed within 24 hours.",
      sources: [
        {
          title: "Shipping Policy",
          excerpt: "Free standard shipping on orders over $50...",
        },
      ],
    },
    track: {
      content:
        "You can track your order by logging into your account and visiting the Orders page. You'll also receive tracking updates via email once your order ships.",
    },
    return: {
      content:
        "You can return most items within 30 days of delivery. Items must be in original condition. Return shipping is free for defective items.",
      sources: [
        {
          title: "Return Policy",
          excerpt: "30-day return window from delivery date...",
        },
      ],
    },
    gift: {
      content:
        "Yes! We offer premium gift wrapping for $4.99 per item. You can select gift wrapping at checkout and include a personalized message.",
    },
    default: {
      content:
        "That's a great question! Let me check our knowledge base. In the meantime, you can browse our FAQ page or contact our support team at support@shopai.com for immediate assistance.",
    },
  }

  const key = question.toLowerCase().includes("ship")
    ? "shipping"
    : question.toLowerCase().includes("track")
      ? "track"
      : question.toLowerCase().includes("return")
        ? "return"
        : question.toLowerCase().includes("gift")
          ? "gift"
          : "default"

  const result = replies[key] ?? replies.default!

  return {
    id: Date.now(),
    role: "assistant" as const,
    content: result.content,
    sources: result.sources,
  }
}

export function FloatingChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [open, setOpen] = useState(false)
  const scrollViewportRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollTop =
        scrollViewportRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = (text?: string) => {
    const msg = text ?? input
    if (!msg.trim() || isStreaming) return

    const userMsg: ChatMessage = {
      id: Date.now(),
      role: "user",
      content: msg,
    }
    setMessages((prev) => [...prev, userMsg])
    if (!text) setInput("")
    setIsStreaming(true)

    const reply = mockReply(msg)
    const words = reply.content.split(" ")

    let i = 0
    const assistantId = Date.now() + 1
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "" },
    ])

    const interval = setInterval(() => {
      if (i < words.length) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content: m.content
                    ? m.content + " " + (words[i] ?? "")
                    : (words[i] ?? ""),
                }
              : m
          )
        )
        i++
      } else {
        clearInterval(interval)
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, sources: reply.sources } : m
          )
        )
        setIsStreaming(false)
      }
    }, 25)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            size="icon"
            className="fixed right-4 bottom-4 z-50 size-12 rounded-full shadow-lg"
          >
            <ChatCircle className="size-5" />
          </Button>
        }
      />
      <SheetContent
        side="right"
        showCloseButton={false}
        className="flex w-full max-w-md flex-col p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                <Sparkle className="size-4 text-primary" weight="fill" />
              </div>
              <div>
                <SheetTitle className="text-sm font-semibold">
                  ShopAI Assistant
                </SheetTitle>
                <p className="text-xs text-muted-foreground">
                  Ask me anything about products, orders, or policies
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setOpen(false)}
            >
              <X className="size-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="flex flex-1 flex-col overflow-hidden">
          <ScrollArea className="flex-1" viewportRef={scrollViewportRef}>
            <div className="space-y-3 p-4">
              {messages.length === 0 && (
                <div className="space-y-3">
                  <p className="text-center text-sm text-muted-foreground">
                    Hi! I&apos;m your AI shopping assistant. How can I help?
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {quickReplies.map((q) => (
                      <Button
                        key={q}
                        variant="outline"
                        size="xs"
                        onClick={() => handleSend(q)}
                      >
                        {q}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${
                    msg.role === "assistant" ? "" : "flex-row-reverse"
                  }`}
                >
                  <Avatar className="size-6 shrink-0">
                    <AvatarFallback className="text-[10px]">
                      {msg.role === "assistant" ? (
                        <Sparkle className="size-2.5" />
                      ) : (
                        <UserCircle className="size-2.5" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={
                      msg.role === "assistant" ? "" : "flex flex-col items-end"
                    }
                  >
                    <div
                      className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                        msg.role === "assistant"
                          ? "bg-muted"
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      <div className="text-xs leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                        {msg.role === "assistant" &&
                          isStreaming &&
                          msg.id === messages[messages.length - 1]?.id && (
                            <span className="ml-0.5 inline-block size-1 animate-pulse rounded-full bg-current align-middle" />
                          )}
                      </div>
                    </div>
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-1.5 space-y-1">
                        {msg.sources.map((src, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-1.5 rounded-lg border bg-muted/50 px-2.5 py-1.5 text-[10px]"
                          >
                            <FileText className="mt-0.5 size-2.5 shrink-0 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{src.title}</p>
                              <p className="text-muted-foreground">
                                {src.excerpt}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="border-t p-3">
            <div className="flex items-end gap-2">
              <Textarea
                placeholder="Ask a question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                rows={2}
                className="min-h-0 resize-none text-sm"
              />
              <Button
                size="icon-sm"
                onClick={() => handleSend()}
                disabled={!input.trim() || isStreaming}
              >
                <PaperPlaneTilt className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
