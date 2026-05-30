import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import StateBlock from '../components/StateBlock.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { api } from '../services/api.js';
import { getProductGallery, getProductImage } from '../services/assets.js';

const fallbackColors = ['Чорний', 'Білий', 'Сірий'];

function getStoredProductOptions(productId) {
  try {
    const options = JSON.parse(localStorage.getItem('sportstore_product_options') || '{}');
    return options[productId] || null;
  } catch {
    return null;
  }
}

function getProductDescription(product, categoryName) {
  return `${product.name} від ${product.brand || 'SportStore'} створено для активного ритму, тренувань і повсякденного використання. Категорія: ${categoryName}. Матеріали підібрані для комфорту, свободи рухів і впевненого вигляду у спортивному стилі.`;
}

export default function ProductDetails() {
  const { id } = useParams();
  const location = useLocation();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectionError, setSelectionError] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const { data: product, loading, error } = useAsyncData(() => api.getProduct(id), [id]);
  const categories = useAsyncData(() => api.getCategories(), []);

  if (loading) return <StateBlock title="Завантаження товару..." />;
  if (error) return <StateBlock title="Товар недоступний" text={error} />;
  if (!product?.id) return <StateBlock title="Товар не знайдено" />;

  const image = getProductImage(product);
  const gallery = getProductGallery(product);
  const activeImage = gallery.includes(selectedImage) ? selectedImage : image;
  const storedOptions = getStoredProductOptions(product.id);
  const sizes = storedOptions?.selectedSizes?.length ? storedOptions.selectedSizes : [product.size || 'універсальний'];
  const colors = storedOptions?.colors?.length ? storedOptions.colors : fallbackColors;
  const category = categories.data.find((item) => item.id === product.categoryId);
  const categoryName = category?.name || `Категорія #${product.categoryId || 'без категорії'}`;
  const backTo = location.state?.from || `/catalog${product.categoryId ? `?categoryId=${product.categoryId}` : ''}`;
  const description = getProductDescription(product, categoryName);

  function handleAdd() {
    if (!selectedSize) {
      setSelectionError('Оберіть розмір');
      return;
    }

    if (!selectedColor) {
      setSelectionError('Оберіть колір');
      return;
    }

    addToCart({
      id: product.id,
      productId: product.id,
      name: product.name,
      brand: product.brand || 'SportStore',
      price: product.price,
      image,
      selectedSize,
      selectedColor,
      quantity: 1
    });
    setAdded(true);
    setSelectionError('');
  }

  return (
    <section className="container product-details-page">
      <Link className="back-link" to={backTo}>
        <ArrowLeft size={18} />
        Назад до каталогу
      </Link>

      <div className="product-details-layout">
        <div className="product-gallery">
          <img src={activeImage} alt={product.name} />
          {gallery.length > 1 && (
            <div className="product-thumbnails">
              {gallery.map((galleryImage) => (
                <button
                  className={activeImage === galleryImage ? 'selected' : ''}
                  key={galleryImage}
                  type="button"
                  onClick={() => setSelectedImage(galleryImage)}
                >
                  <img src={galleryImage} alt={`${product.name} фото`} />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="product-info">
          <p className="eyebrow">{product.brand || 'SportStore'}</p>
          <h1>{product.name}</h1>
          <p className="product-price">{Number(product.price).toFixed(2)} грн</p>
          <p className="product-description">{description}</p>
          <div className="spec-list">
            <span>Бренд</span>
            <strong>{product.brand || 'SportStore'}</strong>
            <span>Категорія</span>
            <strong>{categoryName}</strong>
            <span>Розмір</span>
            <strong>{sizes.join(', ')}</strong>
            <span>Кольори</span>
            <strong>{colors.join(', ')}</strong>
            <span>Код товару</span>
            <strong>{product.id}</strong>
          </div>
          <div className="product-choice-group">
            <span>Оберіть розмір</span>
            <div className="choice-chip-grid">
              {sizes.map((size) => (
                <button
                  className={`choice-chip ${selectedSize === size ? 'selected' : ''}`}
                  key={size}
                  type="button"
                  onClick={() => {
                    setSelectedSize(size);
                    setAdded(false);
                    setSelectionError('');
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          <div className="product-choice-group">
            <span>Оберіть колір</span>
            <div className="choice-chip-grid">
              {colors.map((color) => (
                <button
                  className={`choice-chip ${selectedColor === color ? 'selected' : ''}`}
                  key={color}
                  type="button"
                  onClick={() => {
                    setSelectedColor(color);
                    setAdded(false);
                    setSelectionError('');
                  }}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
          {selectionError && <p className="form-error">{selectionError}</p>}
          <button className="primary-button full" type="button" onClick={handleAdd}>
            <ShoppingCart size={18} />
            {added ? 'Додано до кошика' : 'Додати в кошик'}
          </button>
        </div>
      </div>
    </section>
  );
}
