import { QueryClient } from "@tanstack/react-query"

export const defaultQueryOptions = {
  staleTime: 2 * 60 * 1000,       // 2 minutes (was 30s — catalog data changes rarely)
  gcTime: 10 * 60 * 1000,         // 10 minutes (was default 5 min)
  retry: 1,
  refetchOnWindowFocus: false,     // catalog data doesn't need refetch on tab focus
} as const

let queryClient: QueryClient | undefined

export function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient()
  }
  // Browser: make a new query client if one doesn't already exist
  if (!queryClient) {
    queryClient = makeQueryClient()
  }
  return queryClient
}

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: defaultQueryOptions,
    },
  })
}
