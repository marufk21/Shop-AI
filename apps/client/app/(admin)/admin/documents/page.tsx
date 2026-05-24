"use client"

import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Progress } from "@workspace/ui/components/progress"
import {
  Upload,
  FileText,
  FilePdf,
  FileCsv,
  Trash,
  MagnifyingGlass,
  CheckCircle,
  Spinner,
  Sparkle,
  Books,
} from "@phosphor-icons/react"

type Document = {
  id: number
  name: string
  type: "pdf" | "csv" | "txt" | "md"
  size: string
  chunks: number
  status: "indexed" | "processing" | "error" | "uploading"
  progress: number
  uploadedAt: string
}

const typeIcon = {
  pdf: FilePdf,
  csv: FileCsv,
  txt: FileText,
  md: FileText,
}

const initialDocs: Document[] = [
  {
    id: 1,
    name: "Shipping Policy v2.pdf",
    type: "pdf",
    size: "245 KB",
    chunks: 12,
    status: "indexed",
    progress: 100,
    uploadedAt: "2026-05-20",
  },
  {
    id: 2,
    name: "Return & Refund Policy.pdf",
    type: "pdf",
    size: "180 KB",
    chunks: 8,
    status: "indexed",
    progress: 100,
    uploadedAt: "2026-05-19",
  },
  {
    id: 3,
    name: "Product FAQ Database.csv",
    type: "csv",
    size: "512 KB",
    chunks: 24,
    status: "indexed",
    progress: 100,
    uploadedAt: "2026-05-18",
  },
  {
    id: 4,
    name: "Brand Voice Guidelines.md",
    type: "md",
    size: "32 KB",
    chunks: 5,
    status: "indexed",
    progress: 100,
    uploadedAt: "2026-05-17",
  },
  {
    id: 5,
    name: "Summer Collection Manual.pdf",
    type: "pdf",
    size: "1.2 MB",
    chunks: 15,
    status: "processing",
    progress: 62,
    uploadedAt: "2026-05-24",
  },
  {
    id: 6,
    name: "Customer Support Scripts.txt",
    type: "txt",
    size: "89 KB",
    chunks: 18,
    status: "processing",
    progress: 38,
    uploadedAt: "2026-05-24",
  },
]

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Document[]>(initialDocs)
  const [search, setSearch] = useState("")
  const [isDragging, setIsDragging] = useState(false)

  const filtered = docs.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  )

  const totalChunks = docs.reduce((sum, d) => sum + d.chunks, 0)
  const indexedDocs = docs.filter((d) => d.status === "indexed").length

  const handleDelete = (id: number) => {
    setDocs((prev) => prev.filter((d) => d.id !== id))
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Documents</h1>
          <p className="text-sm text-muted-foreground">
            Upload and manage documents for RAG-powered AI responses.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Documents
            </CardTitle>
            <Books className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{docs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Chunks
            </CardTitle>
            <Sparkle className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalChunks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Indexed
            </CardTitle>
            <CheckCircle className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {indexedDocs}/{docs.length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div
            className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-colors ${
              isDragging ? "border-primary bg-primary/5" : ""
            }`}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setIsDragging(false)
            }}
          >
            <Upload className="size-8 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium">Drag and drop files here</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Support PDF, CSV, TXT, and Markdown files
            </p>
            <Button variant="outline" size="sm" className="mt-4">
              <Upload className="mr-1.5 size-3.5" />
              Browse Files
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Uploaded Documents
            </CardTitle>
            <div className="relative">
              <MagnifyingGlass className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Search documents..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 w-56 rounded-md border border-input bg-transparent pr-3 pl-9 text-xs outline-none focus:border-ring"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filtered.map((doc) => {
              const Icon = typeIcon[doc.type]
              return (
                <div
                  key={doc.id}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                    <Icon className="size-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium">{doc.name}</p>
                      <Badge
                        variant={
                          doc.status === "indexed"
                            ? "default"
                            : doc.status === "error"
                              ? "destructive"
                              : "secondary"
                        }
                        className="text-[10px]"
                      >
                        {doc.status === "processing" ? (
                          <Spinner className="mr-1 size-2.5 animate-spin" />
                        ) : null}
                        {doc.status}
                      </Badge>
                    </div>
                    <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{doc.size}</span>
                      <span>{doc.chunks} chunks</span>
                      <span>{doc.uploadedAt}</span>
                    </div>
                    {doc.status === "processing" && (
                      <div className="mt-2">
                        <Progress value={doc.progress} className="h-1" />
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => handleDelete(doc.id)}
                  >
                    <Trash className="size-3.5 text-muted-foreground" />
                  </Button>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </>
  )
}
