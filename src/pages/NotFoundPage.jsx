import { Link } from 'react-router-dom'
import ShopLayout from '../components/shop/ShopLayout.jsx'

export default function NotFoundPage() {
  return (
    <ShopLayout title="Page not found">
      <section className="shop-hero shop-center">
        <p className="eyebrow"><span className="eyebrow-line" /> 404</p>
        <h1>PAGE NOT <em>FOUND.</em></h1>
        <p className="shop-lede">The page you are looking for does not exist or has moved.</p>
        <Link className="shop-btn" to="/shop">BACK TO THE SHOP</Link>
      </section>
    </ShopLayout>
  )
}
