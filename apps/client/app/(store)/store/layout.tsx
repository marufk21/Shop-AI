import { StoreNavbar } from "@/components/store/store-navbar"
import { StoreFooter } from "@/components/store/store-footer"
import { ChatbotWrapper } from "@/components/chatbot/chatbot-wrapper"

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-svh flex-col w-full overflow-x-hidden">
      <StoreNavbar />
      <main className="flex-1 w-full scroll-pt-16">
        <div className="mx-auto w-full max-w-7xl px-6">{children}</div>
      </main>
      <ChatbotWrapper />
      <StoreFooter />
    </div>
  )
}