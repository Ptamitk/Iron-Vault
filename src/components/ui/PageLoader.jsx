import { useEffect, useState } from 'react'
import { Dumbbell } from 'lucide-react'
import './page-loader.css'

export default function PageLoader({ label = 'LOADING IRON VAULT' }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setVisible(true))
    return () => window.cancelAnimationFrame(frame)
  }, [])

  return (
    <div className={visible ? 'page-loader is-visible' : 'page-loader'} role="status" aria-live="polite" aria-label={label}>
      <div className="loader-brand"><Dumbbell size={28} strokeWidth={1.6} /><span>IRON<span>VAULT</span></span></div>
      <div className="loader-track"><span /></div>
      <p>{label}</p>
    </div>
  )
}
