import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { computeTotals, lineKey } from './catalog.js'
import { store } from '../config/store.js'

const STORAGE_KEY = 'iv-cart-v1'
const CartContext = createContext(null)

const loadLines = () => {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(parsed) ? parsed.filter((line) => line && typeof line.id === 'string') : []
  } catch {
    return []
  }
}

function reducer(lines, action) {
  switch (action.type) {
    case 'add': {
      const key = lineKey(action.id, action.flavour, action.size)
      const existing = lines.find((line) => lineKey(line.id, line.flavour, line.size) === key)
      if (existing) {
        return lines.map((line) =>
          line === existing ? { ...line, qty: Math.min(store.maxQtyPerItem, line.qty + action.qty) } : line,
        )
      }
      return [...lines, { id: action.id, flavour: action.flavour || null, size: action.size || null, qty: Math.min(store.maxQtyPerItem, action.qty) }]
    }
    case 'setQty':
      return lines
        .map((line) => (lineKey(line.id, line.flavour, line.size) === action.key ? { ...line, qty: action.qty } : line))
        .filter((line) => line.qty > 0)
    case 'remove':
      return lines.filter((line) => lineKey(line.id, line.flavour, line.size) !== action.key)
    case 'clear':
      return []
    default:
      return lines
  }
}

export function CartProvider({ children }) {
  const [lines, dispatch] = useReducer(reducer, undefined, loadLines)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
    } catch {
      /* storage unavailable: the cart still works for this visit */
    }
  }, [lines])

  const value = useMemo(() => {
    const totals = computeTotals(lines)
    return {
      ...totals,
      add: ({ id, flavour = null, size = null, qty = 1 }) => dispatch({ type: 'add', id, flavour, size, qty }),
      setQty: (key, qty) => dispatch({ type: 'setQty', key, qty }),
      remove: (key) => dispatch({ type: 'remove', key }),
      clear: () => dispatch({ type: 'clear' }),
    }
  }, [lines])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used inside <CartProvider>')
  return context
}
