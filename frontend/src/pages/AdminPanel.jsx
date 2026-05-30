import { Pencil, Plus, RefreshCw, Trash2, X } from 'lucide-react';
import { useRef, useState } from 'react';
import StateBlock from '../components/StateBlock.jsx';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { api } from '../services/api.js';
import { ORDER_STATUSES, readStoredOrders, updateStoredOrderStatus } from '../services/orderStorage.js';

const initialProduct = {
  name: '',
  brand: '',
  price: '',
  categoryId: '',
  sizeType: 'clothing',
  selectedSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  selectedColors: ['Чорний']
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

const colorOptions = ['Чорний', 'Білий', 'Сірий', 'Синій', 'Червоний', 'Зелений'];

function getStoredProductOptions() {
  try {
    return JSON.parse(localStorage.getItem('sportstore_product_options') || '{}');
  } catch {
    return {};
  }
}

function saveProductOptions(productId, selectedSizes, selectedColors) {
  const storedOptions = getStoredProductOptions();
  storedOptions[productId] = {
    selectedSizes,
    colors: selectedColors
  };
  localStorage.setItem('sportstore_product_options', JSON.stringify(storedOptions));
}

function inferSizeType(sizes) {
  return sizes.some((size) => Number.isFinite(Number(size))) ? 'shoes' : 'clothing';
}

export default function AdminPanel() {
  const products = useAsyncData(() => api.getProducts(), []);
  const categories = useAsyncData(() => api.getCategories(), []);
  const productFormRef = useRef(null);
  const [productForm, setProductForm] = useState(initialProduct);
  const [categoryName, setCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [categoryEditName, setCategoryEditName] = useState('');
  const [orders, setOrders] = useState(() => readStoredOrders());
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [photoPreviews, setPhotoPreviews] = useState({ main: '', additional: [] });
  const [editingProductId, setEditingProductId] = useState(null);

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

  function toggleColor(color) {
    setProductForm((current) => {
      const selectedColors = current.selectedColors.includes(color)
        ? current.selectedColors.filter((selectedColor) => selectedColor !== color)
        : [...current.selectedColors, color];

      return { ...current, selectedColors };
    });
  }

  function updateMainPhoto(event) {
    const file = event.target.files?.[0];
    setPhotoPreviews((current) => ({
      ...current,
      main: file ? URL.createObjectURL(file) : ''
    }));
  }

  function updateAdditionalPhotos(event) {
    const files = Array.from(event.target.files || []);
    setPhotoPreviews((current) => ({
      ...current,
      additional: files.map((file) => URL.createObjectURL(file))
    }));
  }

  async function createProduct(event) {
    event.preventDefault();
    if (productForm.selectedSizes.length === 0) {
      setMessage('Оберіть хоча б один розмір.');
      return;
    }
    if (productForm.selectedColors.length === 0) {
      setMessage('Оберіть хоча б один колір.');
      return;
    }

    setBusy(true);
    setMessage('');
    try {
      const payload = {
        name: productForm.name,
        brand: productForm.brand,
        price: Number(productForm.price),
        categoryId: Number(productForm.categoryId),
        size: productForm.selectedSizes[0]
      };

      const savedProduct = editingProductId
        ? await api.updateProduct(editingProductId, payload)
        : await api.createProduct(payload);

      saveProductOptions(savedProduct.id, productForm.selectedSizes, productForm.selectedColors);
      resetProductForm(event.currentTarget);
      setMessage(
        editingProductId
          ? 'Товар оновлено. Фото поки не відправляються на backend.'
          : 'Товар створено. Фото поки не відправляються на backend.'
      );
      products.reload();
    } catch (err) {
      setMessage(err.message || 'Не вдалося зберегти товар.');
    } finally {
      setBusy(false);
    }
  }

  function resetProductForm(formElement) {
    setProductForm(initialProduct);
    setEditingProductId(null);
    setPhotoPreviews({ main: '', additional: [] });
    formElement?.reset();
  }

  function startEdit(product) {
    const storedOptions = getStoredProductOptions()[product.id] || {};
    const selectedSizes = storedOptions.selectedSizes?.length
      ? storedOptions.selectedSizes
      : [product.size || 'M'];
    const selectedColors = storedOptions.colors?.length ? storedOptions.colors : ['Чорний'];

    setEditingProductId(product.id);
    setProductForm({
      name: product.name || '',
      brand: product.brand || '',
      price: product.price || '',
      categoryId: product.categoryId || '',
      sizeType: inferSizeType(selectedSizes),
      selectedSizes,
      selectedColors
    });
    setPhotoPreviews({ main: '', additional: [] });
    setMessage(`Редагування товару #${product.id}`);
    window.setTimeout(() => {
      productFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
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

  function startCategoryEdit(category) {
    setEditingCategoryId(category.id);
    setCategoryEditName(category.name || '');
    setMessage(`Редагування категорії #${category.id}`);
  }

  async function updateCategory() {
    if (!categoryEditName.trim()) {
      setMessage('Назва категорії не може бути порожньою.');
      return;
    }

    setBusy(true);
    setMessage('');
    try {
      await api.updateCategory(editingCategoryId, { name: categoryEditName.trim() });
      setEditingCategoryId(null);
      setCategoryEditName('');
      setMessage('Категорію оновлено.');
      categories.reload();
    } catch (err) {
      setMessage(err.message || 'Не вдалося оновити категорію.');
    } finally {
      setBusy(false);
    }
  }

  async function deleteCategory(id) {
    if (!window.confirm('Видалити категорію?')) {
      return;
    }

    setBusy(true);
    setMessage('');
    try {
      await api.deleteCategory(id);
      setMessage('Категорію видалено.');
      categories.reload();
    } catch (err) {
      setMessage(err.message || 'Не вдалося видалити категорію.');
    } finally {
      setBusy(false);
    }
  }

  async function deleteProduct(id) {
    setBusy(true);
    setMessage('');
    try {
      await api.deleteProduct(id);
      const storedOptions = getStoredProductOptions();
      delete storedOptions[id];
      localStorage.setItem('sportstore_product_options', JSON.stringify(storedOptions));
      setMessage('Товар видалено.');
      products.reload();
    } catch (err) {
      setMessage(err.message || 'Не вдалося видалити товар.');
    } finally {
      setBusy(false);
    }
  }

  function changeOrderStatus(orderId, status) {
    setOrders(updateStoredOrderStatus(orderId, status));
    setMessage(`Статус замовлення #${orderId} змінено на "${status}".`);
  }

  function refreshOrders() {
    setOrders(readStoredOrders());
  }

  function formatOrderDate(value) {
    if (!value) return 'Дата не вказана';

    return new Intl.DateTimeFormat('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(value));
  }

  return (
    <section className="container admin-page">
      <div className="page-heading">
        <p className="eyebrow">Адмін-панель</p>
        <h1>Керування SportStore</h1>
        <p>Панель працює з існуючими ADMIN endpoint-ами backend: товари та категорії.</p>
      </div>

      <div className="admin-grid">
        <form
          className={`admin-form ${editingProductId ? 'editing' : ''}`}
          ref={productFormRef}
          onSubmit={createProduct}
        >
          <div className="admin-form-heading">
            <h2>{editingProductId ? `Редагування товару #${editingProductId}` : 'Новий товар'}</h2>
            {editingProductId && (
              <button className="icon-button" type="button" onClick={(event) => resetProductForm(event.currentTarget.form)}>
                <X size={18} />
              </button>
            )}
          </div>
          {editingProductId && (
            <p className="admin-edit-notice">
              Форма заповнена поточними даними товару. Після змін натисніть "Зберегти зміни".
            </p>
          )}
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
          <div className="admin-size-picker">
            <span>Кольори</span>
            <div className="size-checkbox-grid">
              {colorOptions.map((color) => (
                <label className="size-checkbox" key={color}>
                  <input
                    type="checkbox"
                    checked={productForm.selectedColors.includes(color)}
                    onChange={() => toggleColor(color)}
                  />
                  <span>{color}</span>
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
            Основне фото товару
            <input type="file" accept="image/*" onChange={updateMainPhoto} />
          </label>
          <label>
            Додаткові фото товару
            <input type="file" accept="image/*" multiple onChange={updateAdditionalPhotos} />
          </label>
          <p className="admin-upload-note">
            Завантаження фото буде підключено після налаштування серверного збереження файлів.
          </p>
          {(photoPreviews.main || photoPreviews.additional.length > 0) && (
            <div className="photo-preview-grid">
              {photoPreviews.main && <img src={photoPreviews.main} alt="Основне фото товару" />}
              {photoPreviews.additional.map((preview) => (
                <img key={preview} src={preview} alt="Додаткове фото товару" />
              ))}
            </div>
          )}
          <button className="primary-button full" type="submit" disabled={busy}>
            <Plus size={18} />
            {editingProductId ? 'Зберегти зміни' : 'Додати товар'}
          </button>
          {message && <p className="form-message">{message}</p>}
        </form>

        <div className="admin-side-stack">
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
          </form>

          <section className="admin-form">
            <div className="admin-form-heading">
              <h2>Категорії</h2>
              <button className="icon-button" type="button" onClick={categories.reload} disabled={busy}>
                <RefreshCw size={18} />
              </button>
            </div>
            <div className="admin-category-list">
              {categories.data.map((category) => (
                <div className="admin-category-row" key={category.id}>
                  {editingCategoryId === category.id ? (
                    <>
                      <input
                        value={categoryEditName}
                        onChange={(event) => setCategoryEditName(event.target.value)}
                        autoFocus
                      />
                      <button className="ghost-button" type="button" onClick={updateCategory} disabled={busy}>
                        Зберегти
                      </button>
                      <button
                        className="icon-button"
                        type="button"
                        onClick={() => {
                          setEditingCategoryId(null);
                          setCategoryEditName('');
                        }}
                      >
                        <X size={18} />
                      </button>
                    </>
                  ) : (
                    <>
                      <strong>{category.name}</strong>
                      <button className="ghost-button" type="button" onClick={() => startCategoryEdit(category)} disabled={busy}>
                        <Pencil size={18} />
                        Редагувати
                      </button>
                      <button className="icon-button danger" type="button" onClick={() => deleteCategory(category.id)} disabled={busy}>
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="admin-form admin-orders-panel">
            <div className="admin-form-heading">
              <h2>Замовлення</h2>
              <button className="icon-button" type="button" onClick={refreshOrders}>
                <RefreshCw size={18} />
              </button>
            </div>
            {orders.length === 0 ? (
              <p className="empty-profile-note">Замовлень поки немає.</p>
            ) : (
              <div className="admin-orders-list">
                {orders.map((order) => (
                  <article className="admin-order-card" key={order.id}>
                    <div>
                      <span>ID</span>
                      <strong>#{order.id}</strong>
                    </div>
                    <div>
                      <span>Дата</span>
                      <strong>{formatOrderDate(order.createdAt)}</strong>
                    </div>
                    <div>
                      <span>Користувач</span>
                      <strong>{order.username}</strong>
                    </div>
                    <div>
                      <span>Сума</span>
                      <strong>{Number(order.total || order.totalPrice || 0).toFixed(2)} грн</strong>
                    </div>
                    <div>
                      <span>Місто</span>
                      <strong>{order.deliveryInfo?.city || 'не вказано'}</strong>
                    </div>
                    <div>
                      <span>Доставка</span>
                      <strong>{order.deliveryInfo?.deliveryType || 'не вказана'}</strong>
                    </div>
                    <label>
                      Статус
                      <select value={order.status} onChange={(event) => changeOrderStatus(order.id, event.target.value)}>
                        {ORDER_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </label>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
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
              <button
                className="ghost-button admin-edit-button"
                type="button"
                disabled={busy}
                onClick={(event) => {
                  event.preventDefault();
                  startEdit(product);
                }}
              >
                <Pencil size={18} />
                Редагувати
              </button>
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
