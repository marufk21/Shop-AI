"use client"

import * as React from "react"

export interface CartItem {
  productId: string
  name: string
  price: number
  imageUrl: string | null
  slug: string
  quantity: number
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { productId: string } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem("shopai-cart")
    return stored ? (JSON.parse(stored) as CartItem[]) : []
  } catch {
    return []
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem("shopai-cart", JSON.stringify(items))
  } catch {
    // silently ignore
  }
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(
        (i) => i.productId === action.payload.productId
      )
      let next: CartItem[]
      if (existing) {
        next = state.items.map((i) =>
          i.productId === action.payload.productId
            ? { ...i, quantity: i.quantity + action.payload.quantity }
            : i
        )
      } else {
        next = [...state.items, action.payload]
      }
      saveCart(next)
      return { ...state, items: next, isOpen: true }
    }
    case "REMOVE_ITEM": {
      const next = state.items.filter(
        (i) => i.productId !== action.payload.productId
      )
      saveCart(next)
      return { ...state, items: next }
    }
    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        const next = state.items.filter(
          (i) => i.productId !== action.payload.productId
        )
        saveCart(next)
        return { ...state, items: next }
      }
      const next = state.items.map((i) =>
        i.productId === action.payload.productId
          ? { ...i, quantity: action.payload.quantity }
          : i
      )
      saveCart(next)
      return { ...state, items: next }
    }
    case "CLEAR_CART": {
      saveCart([])
      return { ...state, items: [] }
    }
    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen }
    case "OPEN_CART":
      return { ...state, isOpen: true }
    case "CLOSE_CART":
      return { ...state, isOpen: false }
    default:
      return state
  }
}

interface CartContextValue {
  items: CartItem[]
  isOpen: boolean
  itemCount: number
  subtotal: number
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
}

const CartContext = React.createContext<CartContextValue | null>(null)

export function useCart() {
  const ctx = React.useContext(CartContext)
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return ctx
}

function createInitialState(): CartState {
  return {
    items: loadCart(),
    isOpen: false,
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(cartReducer, null, createInitialState)

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const value: CartContextValue = {
    items: state.items,
    isOpen: state.isOpen,
    itemCount,
    subtotal,
    addItem: (item) => dispatch({ type: "ADD_ITEM", payload: item }),
    removeItem: (productId) =>
      dispatch({ type: "REMOVE_ITEM", payload: { productId } }),
    updateQuantity: (productId, quantity) =>
      dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } }),
    clearCart: () => dispatch({ type: "CLEAR_CART" }),
    toggleCart: () => dispatch({ type: "TOGGLE_CART" }),
    openCart: () => dispatch({ type: "OPEN_CART" }),
    closeCart: () => dispatch({ type: "CLOSE_CART" }),
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
