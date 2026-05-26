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
  Question,
  Truck,
  Package,
  Gift,
} from "@phosphor-icons/react"

import { useChat } from "@/hooks/admin/use-chat"

const quickReplies = [
  { icon: Truck, label: "Shipping policy", prompt: "What's your shipping policy?" },
  { icon: Package, label: "Track my order", prompt: "How do I track my order?" },
  { icon: Question, label: "Return policy", prompt: "What's your return policy?" },
  { icon: Gift, label: "Gift wrapping", prompt: "Do you offer gift wrapping?" },
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
            className="fixed right-5 bottom-5 z-50 size-14 rounded-2xl shadow-lg shadow-primary/20 bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/25 hover:scale-105 transition-all duration-300"
          >
            <ChatCircle className="size-6" weight="fill" />
          </Button>
        }
      />
      <SheetContent
        side="right"
        showCloseButton={false}
        className="flex w-full max-w-md flex-col p-0 sm:max-w-md"
      >
        {/* Header */}
        <div className="relative shrink-0 border-b bg-linear-to-b from-muted/30 to-background px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                  <Sparkle className="size-5 text-primary" weight="fill" />
                </div>
                <span className="absolute -right-0.5 -top-0.5 flex size-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
              </div>
              <div>
                <SheetTitle className="text-sm font-bold tracking-tight">
                  ShopAI Assistant
                </SheetTitle>
                <p className="text-[11px] text-muted-foreground font-medium">
                  Online — replies instantly
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setOpen(false)}
              className="rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-linear-to-b from-transparent via-muted/10 to-transparent">
          <ScrollArea className="min-h-0 flex-1 overflow-hidden" viewportRef={scrollViewportRef}>
            <div className="space-y-4 px-4 py-5">
              {messages.length === 0 && (
                <div className="space-y-5">
                  <div className="flex items-start gap-3">
                    <Avatar className="size-8 shrink-0 ring-2 ring-primary/10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        <Sparkle className="size-4" weight="fill" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-3 pt-0.5">
                      <div className="rounded-2xl rounded-tl-md bg-muted/60 px-4 py-2.5 text-sm leading-relaxed shadow-xs">
                        <p>Hi there! I&apos;m your AI shopping assistant. How can I help you today?</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {quickReplies.map(({ icon: Icon, label, prompt }) => (
                          <button
                            key={label}
                            onClick={() => handleSend(prompt)}
                            className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-xs transition-all duration-200 hover:text-foreground hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm cursor-pointer"
                          >
                            <Icon className="size-3" />
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {messages.map((msg) => {
                const isAssistant = msg.role === "assistant"
                const isLastAssistant =
                  isAssistant &&
                  messages[messages.length - 1]?.id === msg.id

                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${
                      isAssistant ? "" : "flex-row-reverse"
                    }`}
                  >
                    <Avatar
                      className={`size-8 shrink-0 ${
                        isAssistant
                          ? "ring-2 ring-primary/10"
                          : "ring-2 ring-primary/20"
                      }`}
                    >
                      <AvatarFallback
                        className={
                          isAssistant
                            ? "bg-primary/10 text-primary"
                            : "bg-primary text-primary-foreground"
                        }
                      >
                        {isAssistant ? (
                          <Sparkle className="size-3.5" weight="fill" />
                        ) : (
                          <UserCircle className="size-3.5" weight="fill" />
                        )}
                      </AvatarFallback>
                    </Avatar>

                    <div
                      className={`min-w-0 flex-1 ${
                        isAssistant ? "" : "flex flex-col items-end"
                      }`}
                    >
                      <div
                        className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-xs ${
                          isAssistant
                            ? "rounded-tl-md bg-muted/60"
                            : "rounded-tr-md bg-primary text-primary-foreground"
                        }`}
                      >
                        <div className="whitespace-pre-wrap wrap-break-word">
                          {msg.content}
                          {isLastAssistant && isStreaming && (
                            <span className="ml-0.5 inline-block size-1.5 animate-pulse rounded-full bg-current align-middle" />
                          )}
                        </div>
                      </div>

                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-2 space-y-1.5">
                          {msg.sources.map((src, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-2 rounded-xl border bg-background/80 px-3 py-2 text-[11px] shadow-xs backdrop-blur-sm"
                            >
                              <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-primary/10">
                                <FileText className="size-2.5 text-primary" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-foreground truncate">
                                  {src.document_name}
                                </p>
                                <p className="text-muted-foreground line-clamp-2 leading-relaxed mt-0.5">
                                  {src.excerpt}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="shrink-0 border-t bg-background/80 backdrop-blur-sm px-4 py-3">
            <div className="flex items-end gap-2 rounded-2xl border bg-muted/30 p-1.5 shadow-xs transition-all duration-200 focus-within:border-primary/40 focus-within:bg-background focus-within:shadow-sm">
              <Textarea
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                rows={1}
                className="min-h-0 flex-1 resize-none border-0 bg-transparent text-sm shadow-none ring-0 focus-visible:ring-0 py-1.5 placeholder:text-muted-foreground/50"
              />
              <Button
                size="icon-xs"
                onClick={() => handleSend()}
                disabled={!input.trim() || isStreaming}
                className="size-8 shrink-0 rounded-xl bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md disabled:opacity-30 transition-all duration-200"
              >
                <PaperPlaneTilt className="size-3.5" weight="fill" />
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
