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

import { useChat } from "@/hooks/admin/use-chat"

const quickReplies = [
  "What's your shipping policy?",
  "How do I track my order?",
  "What's your return policy?",
  "Do you offer gift wrapping?",
]

export function FloatingChatbot() {
  const { messages, isStreaming, sendMessage } = useChat()
  const [input, setInput] = useState("")
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
    sendMessage(msg)
    if (!text) setInput("")
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

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <ScrollArea className="min-h-0 flex-1 overflow-hidden" viewportRef={scrollViewportRef}>
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
                      msg.role === "assistant"
                        ? ""
                        : "flex flex-col items-end"
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
                        {msg.role === "assistant" && isStreaming && (
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
