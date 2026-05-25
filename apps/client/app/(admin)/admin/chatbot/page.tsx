"use client"

import { useRef, useState } from "react"
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
} from "@phosphor-icons/react"

import { useChat } from "@/hooks/admin/use-chat"

export default function ChatbotPage() {
  const { messages, isStreaming, sendMessage, clearMessages } = useChat()
  const [input, setInput] = useState("")
  const [ragEnabled, setRagEnabled] = useState(true)
  const [modelTemp, setModelTemp] = useState(0.7)
  const scrollViewportRef = useRef<HTMLDivElement>(null)

  const handleSend = () => {
    if (!input.trim() || isStreaming) return
    sendMessage(input, {
      temperature: modelTemp,
      useRag: ragEnabled,
    })
    setInput("")

    requestAnimationFrame(() => {
      if (scrollViewportRef.current) {
        scrollViewportRef.current.scrollTop =
          scrollViewportRef.current.scrollHeight
      }
    })
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
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={clearMessages}>
            Clear Chat
          </Button>
          <Badge
            variant={ragEnabled ? "default" : "secondary"}
            className="gap-1.5"
          >
            <Brain className="size-3" />
            RAG {ragEnabled ? "Active" : "Disabled"}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <Card className="flex h-[calc(100vh-9rem)] flex-col overflow-hidden lg:col-span-3">
          <CardHeader className="shrink-0 border-b pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Sparkle className="size-4 text-primary" />
              Test Conversation
            </CardTitle>
          </CardHeader>
          <CardContent className="flex min-h-0 flex-1 flex-col p-0">
            <ScrollArea className="min-h-0 flex-1 overflow-hidden" viewportRef={scrollViewportRef}>
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
                          onClick={() => setInput(q)}
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
                        className={
                          msg.role === "assistant"
                            ? "max-w-[80%] space-y-2"
                            : "max-w-[80%] flex flex-col items-end space-y-2"
                        }
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
                            {msg.role === "assistant" && isStreaming && (
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
                                  <p className="font-medium">
                                    {src.document_name}
                                  </p>
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

            <div className="shrink-0 border-t p-3">
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
        </div>
      </div>
    </>
  )
}
