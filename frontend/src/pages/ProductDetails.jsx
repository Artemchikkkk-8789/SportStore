import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import StateBlock from '../components/StateBlock.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { api } from '../services/api.js';
import { getProductImage } from '../services/assets.js';

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const { data: product, loading, error } = useAsyncData(() => api.getProduct(id), [id]);

  if (loading) return <StateBlock title="Завантаження товару..." />;
  if (error) return <StateBlock title="Товар недоступний" text={error} />;
  if (!product?.id) return <StateBlock title="Товар не знайдено" />;

  const image = getProductImage(product);

  function handleAdd() {
    addToCart({ ...product, image });
    setAdded(true);
  }

  return (
    <section className="container product-details-page">
      <Link className="back-link" to="/catalog">
        <ArrowLeft size={18} />
        Назад до каталогу
      </Link>

      <div className="product-details-layout">
        <div className="product-gallery">
          <img src={image} alt={product.name} />
        </div>
        <div className="product-info">
          <p className="eyebrow">{product.brand || 'SportStore'}</p>
          <h1>{product.name}</h1>
          <p className="product-price">{Number(product.price).toFixed(2)} грн</p>
          <div className="spec-list">
            <span>Розмір</span>
            <strong>{product.size || 'універсальний'}</strong>
            <span>Категорія</span>
            <strong>#{product.categoryId || 'без категорії'}</strong>
            <span>Код товару</span>
            <strong>{product.id}</strong>
          </div>
          <button className="primary-button full" type="button" onClick={handleAdd}>
            <ShoppingCart size={18} />
            {added ? 'Додано до кошика' : 'Додати до кошика'}
          </button>
        </div>
      </div>
    </section>
  );
}
