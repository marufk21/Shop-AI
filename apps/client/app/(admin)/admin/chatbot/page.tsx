"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@workspace/ui/components/button"
import { Textarea } from "@workspace/ui/components/textarea"
import { Badge } from "@workspace/ui/components/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { Switch } from "@workspace/ui/components/switch"
import { Label } from "@workspace/ui/components/label"
import { Separator } from "@workspace/ui/components/separator"
import {
  PaperPlaneTilt,
  Sparkle,
  UserCircle,
  FileText,
  Gear,
  Brain,
  Database,
} from "@phosphor-icons/react"

type Message = {
  id: number
  role: "user" | "assistant"
  content: string
  sources?: { title: string; excerpt: string }[]
  timestamp: string
}

const mockResponses = [
  {
    content:
      "Based on our shipping policy, we offer free standard shipping on all orders over $50. Standard delivery takes 3-5 business days. Express shipping is available for an additional $12.99 and delivers within 1-2 business days.\n\nAll orders are processed within 24 hours and you'll receive a tracking number via email once your order ships.",
    sources: [
      {
        title: "Shipping Policy",
        excerpt: "Section 2.1: Free standard shipping on orders over $50...",
      },
      {
        title: "Delivery Timeframes",
        excerpt: "Standard: 3-5 business days, Express: 1-2 business days...",
      },
    ],
  },
  {
    content:
      "I'd recommend checking out our top-rated products:\n\n1. **Minimal Desk Lamp** ($89) - Best-selling desk accessory with 4.8 stars\n2. **Leather Notebook** ($34) - Premium quality, 200 pages, 4.7 stars\n3. **Mechanical Keyboard** ($149) - RGB backlit, Cherry MX switches, 4.9 stars\n\nWould you like more details on any of these?",
  },
  {
    content:
      "You can return most items within 30 days of delivery for a full refund. Items must be in their original condition and packaging. Return shipping is free for defective or incorrect items.\n\nTo initiate a return, go to your Orders page, select the item, and click 'Return'. You'll receive a prepaid return label via email.",
    sources: [
      {
        title: "Return Policy",
        excerpt:
          "30-day return window from delivery date. Items must be in original condition...",
      },
    ],
  },
]

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [ragEnabled, setRagEnabled] = useState(true)
  const [modelTemp, setModelTemp] = useState(0.7)
  const scrollViewportRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollTop =
        scrollViewportRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = () => {
    if (!input.trim() || isStreaming) return

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsStreaming(true)

    const idx = Math.floor(Math.random() * mockResponses.length)
    const response = mockResponses[idx]!

    const words = response.content.split(" ")
    let i = 0
    const assistantId = Date.now() + 1
    setMessages((prev) => [
      ...prev,
      {
        id: assistantId,
        role: "assistant",
        content: "",
        timestamp: new Date().toLocaleTimeString(),
      },
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
            m.id === assistantId ? { ...m, sources: response.sources } : m
          )
        )
        setIsStreaming(false)
      }
    }, 25)
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Chatbot</h1>
          <p className="text-sm text-muted-foreground">
            Test and configure your AI customer support chatbot.
          </p>
        </div>
        <Badge
          variant={ragEnabled ? "default" : "secondary"}
          className="gap-1.5"
        >
          <Brain className="size-3" />
          RAG {ragEnabled ? "Active" : "Disabled"}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <Card className="flex flex-col lg:col-span-3">
          <CardHeader className="border-b pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Sparkle className="size-4 text-primary" />
              Test Conversation
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col p-0">
            <ScrollArea className="flex-1" viewportRef={scrollViewportRef}>
              <div className="space-y-4 p-4">
                {messages.length === 0 ? (
                  <div className="py-16 text-center">
                    <Sparkle className="mx-auto size-8 text-muted-foreground" />
                    <p className="mt-3 text-sm text-muted-foreground">
                      Start a conversation to test the chatbot.
                    </p>
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                      {[
                        "What's your shipping policy?",
                        "Recommend some products",
                        "How do I return an item?",
                      ].map((q) => (
                        <Button
                          key={q}
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setInput(q)
                          }}
                        >
                          {q}
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${
                        msg.role === "assistant" ? "" : "flex-row-reverse"
                      }`}
                    >
                      <Avatar className="size-7 shrink-0">
                        <AvatarFallback className="text-xs">
                          {msg.role === "assistant" ? (
                            <Sparkle className="size-3" />
                          ) : (
                            <UserCircle className="size-3" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`max-w-[80%] space-y-2 ${
                          msg.role === "assistant"
                            ? ""
                            : "flex flex-col items-end"
                        }`}
                      >
                        <div
                          className={`rounded-xl px-3.5 py-2.5 text-sm ${
                            msg.role === "assistant"
                              ? "bg-muted"
                              : "bg-primary text-primary-foreground"
                          }`}
                        >
                          <div className="leading-relaxed whitespace-pre-wrap">
                            {msg.content}
                            {msg.role === "assistant" &&
                              isStreaming &&
                              msg.id === messages[messages.length - 1]?.id && (
                                <span className="ml-0.5 inline-block size-1.5 animate-pulse rounded-full bg-current align-middle" />
                              )}
                          </div>
                        </div>

                        {msg.sources && msg.sources.length > 0 && (
                          <div className="space-y-1.5">
                            {msg.sources.map((src, i) => (
                              <div
                                key={i}
                                className="flex items-start gap-2 rounded-lg border bg-muted/50 px-3 py-2 text-xs"
                              >
                                <FileText className="mt-0.5 size-3 shrink-0 text-muted-foreground" />
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

                        <span className="text-[10px] text-muted-foreground">
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            <div className="border-t p-3">
              <div className="flex items-end gap-2">
                <Textarea
                  placeholder="Type a test message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSend()
                    }
                  }}
                  rows={2}
                  className="min-h-0 resize-none"
                />
                <Button
                  size="icon"
                  onClick={handleSend}
                  disabled={!input.trim() || isStreaming}
                >
                  <PaperPlaneTilt className="size-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Gear className="size-4" />
                Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">RAG Retrieval</Label>
                  <p className="text-xs text-muted-foreground">
                    Use document context
                  </p>
                </div>
                <Switch checked={ragEnabled} onCheckedChange={setRagEnabled} />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label className="text-sm">Temperature: {modelTemp}</Label>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={modelTemp}
                  onChange={(e) => setModelTemp(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Precise</span>
                  <span>Creative</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Database className="size-4" />
                Document Sources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { name: "Shipping Policy", chunks: 12, status: "indexed" },
                { name: "Return Policy", chunks: 8, status: "indexed" },
                { name: "FAQ Database", chunks: 24, status: "indexed" },
                { name: "Product Manual", chunks: 15, status: "processing" },
              ].map((doc) => (
                <div
                  key={doc.name}
                  className="flex items-center justify-between rounded-lg border p-2.5"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <FileText className="size-3.5 shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium">{doc.name}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {doc.chunks} chunks
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={doc.status === "indexed" ? "default" : "secondary"}
                    className="text-[10px]"
                  >
                    {doc.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
