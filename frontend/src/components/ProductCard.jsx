import { ShoppingCart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { getProductImage } from '../services/assets.js';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const location = useLocation();
  const image = getProductImage(product);
  const currentCatalogPath = `${location.pathname}${location.search}`;

  return (
    <article className="product-card">
      <Link className="product-image-link" to={`/products/${product.id}`} state={{ from: currentCatalogPath }}>
        <img src={image} alt={product.name} />
      </Link>
      <div className="product-card-body">
        <div>
          <p className="eyebrow">{product.brand || 'SportStore'}</p>
          <Link className="product-title" to={`/products/${product.id}`} state={{ from: currentCatalogPath }}>
            {product.name}
          </Link>
          <p className="muted">Розмір: {product.size || 'універсальний'}</p>
        </div>
        <div className="product-card-footer">
          <strong>{Number(product.price).toFixed(2)} грн</strong>
          <button
            className="icon-button dark"
            type="button"
            title="Додати до кошика"
            onClick={() => addToCart({ ...product, image })}
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
