import { Plus, RefreshCw, Trash2 } from 'lucide-react';
import { useState } from 'react';
import StateBlock from '../components/StateBlock.jsx';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { api } from '../services/api.js';

const initialProduct = {
  name: '',
  brand: '',
  price: '',
  categoryId: '',
  sizeType: 'clothing',
  selectedSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  mainImageUrl: '',
  additionalImageUrls: ''
};

const sizeOptions = {
  clothing: {
    label: 'Одяг',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  },
  shoes: {
    label: 'Взуття',
    sizes: ['39', '40', '41', '42', '43', '44', '45']
  }
};

function getStoredProductImages() {
  try {
    return JSON.parse(localStorage.getItem('sportstore_product_images') || '{}');
  } catch {
    return {};
  }
}

function saveProductImages(productIds, mainImageUrl, additionalImageUrls) {
  const trimmedMainImageUrl = mainImageUrl.trim();
  const images = additionalImageUrls
    .split('\n')
    .map((url) => url.trim())
    .filter(Boolean);

  if (!trimmedMainImageUrl && images.length === 0) {
    return;
  }

  const storedImages = getStoredProductImages();
  productIds.forEach((id) => {
    storedImages[id] = {
      mainImageUrl: trimmedMainImageUrl,
      images
    };
  });

  localStorage.setItem('sportstore_product_images', JSON.stringify(storedImages));
}

export default function AdminPanel() {
  const products = useAsyncData(() => api.getProducts(), []);
  const categories = useAsyncData(() => api.getCategories(), []);
  const [productForm, setProductForm] = useState(initialProduct);
  const [categoryName, setCategoryName] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  function updateProduct(key, value) {
    setProductForm((current) => {
      if (key === 'sizeType') {
        return {
          ...current,
          sizeType: value,
          selectedSizes: sizeOptions[value].sizes
        };
      }

      return { ...current, [key]: value };
    });
  }

  function toggleSize(size) {
    setProductForm((current) => {
      const selectedSizes = current.selectedSizes.includes(size)
        ? current.selectedSizes.filter((selectedSize) => selectedSize !== size)
        : [...current.selectedSizes, size];

      return { ...current, selectedSizes };
    });
  }

  async function createProduct(event) {
    event.preventDefault();
    if (productForm.selectedSizes.length === 0) {
      setMessage('Оберіть хоча б один розмір.');
      return;
    }

    setBusy(true);
    setMessage('');
    try {
      const createdProducts = [];

      for (const size of productForm.selectedSizes) {
        const createdProduct = await api.createProduct({
          name: productForm.name,
          brand: productForm.brand,
          price: Number(productForm.price),
          categoryId: Number(productForm.categoryId),
          size
        });

        createdProducts.push(createdProduct);
      }

      saveProductImages(
        createdProducts.map((product) => product.id),
        productForm.mainImageUrl,
        productForm.additionalImageUrls
      );
      setProductForm(initialProduct);
      setMessage(`Створено ${createdProducts.length} товарів для вибраних розмірів.`);
      products.reload();
    } catch (err) {
      setMessage(err.message || 'Не вдалося створити товар.');
    } finally {
      setBusy(false);
    }
  }

  async function createCategory(event) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      await api.createCategory({ name: categoryName });
      setCategoryName('');
      setMessage('Категорію створено.');
      categories.reload();
    } catch (err) {
      setMessage(err.message || 'Не вдалося створити категорію.');
    } finally {
      setBusy(false);
    }
  }

  async function deleteProduct(id) {
    setBusy(true);
    setMessage('');
    try {
      await api.deleteProduct(id);
      const storedImages = getStoredProductImages();
      delete storedImages[id];
      localStorage.setItem('sportstore_product_images', JSON.stringify(storedImages));
      setMessage('Товар видалено.');
      products.reload();
    } catch (err) {
      setMessage(err.message || 'Не вдалося видалити товар.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="container admin-page">
      <div className="page-heading">
        <p className="eyebrow">Адмін-панель</p>
        <h1>Керування SportStore</h1>
        <p>Панель працює з існуючими ADMIN endpoint-ами backend: товари та категорії.</p>
      </div>

      <div className="admin-grid">
        <form className="admin-form" onSubmit={createProduct}>
          <h2>Новий товар</h2>
          <label>
            Назва
            <input value={productForm.name} onChange={(event) => updateProduct('name', event.target.value)} required />
          </label>
          <label>
            Бренд
            <input value={productForm.brand} onChange={(event) => updateProduct('brand', event.target.value)} required />
          </label>
          <div className="price-grid">
            <label>
              Ціна
              <input
                type="number"
                min="1"
                value={productForm.price}
                onChange={(event) => updateProduct('price', event.target.value)}
                required
              />
            </label>
            <label>
              Тип розмірної сітки
              <select value={productForm.sizeType} onChange={(event) => updateProduct('sizeType', event.target.value)}>
                {Object.entries(sizeOptions).map(([key, option]) => (
                  <option key={key} value={key}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="admin-size-picker">
            <span>Розміри</span>
            <div className="size-checkbox-grid">
              {sizeOptions[productForm.sizeType].sizes.map((size) => (
                <label className="size-checkbox" key={size}>
                  <input
                    type="checkbox"
                    checked={productForm.selectedSizes.includes(size)}
                    onChange={() => toggleSize(size)}
                  />
                  <span>{size}</span>
                </label>
              ))}
            </div>
          </div>
          <label>
            Категорія
            <select
              value={productForm.categoryId}
              onChange={(event) => updateProduct('categoryId', event.target.value)}
              required
            >
              <option value="">Оберіть категорію</option>
              {categories.data.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Основне фото товару через URL
            <input
              type="url"
              value={productForm.mainImageUrl}
              placeholder="https://example.com/product-main.jpg"
              onChange={(event) => updateProduct('mainImageUrl', event.target.value)}
            />
          </label>
          <label>
            Додаткові фото через URL
            <textarea
              rows="4"
              value={productForm.additionalImageUrls}
              placeholder={'https://example.com/photo-1.jpg\nhttps://example.com/photo-2.jpg'}
              onChange={(event) => updateProduct('additionalImageUrls', event.target.value)}
            />
          </label>
          <button className="primary-button full" type="submit" disabled={busy}>
            <Plus size={18} />
            Додати товар
          </button>
        </form>

        <form className="admin-form" onSubmit={createCategory}>
          <h2>Нова категорія</h2>
          <label>
            Назва категорії
            <input value={categoryName} onChange={(event) => setCategoryName(event.target.value)} required />
          </label>
          <button className="ghost-button full" type="submit" disabled={busy}>
            <Plus size={18} />
            Додати категорію
          </button>
          {message && <p className="form-message">{message}</p>}
        </form>
      </div>

      <div className="admin-list-heading">
        <h2>Товари</h2>
        <button className="ghost-button" type="button" onClick={products.reload}>
          <RefreshCw size={18} />
          Оновити
        </button>
      </div>

      {products.loading && <StateBlock title="Завантаження товарів..." />}
      {products.error && <StateBlock title="Не вдалося завантажити товари" text={products.error} />}
      {!products.loading && !products.error && (
        <div className="admin-table">
          {products.data.map((product) => (
            <div className="admin-row" key={product.id}>
              <span>#{product.id}</span>
              <strong>{product.name}</strong>
              <span>{product.brand}</span>
              <span>{product.size}</span>
              <span>{Number(product.price).toFixed(2)} грн</span>
              <button className="icon-button danger" type="button" disabled={busy} onClick={() => deleteProduct(product.id)}>
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
