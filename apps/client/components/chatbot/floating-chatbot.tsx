"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Textarea } from "@workspace/ui/components/textarea"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@workspace/ui/components/sheet"
import {
  ChatCircle,
  PaperPlaneTilt,
  Sparkle,
  User,
  X,
  FileText,
  Truck,
  Package,
  ArrowBendUpLeft,
  Gift,
} from "@phosphor-icons/react"

import { useChat } from "@/hooks/admin/use-chat"

const quickReplies = [
  { icon: Truck, label: "Shipping", prompt: "What's your shipping policy?" },
  { icon: Package, label: "Track order", prompt: "How do I track my order?" },
  { icon: ArrowBendUpLeft, label: "Returns", prompt: "What's your return policy?" },
  { icon: Gift, label: "Gift wrap", prompt: "Do you offer gift wrapping?" },
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
      {/* ── Floating trigger — compact pill ── */}
      <SheetTrigger
        render={
          <button
            className="fixed right-4 bottom-4 z-50 hidden size-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-105 hover:shadow-xl active:scale-95 transition-all duration-200 cursor-pointer md:flex"
            aria-label="Open chat"
          >
            <ChatCircle className="size-4.5" weight="fill" />
          </button>
        }
      />

      <SheetContent
        side="right"
        showCloseButton={false}
        className="flex w-full max-w-95 flex-col p-0 sm:max-w-95 border-l"
      >
        {/* ── Header ── */}
        <div className="shrink-0 border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <Image src="/logo.png" alt="ShopAI" width={32} height={32} className="size-8 rounded-md object-cover" />
                <span className="absolute -right-0.5 -bottom-0.5 flex size-2 rounded-full bg-foreground ring-[1.5px] ring-background" />
              </div>
              <div>
                <p className="text-[13px] font-semibold tracking-tight leading-tight">
                  ShopAI Assistant
                </p>
                <p className="text-[10px] text-muted-foreground font-medium leading-tight">
                  Online · Replies instantly
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          </div>
        </div>

        {/* ── Messages area ── */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <ScrollArea className="min-h-0 flex-1 overflow-hidden" viewportRef={scrollViewportRef}>
            <div className="space-y-3 px-4 py-4">
              {messages.length === 0 && (
                <div className="flex flex-col items-center pt-8 pb-4">
                  {/* Welcome icon */}
                  <Image src="/logo.png" alt="ShopAI" width={48} height={48} className="size-12 rounded-lg object-cover mb-3" />
                  <p className="text-sm font-semibold text-foreground">
                    How can I help?
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 text-center max-w-55 leading-relaxed">
                    Ask me about products, orders, shipping, or anything else.
                  </p>

                  {/* Quick reply grid */}
                  <div className="grid grid-cols-2 gap-1.5 mt-5 w-full max-w-70">
                    {quickReplies.map(({ icon: Icon, label, prompt }) => (
                      <button
                        key={label}
                        onClick={() => handleSend(prompt)}
                        className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-[11px] font-medium text-muted-foreground transition-all duration-150 hover:text-foreground hover:border-foreground/20 hover:bg-muted/30 cursor-pointer text-left"
                      >
                        <Icon className="size-3.5 shrink-0" />
                        <span className="truncate">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg) => {
                const isBot = msg.role === "assistant"
                const isLastBot =
                  isBot && messages[messages.length - 1]?.id === msg.id

                return (
                  <div
                    key={msg.id}
                    className={`flex gap-2 ${isBot ? "" : "flex-row-reverse"}`}
                  >
                    {/* Avatar */}
                    {isBot ? (
                      <Image src="/logo.png" alt="ShopAI" width={24} height={24} className="size-6 rounded-md object-cover mt-0.5 shrink-0" />
                    ) : (
                      <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground mt-0.5">
                        <User className="size-3" weight="bold" />
                      </div>
                    )}

                    {/* Bubble */}
                    <div className={`min-w-0 max-w-[82%] ${isBot ? "" : "flex flex-col items-end"}`}>
                      <div
                        className={`rounded-xl px-3 py-2 text-[13px] leading-relaxed ${
                          isBot
                            ? "rounded-tl-sm bg-muted/50 text-foreground"
                            : "rounded-tr-sm bg-primary text-primary-foreground"
                        }`}
                      >
                        <div className="whitespace-pre-wrap wrap-break-word">
                          {msg.content}
                          {isLastBot && isStreaming && (
                            <span className="ml-1 inline-flex gap-0.5 align-middle">
                              <span className="size-1 rounded-full bg-current animate-bounce [animation-delay:0ms]" />
                              <span className="size-1 rounded-full bg-current animate-bounce [animation-delay:150ms]" />
                              <span className="size-1 rounded-full bg-current animate-bounce [animation-delay:300ms]" />
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Sources */}
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-1.5 space-y-1">
                          {msg.sources.map((src, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-2 rounded-lg border bg-background px-2.5 py-1.5 text-[10px]"
                            >
                              <div className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded bg-muted">
                                <FileText className="size-2.5 text-muted-foreground" />
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

              {/* Streaming indicator when no content yet */}
              {isStreaming && messages.length > 0 && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex gap-2">
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground mt-0.5">
                    <Sparkle className="size-3" weight="fill" />
                  </div>
                  <div className="rounded-xl rounded-tl-sm bg-muted/50 px-3 py-2.5">
                    <span className="inline-flex gap-0.5">
                      <span className="size-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:0ms]" />
                      <span className="size-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:150ms]" />
                      <span className="size-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:300ms]" />
                    </span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* ── Input area ── */}
          <div className="shrink-0 border-t px-3 py-2.5">
            <div className="flex items-end gap-1.5 rounded-xl border bg-muted/20 p-1 transition-all duration-150 focus-within:border-foreground/20 focus-within:bg-background">
              <Textarea
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                rows={1}
                className="min-h-0 flex-1 resize-none border-0 bg-transparent text-[13px] shadow-none ring-0 focus-visible:ring-0 py-1.5 px-2 placeholder:text-muted-foreground/60"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isStreaming}
                aria-label="Send message"
                className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all duration-150 hover:opacity-90 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
              >
                <PaperPlaneTilt className="size-3.5" weight="fill" />
              </button>
            </div>
            <p className="text-center text-[9px] text-muted-foreground/65 mt-1.5 font-medium">
              Powered by ShopAI · May produce inaccurate info
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
