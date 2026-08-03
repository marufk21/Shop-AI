import type { Metadata } from "next"
import { Lora, Raleway, Geist_Mono } from "next/font/google"

// Ignore missing type declarations for this side-effect CSS import
// @ts-ignore: Cannot find module or type declarations for side-effect import of CSS
import "@workspace/ui/globals.css"
import { Providers } from "@/lib/providers"
import { cn } from "@workspace/ui/lib/utils"

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
})

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

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
  openGraph: {
    title: "ShopAI - AI-Powered E-Commerce",
    description:
      "AI-first e-commerce platform with product generation, RAG chatbot, and real-time analytics.",
    type: "website",
    siteName: "ShopAI",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShopAI - AI-Powered E-Commerce",
    description:
      "AI-first e-commerce platform with product generation, RAG chatbot, and real-time analytics.",
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
      className={cn(
        lora.variable,
        raleway.variable,
        geistMono.variable,
        "antialiased",
        "font-sans"
      )}
    >
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:shadow-lg focus:outline-none"
        >
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
