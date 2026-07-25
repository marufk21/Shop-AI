import { StoreNavbar } from "@/components/store/store-navbar"
import { StoreFooter } from "@/components/store/store-footer"
import { AnnouncementBar } from "@/components/store/announcement-bar"
import { StickyCategoryBar } from "@/components/store/sticky-category-bar"
import { MobileBottomBar } from "@/components/store/mobile-bottom-bar"
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
      <AnnouncementBar />
      <div className="flex min-h-svh flex-col w-full">
        <StoreNavbar />
        <StickyCategoryBar />
        <main className="flex-1 w-full overflow-x-hidden">{children}</main>
        <ChatbotWrapper />
        <StoreFooter />
        <CartDrawer />
      </div>
      <MobileBottomBar />
    </CartProvider>
  )
}
