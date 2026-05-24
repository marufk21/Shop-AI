"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@workspace/ui/components/tooltip"
import { SidebarProvider } from "@workspace/ui/components/sidebar"
import { Toaster } from "sonner"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <TooltipProvider delay={300}>
        <SidebarProvider>
          {children}
          <Toaster richColors closeButton />
        </SidebarProvider>
      </TooltipProvider>
    </ThemeProvider>
  )
}
