const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

/**
 * Shared Intl.NumberFormat instance for USD currency formatting.
 * Creating Intl.NumberFormat is expensive (~0.5ms per instantiation).
 * Use this singleton instead of creating new instances per component render.
 */
export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount)
}
