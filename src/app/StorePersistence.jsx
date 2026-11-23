import { useEffect } from 'react'
import { useSelector } from 'react-redux'

export default function StorePersistence() {
  const cart = useSelector((state) => state.cart.lines)
  const wishlist = useSelector((state) => state.wishlist.ids)

  useEffect(() => {
    try { window.localStorage.setItem('iv-cart-v1', JSON.stringify(cart)) } catch { /* storage may be unavailable */ }
  }, [cart])

  useEffect(() => {
    try { window.localStorage.setItem('iv-wishlist-v1', JSON.stringify(wishlist)) } catch { /* storage may be unavailable */ }
  }, [wishlist])

  return null
}
