import { StoreNavbar } from "@/components/store/store-navbar"
import { StoreFooter } from "@/components/store/store-footer"
import { StickyCategoryBar } from "@/components/store/sticky-category-bar"
import { MobileBottomBar } from "@/components/store/mobile-bottom-bar"
import { ChatbotWrapper } from "@/components/chatbot/chatbot-wrapper"
import { CartProvider } from "@/components/store/cart-provider"
import { CartDrawer } from "@/components/store/cart-drawer-loader"
import { CookieConsent } from "@/components/shared/cookie-consent"
import { BackToTop } from "@/components/shared/back-to-top"

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CartProvider>
      <div className="flex min-h-svh flex-col w-full">
        <StoreNavbar />
        <StickyCategoryBar />
        <main id="main-content" className="flex-1 w-full overflow-x-hidden">{children}</main>
        <ChatbotWrapper />
        <StoreFooter />
        <CartDrawer />
        <CookieConsent />
        <BackToTop />
      </div>
      <MobileBottomBar />
    </CartProvider>
  )
}
