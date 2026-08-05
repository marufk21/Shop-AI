import { dehydrate, HydrationBoundary } from "@tanstack/react-query"

import { StoreNavbar } from "@/components/store/store-navbar"
import { StoreFooter } from "@/components/store/store-footer"
import { StickyCategoryBar } from "@/components/store/sticky-category-bar"
import { MobileBottomBar } from "@/components/store/mobile-bottom-bar"
import { ChatbotWrapper } from "@/components/chatbot/chatbot-wrapper"
import { CartProvider } from "@/components/store/cart-provider"
import { CartDrawer } from "@/components/store/cart-drawer-loader"
import { CookieConsent } from "@/components/shared/cookie-consent"
import { BackToTop } from "@/components/shared/back-to-top"
import { storeProductKeys } from "@/hooks/store/use-products"
import { getQueryClient } from "@/lib/query-client"
import { fetchStoreCategories } from "@/server/store/product-fetchers"

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const queryClient = getQueryClient()

  try {
    await queryClient.prefetchQuery({
      queryKey: storeProductKeys.categories(),
      queryFn: fetchStoreCategories,
    })
  } catch {
    // Prefetch failed — client hooks will fetch on mount.
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
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
    </HydrationBoundary>
  )
}
