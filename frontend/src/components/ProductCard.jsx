import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { getProductImage } from '../services/assets.js';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const image = getProductImage(product);

  return (
    <article className="product-card">
      <Link className="product-image-link" to={`/products/${product.id}`}>
        <img src={image} alt={product.name} />
      </Link>
      <div className="product-card-body">
        <div>
          <p className="eyebrow">{product.brand || 'SportStore'}</p>
          <Link className="product-title" to={`/products/${product.id}`}>
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
