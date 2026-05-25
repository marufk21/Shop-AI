"use client"

import { useRef, useState } from "react"
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

import {
  useDeleteDocument,
  useDocuments,
  useUploadDocument,
} from "@/hooks/admin/use-documents"
import type { DocumentType } from "@/types/document"

const typeIcon: Record<DocumentType, typeof FileText> = {
  pdf: FilePdf,
  csv: FileCsv,
  txt: FileText,
  md: FileText,
}

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${bytes} B`
}

export default function DocumentsPage() {
  const [search, setSearch] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data, isLoading } = useDocuments()
  const uploadMutation = useUploadDocument()
  const deleteMutation = useDeleteDocument()

  const docs = data?.items ?? []
  const filtered = docs.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  )
  const totalChunks = docs.reduce((sum, d) => sum + d.chunk_count, 0)
  const indexedDocs = docs.filter((d) => d.status === "indexed").length

  const handleFile = (file: File) => {
    uploadMutation.mutate(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id)
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
            <div className="text-2xl font-bold">
              {isLoading ? "-" : docs.length}
            </div>
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
            <div className="text-2xl font-bold">
              {isLoading ? "-" : totalChunks}
            </div>
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
              {isLoading ? "-" : `${indexedDocs}/${docs.length}`}
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
            onDrop={handleDrop}
          >
            <Upload className="size-8 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium">Drag and drop files here</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Support PDF, CSV, TXT, and Markdown files
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.csv,.txt,.md"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFile(file)
              }}
            />
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              disabled={uploadMutation.isPending}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-1.5 size-3.5" />
              {uploadMutation.isPending ? "Uploading..." : "Browse Files"}
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
          {isLoading ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Loading documents...
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              {docs.length === 0
                ? "No documents uploaded yet."
                : "No documents match your search."}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((doc) => {
                const Icon = typeIcon[doc.file_type]
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
                        <p className="truncate text-sm font-medium">
                          {doc.name}
                        </p>
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
                        <span>{formatSize(doc.size_bytes)}</span>
                        <span>{doc.chunk_count} chunks</span>
                        <span>
                          {new Date(doc.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {doc.status === "processing" && (
                        <div className="mt-2">
                          <Progress value={50} className="h-1" />
                        </div>
                      )}
                      {doc.status === "error" && doc.error_message && (
                        <p className="mt-1 text-xs text-destructive">
                          {doc.error_message}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      disabled={deleteMutation.isPending}
                      onClick={() => handleDelete(doc.id)}
                    >
                      <Trash className="size-3.5 text-muted-foreground" />
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
