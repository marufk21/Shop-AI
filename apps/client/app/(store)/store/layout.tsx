"use client"

import Link from "next/link"
import { Sparkle, ShoppingCart, UserCircle } from "@phosphor-icons/react"
import { Button } from "@workspace/ui/components/button"
import { ChatbotWrapper } from "@/components/chatbot/chatbot-wrapper"

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-svh flex-col w-full overflow-x-hidden">
      <header className="sticky top-0 z-50 border-b bg-background w-full">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-6">
          <Link
            href="/store"
            className="flex items-center gap-2 font-heading text-lg font-semibold"
          >
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkle className="size-3.5" weight="fill" />
            </div>
            ShopAI
          </Link>
          <nav className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              render={<Link href="/store">Shop</Link>}
            />
            <Button
              variant="ghost"
              size="sm"
              render={<Link href="/store/categories">Categories</Link>}
            />
            <Button
              variant="ghost"
              size="icon-sm"
              render={<ShoppingCart className="size-4" />}
            />
            <Button
              variant="ghost"
              size="icon-sm"
              render={
                <Link href="/store/profile">
                  <UserCircle className="size-4" />
                </Link>
              }
            />
          </nav>
        </div>
      </header>
      <main className="flex-1 w-full">
        <div className="mx-auto w-full max-w-7xl px-6">{children}</div>
      </main>
      <ChatbotWrapper />
      <footer className="border-t bg-muted/40 w-full">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-8 md:flex-row md:justify-between">
          <div className="flex items-center gap-2 font-heading font-semibold">
            <Sparkle className="size-4" />
            ShopAI
          </div>
          <p className="text-sm text-muted-foreground">
            AI-powered e-commerce. Built for modern store owners.
          </p>
        </div>
      </footer>
    </div>
  )
}