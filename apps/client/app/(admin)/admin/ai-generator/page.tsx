"use client"

import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Textarea } from "@workspace/ui/components/textarea"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import {
  Sparkle,
  Copy,
  ArrowCounterClockwise,
  Check,
  ClockCounterClockwise,
  Lightning,
} from "@phosphor-icons/react"

type ContentType =
  | "seo-title"
  | "description"
  | "ad-copy"
  | "caption"
  | "highlights"
  | "meta"

type Generation = {
  id: number
  type: ContentType
  product: string
  result: string
  timestamp: string
}

const contentTypeLabel: Record<ContentType, string> = {
  "seo-title": "SEO Title",
  description: "Product Description",
  "ad-copy": "Ad Copy",
  caption: "Social Caption",
  highlights: "Key Highlights",
  meta: "Meta Description",
}

const placeholder: Record<ContentType, string> = {
  "seo-title": "Enter product name for SEO title generation...",
  description: "Describe your product for description generation...",
  "ad-copy": "Enter product details for ad copy generation...",
  caption: "Enter product details for social media captions...",
  highlights: "Enter product details for key highlights extraction...",
  meta: "Describe your product for meta description generation...",
}

const mockResults: Record<ContentType, string> = {
  "seo-title":
    "Minimal Desk Lamp - Premium Adjustable LED Desk Lighting | ShopAI",
  description:
    "Elevate your workspace with the Minimal Desk Lamp, designed for the modern professional. Featuring adjustable brightness levels, a sleek aluminum body, and energy-efficient LED technology, this lamp provides the perfect lighting for any task. Its minimalist design complements any desk setup while reducing eye strain during long work sessions.",
  "ad-copy":
    "Light up your workspace in style. The Minimal Desk Lamp combines sleek design with powerful LED illumination. Adjustable brightness. Eye-friendly. Elevate your desk today.",
  caption:
    "Minimal design, maximum focus. Our new Desk Lamp transforms any workspace into a productivity haven. #WorkspaceGoals #MinimalDesign #ShopAI",
  highlights:
    "- Adjustable LED brightness with 5 levels\n- Sleek aluminum body with matte finish\n- Energy-efficient, 50,000-hour lifespan\n- USB-C charging port built into base\n- Touch-sensitive controls\n- 360-degree adjustable arm",
  meta: "Shop the Minimal Desk Lamp at ShopAI. Premium LED desk lighting with adjustable brightness and modern design. Free shipping on orders over $50.",
}

export default function AIGeneratorPage() {
  const [contentType, setContentType] = useState<ContentType>("description")
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generated, setGenerated] = useState("")
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState<Generation[]>([])

  const handleGenerate = () => {
    if (!prompt.trim()) return
    setIsGenerating(true)
    setGenerated("")

    const words = mockResults[contentType].split(" ")
    let i = 0
    const interval = setInterval(() => {
      if (i < words.length) {
        setGenerated((prev) =>
          prev ? prev + " " + (words[i] ?? "") : (words[i] ?? "")
        )
        i++
      } else {
        clearInterval(interval)
        setIsGenerating(false)
        const newGen: Generation = {
          id: Date.now(),
          type: contentType,
          product: prompt,
          result: mockResults[contentType],
          timestamp: new Date().toLocaleTimeString(),
        }
        setHistory((prev) => [newGen, ...prev])
      }
    }, 40)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generated)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold">AI Generator</h1>
          <p className="text-sm text-muted-foreground">
            Generate SEO-optimized product content with AI.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="space-y-6 lg:col-span-3">
          <Tabs
            value={contentType}
            onValueChange={(v) => setContentType(v as ContentType)}
          >
            <TabsList className="w-full justify-start overflow-auto">
              {Object.entries(contentTypeLabel).map(([key, label]) => (
                <TabsTrigger key={key} value={key} className="text-xs">
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Textarea
                  placeholder={placeholder[contentType]}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || isGenerating}
                  >
                    <Sparkle className="mr-1.5 size-3.5" />
                    {isGenerating ? "Generating..." : "Generate"}
                  </Button>
                  <Button
                    variant="outline"
                    disabled={!prompt.trim()}
                    onClick={() => setPrompt("")}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {(generated || isGenerating) && (
            <Card>
              <CardContent className="pt-6">
                <div className="mb-3 flex items-center justify-between">
                  <Badge variant="secondary">
                    {contentTypeLabel[contentType]}
                  </Badge>
                  {!isGenerating && generated && (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={handleCopy}
                      >
                        {copied ? (
                          <Check className="size-3.5 text-green-500" />
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={handleGenerate}
                      >
                        <ArrowCounterClockwise className="size-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {isGenerating && !generated ? (
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-5/6" />
                      <Skeleton className="h-3 w-4/6" />
                    </div>
                  ) : (
                    generated
                  )}
                  {isGenerating && generated && (
                    <span className="ml-0.5 inline-block size-1.5 animate-pulse rounded-full bg-primary align-middle" />
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4 flex items-center gap-2">
                <ClockCounterClockwise className="size-4" />
                <h3 className="text-sm font-medium">History</h3>
              </div>
              <ScrollArea className="h-100">
                {history.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    No generations yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {history.map((item) => (
                      <button
                        key={item.id}
                        className="w-full rounded-lg p-2 text-left transition-colors hover:bg-muted"
                        onClick={() => {
                          setContentType(item.type)
                          setPrompt(item.product)
                          setGenerated(item.result)
                        }}
                      >
                        <div className="flex items-center gap-1.5">
                          <Lightning className="size-3 text-primary" />
                          <span className="text-xs font-medium">
                            {contentTypeLabel[item.type]}
                          </span>
                        </div>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {item.product}
                        </p>
                        <p className="mt-1 text-[10px] text-muted-foreground">
                          {item.timestamp}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
