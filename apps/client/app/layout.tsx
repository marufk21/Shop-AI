import type { Metadata } from "next"

// Ignore missing type declarations for this side-effect CSS import
// @ts-ignore: Cannot find module or type declarations for side-effect import of CSS
import "@workspace/ui/globals.css"
import { Providers } from "@/lib/providers"
import { cn } from "@workspace/ui/lib/utils"

export const metadata: Metadata = {
  title: {
    template: "%s | ShopAI",
    default: "ShopAI - AI-Powered E-Commerce",
  },
  description:
    "AI-first e-commerce platform with product generation, RAG chatbot, and real-time analytics.",
  icons: {
    icon: "/logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      style={
        {
          "--font-sans": '"Helvetica Now Text", Helvetica, Arial, sans-serif',
          "--font-heading": '"Helvetica Now Text", Helvetica, Arial, sans-serif',
          "--font-mono": '"SF Mono", "Cascadia Code", "Fira Code", monospace',
        } as React.CSSProperties
      }
      className={cn("antialiased", "font-sans")}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
