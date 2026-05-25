import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  deleteDocument,
  fetchDocuments,
  uploadDocument,
} from "@/server/admin/document-fetchers"

export const documentKeys = {
  all: ["admin-documents"] as const,
}

export function useDocuments(skip: number = 0, limit: number = 20) {
  return useQuery({
    queryKey: [...documentKeys.all, { skip, limit }],
    queryFn: () => fetchDocuments(skip, limit),
    refetchInterval: (query) => {
      const docs = query.state.data?.items
      if (!docs) return 0
      const hasPending = docs.some(
        (d) => d.status === "uploading" || d.status === "processing"
      )
      return hasPending ? 3000 : 0
    },
  })
}

export function useUploadDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (file: File) => uploadDocument(file),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: documentKeys.all })
    },
  })
}

export function useDeleteDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (documentId: string) => deleteDocument(documentId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: documentKeys.all })
    },
  })
}
