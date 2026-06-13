"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
import { SidebarProvider } from "@workspace/ui/components/sidebar"
import { ThemeProvider } from "@/components/shared/theme-provider"
import { TooltipProvider } from "@workspace/ui/components/tooltip"
import { Toaster } from "sonner"
import { getQueryClient } from "@/lib/query-client"

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(getQueryClient)

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider delay={300}>
          <SidebarProvider>
            {children}
            <Toaster richColors closeButton />
          </SidebarProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
