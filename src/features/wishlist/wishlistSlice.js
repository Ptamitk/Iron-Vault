import { createSlice } from '@reduxjs/toolkit'

const STORAGE_KEY = 'iv-wishlist-v1'
function readWishlist() {
  if (typeof window === 'undefined') return []
  try {
    const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(value) ? value.filter((id) => typeof id === 'string') : []
  } catch {
    return []
  }
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { ids: readWishlist() },
  reducers: {
    toggleWishlist(state, action) {
      const id = action.payload
      state.ids = state.ids.includes(id) ? state.ids.filter((item) => item !== id) : [...state.ids, id]
    },
    clearWishlist(state) {
      state.ids = []
    },
  },
})

export const { toggleWishlist, clearWishlist } = wishlistSlice.actions
export const selectWishlistIds = (state) => state.wishlist.ids
export default wishlistSlice.reducer
