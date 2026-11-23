import { useDispatch, useSelector } from 'react-redux'
import { selectWishlistIds, toggleWishlist } from './wishlistSlice.js'

export function useWishlist() {
  const dispatch = useDispatch()
  const ids = useSelector(selectWishlistIds)
  return {
    ids,
    has: (id) => ids.includes(id),
    toggle: (id) => dispatch(toggleWishlist(id)),
  }
}
