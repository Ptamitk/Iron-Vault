import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import ShopLayout from '../components/shop/ShopLayout.jsx'
import ProductCard from '../components/shop/ProductCard.jsx'
import { products } from '../data/products.js'
import { useWishlist } from '../features/wishlist/useWishlist.js'

export default function WishlistPage() {
  const { ids } = useWishlist()
  const saved = products.filter((product) => ids.includes(product.id))

  return (
    <ShopLayout title="Your wishlist">
      <section className="shop-hero">
        <p className="eyebrow"><span className="eyebrow-line" /> SAVED FOR LATER</p>
        <h1>YOUR <em>WISHLIST.</em></h1>
        <p className="shop-lede">Your saved products, all in one place.</p>
      </section>
      {saved.length ? (
        <div className="shop-grid">{saved.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      ) : (
        <div className="shop-empty-state">
          <Heart size={36} aria-hidden="true" />
          <h2>NOTHING SAVED YET.</h2>
          <p>Tap the heart on a product to keep it here.</p>
          <Link className="shop-btn" to="/shop">EXPLORE THE SHOP</Link>
        </div>
      )}
    </ShopLayout>
  )
}
