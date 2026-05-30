import { Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import StateBlock from '../components/StateBlock.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { api } from '../services/api.js';
import { useState } from 'react';

export default function Cart() {
  const { items, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function checkout() {
    if (!isAuthenticated) {
      setMessage('Для оформлення замовлення потрібно увійти в акаунт.');
      return;
    }

    setSubmitting(true);
    setMessage('');
    try {
      const productIds = items.flatMap((item) => Array.from({ length: item.quantity }, () => item.id));
      await api.createOrder(productIds);
      clearCart();
      setMessage('Замовлення успішно оформлено.');
    } catch (err) {
      setMessage(err.message || 'Не вдалося оформити замовлення.');
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <section className="container section">
        <StateBlock
          title="Кошик порожній"
          text={message || 'Додайте товари з каталогу, щоб оформити замовлення.'}
          action={
            <Link className="primary-button" to="/catalog">
              Перейти до каталогу
            </Link>
          }
        />
      </section>
    );
  }

  return (
    <section className="container cart-page">
      <div className="page-heading">
        <p className="eyebrow">Кошик</p>
        <h1>Ваше замовлення</h1>
        <p>Товари зберігаються у localStorage, а оформлення доступне для авторизованих користувачів.</p>
      </div>

      <div className="cart-layout">
        <div className="cart-list">
          {items.map((item) => (
            <article className="cart-item" key={item.id}>
              <img src={item.image} alt={item.name} />
              <div>
                <h2>{item.name}</h2>
                <p>{item.brand} · {item.size}</p>
                <strong>{Number(item.price).toFixed(2)} грн</strong>
              </div>
              <div className="quantity-control">
                <button type="button" className="icon-button" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                  <Minus size={16} />
                </button>
                <span>{item.quantity}</span>
                <button type="button" className="icon-button" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                  <Plus size={16} />
                </button>
              </div>
              <button type="button" className="icon-button danger" onClick={() => removeFromCart(item.id)}>
                <Trash2 size={18} />
              </button>
            </article>
          ))}
        </div>

        <aside className="checkout-panel">
          <h2>Підсумок</h2>
          <div>
            <span>Сума</span>
            <strong>{total.toFixed(2)} грн</strong>
          </div>
          <button className="primary-button full" type="button" disabled={submitting} onClick={checkout}>
            {submitting ? 'Оформлення...' : 'Оформити замовлення'}
          </button>
          {message && <p className="form-message">{message}</p>}
        </aside>
      </div>
    </section>
  );
}
