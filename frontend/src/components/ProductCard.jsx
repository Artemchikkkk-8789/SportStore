import { ShoppingCart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { getProductImage } from '../services/assets.js';

export default function ProductCard({ product }) {
  const location = useLocation();
  const image = getProductImage(product);
  const currentCatalogPath = `${location.pathname}${location.search}`;
  const sizes = product.sizes?.length ? product.sizes.join(', ') : product.size || 'універсальний';

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
          <p className="muted">Розмір: {sizes}</p>
        </div>
        <div className="product-card-footer">
          <strong>{Number(product.price).toFixed(2)} грн</strong>
          <Link
            className="icon-button dark"
            title="Перейти до товару"
            to={`/products/${product.id}`}
            state={{ from: currentCatalogPath }}
          >
            <ShoppingCart size={18} />
          </Link>
        </div>
      </div>
    </article>
  );
}
