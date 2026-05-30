import { Plus, RefreshCw, Trash2 } from 'lucide-react';
import { useState } from 'react';
import StateBlock from '../components/StateBlock.jsx';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { api } from '../services/api.js';

const initialProduct = {
  name: '',
  brand: '',
  size: '',
  price: '',
  categoryId: ''
};

export default function AdminPanel() {
  const products = useAsyncData(() => api.getProducts(), []);
  const categories = useAsyncData(() => api.getCategories(), []);
  const [productForm, setProductForm] = useState(initialProduct);
  const [categoryName, setCategoryName] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  function updateProduct(key, value) {
    setProductForm((current) => ({ ...current, [key]: value }));
  }

  async function createProduct(event) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      await api.createProduct({
        ...productForm,
        price: Number(productForm.price),
        categoryId: Number(productForm.categoryId)
      });
      setProductForm(initialProduct);
      setMessage('Товар створено.');
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
              Розмір
              <input value={productForm.size} onChange={(event) => updateProduct('size', event.target.value)} required />
            </label>
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
