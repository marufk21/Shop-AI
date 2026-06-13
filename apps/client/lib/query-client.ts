import { QueryClient } from "@tanstack/react-query"

export const defaultQueryOptions = {
  staleTime: 30_000,
  retry: 1,
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
