import { Provider, useDispatch, useSelector } from 'react-redux'
import { store as reduxStore } from '../app/store.js'
import StorePersistence from '../app/StorePersistence.jsx'
import { addToCart, clearCart, removeFromCart, selectCartLines, setCartQuantity } from '../features/cart/cartSlice.js'
import { computeTotals } from './catalog.js'

export function CartProvider({ children }) {
  return (
    <Provider store={reduxStore}>
      <StorePersistence />
      {children}
    </Provider>
  )
}

export function useCart() {
  const dispatch = useDispatch()
  const lines = useSelector(selectCartLines)
  const totals = computeTotals(lines)
  return {
    ...totals,
    lines: totals.lines,
    add: (item) => dispatch(addToCart(item)),
    setQty: (key, qty) => dispatch(setCartQuantity({ key, qty })),
    remove: (key) => dispatch(removeFromCart(key)),
    clear: () => dispatch(clearCart()),
  }
}
