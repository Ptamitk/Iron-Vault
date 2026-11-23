import { createSlice } from '@reduxjs/toolkit'
import { store as shopConfig } from '../../config/store.js'

const STORAGE_KEY = 'iv-cart-v1'

function readCart() {
  if (typeof window === 'undefined') return []
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(parsed)
      ? parsed.filter((line) => line && typeof line.id === 'string' && Number.isFinite(Number(line.qty))).map((line) => ({ ...line, qty: Math.min(shopConfig.maxQtyPerItem, Math.max(1, Math.floor(Number(line.qty)))) }))
      : []
  } catch {
    return []
  }
}

const initialState = { lines: readCart() }

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const { id, flavour = null, size = null, qty = 1 } = action.payload
      const amount = Math.min(shopConfig.maxQtyPerItem, Math.max(1, Math.floor(Number(qty) || 1)))
      const existing = state.lines.find((line) => line.id === id && (line.flavour || null) === flavour && (line.size || null) === size)
      if (existing) existing.qty = Math.min(shopConfig.maxQtyPerItem, existing.qty + amount)
      else state.lines.push({ id, flavour, size, qty: amount })
    },
    setCartQuantity(state, action) {
      const { key, qty } = action.payload
      const line = state.lines.find((item) => [item.id, item.flavour || '', item.size || ''].join('|') === key)
      if (!line) return
      const amount = Math.floor(Number(qty) || 0)
      if (amount <= 0) state.lines = state.lines.filter((item) => item !== line)
      else line.qty = Math.min(shopConfig.maxQtyPerItem, amount)
    },
    removeFromCart(state, action) {
      state.lines = state.lines.filter((line) => [line.id, line.flavour || '', line.size || ''].join('|') !== action.payload)
    },
    clearCart(state) {
      state.lines = []
    },
    hydrateCart(state, action) {
      state.lines = Array.isArray(action.payload) ? action.payload : []
    },
  },
})

export const { addToCart, setCartQuantity, removeFromCart, clearCart, hydrateCart } = cartSlice.actions
export const selectCartLines = (state) => state.cart.lines
export default cartSlice.reducer
