import { StoreNavbar } from "@/components/store/store-navbar"
import { StoreFooter } from "@/components/store/store-footer"
import { ChatbotWrapper } from "@/components/chatbot/chatbot-wrapper"
import { CartProvider } from "@/components/store/cart-provider"
import { CartDrawer } from "@/components/store/cart-drawer"

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CartProvider>
      <div className="flex min-h-svh flex-col w-full overflow-x-hidden">
        <StoreNavbar />
        <main className="flex-1 w-full">{children}</main>
        <ChatbotWrapper />
        <StoreFooter />
        <CartDrawer />
      </div>
    </CartProvider>
  )
}
