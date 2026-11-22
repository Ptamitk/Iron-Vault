import { useState } from 'react'
import './ProductImage.css'

// Product photo with a text fallback if the image is missing or fails to load.
export default function ProductImage({ product, eager = false, className = '' }) {
  const [failed, setFailed] = useState(false)
  const showImage = product.image && !failed

  return (
    <div className={`pimg ${className}`.trim()}>
      {showImage ? (
        <img
          src={product.image}
          alt={`${product.brand} ${product.name}`}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="pimg-fallback" aria-hidden="true"><small>{product.brand}</small><b>{product.name}</b></span>
      )}
    </div>
  )
}
