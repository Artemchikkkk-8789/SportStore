import { Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import StateBlock from '../components/StateBlock.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { api } from '../services/api.js';
import { useState } from 'react';

const deliveryOptions = [
  { id: 'nova-poshta', label: 'Нова Пошта', price: 100 },
  { id: 'ukrposhta', label: 'Укрпошта', price: 45 },
  { id: 'courier', label: 'Кур’єр', price: 150 }
];

const paymentOptions = [
  'Оплата при отриманні',
  'Оплата карткою онлайн',
  'Переказ на картку'
];

const initialCheckout = {
  fullName: '',
  phone: '',
  city: '',
  address: '',
  comment: '',
  deliveryId: deliveryOptions[0].id,
  payment: paymentOptions[0]
};

export default function Cart() {
  const { items, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState(initialCheckout);

  const selectedDelivery = deliveryOptions.find((option) => option.id === checkoutForm.deliveryId) || deliveryOptions[0];
  const grandTotal = total + selectedDelivery.price;

  function updateCheckoutField(key, value) {
    setCheckoutForm((current) => ({ ...current, [key]: value }));
  }

  async function checkout(event) {
    event.preventDefault();

    if (!isAuthenticated) {
      setMessage('Для оформлення замовлення потрібно увійти в акаунт.');
      return;
    }

    setSubmitting(true);
    setMessage('');
    try {
      const productIds = items.flatMap((item) => Array.from({ length: item.quantity }, () => item.id));
      await api.createOrder(productIds);
      localStorage.setItem(
        'sportstore_last_checkout',
        JSON.stringify({
          ...checkoutForm,
          delivery: selectedDelivery,
          itemsTotal: total,
          total: grandTotal,
          createdAt: new Date().toISOString()
        })
      );
      clearCart();
      setCheckoutForm(initialCheckout);
      setMessage(
        `Замовлення успішно оформлено для ${checkoutForm.fullName}. Доставка: ${selectedDelivery.label}, оплата: ${checkoutForm.payment}. Загальна сума: ${grandTotal.toFixed(2)} грн.`
      );
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

      <form className="cart-layout" onSubmit={checkout}>
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

          <section className="checkout-form">
            <h2>Дані для доставки</h2>
            <div className="checkout-fields-grid">
              <label>
                ПІБ
                <input
                  value={checkoutForm.fullName}
                  placeholder="Іваненко Іван Іванович"
                  onChange={(event) => updateCheckoutField('fullName', event.target.value)}
                  required
                />
              </label>
              <label>
                Телефон
                <input
                  type="tel"
                  value={checkoutForm.phone}
                  placeholder="+380..."
                  onChange={(event) => updateCheckoutField('phone', event.target.value)}
                  required
                />
              </label>
              <label>
                Місто
                <input
                  value={checkoutForm.city}
                  placeholder="Київ"
                  onChange={(event) => updateCheckoutField('city', event.target.value)}
                  required
                />
              </label>
              <label>
                Адреса або відділення
                <input
                  value={checkoutForm.address}
                  placeholder="Відділення 12 або вул. Спортивна, 7"
                  onChange={(event) => updateCheckoutField('address', event.target.value)}
                  required
                />
              </label>
            </div>

            <label>
              Коментар
              <textarea
                rows="4"
                value={checkoutForm.comment}
                placeholder="Додаткові побажання до замовлення"
                onChange={(event) => updateCheckoutField('comment', event.target.value)}
              />
            </label>

            <div className="checkout-choice-group">
              <h3>Доставка</h3>
              <div className="option-grid">
                {deliveryOptions.map((option) => (
                  <label className="option-card" key={option.id}>
                    <input
                      type="radio"
                      name="delivery"
                      value={option.id}
                      checked={checkoutForm.deliveryId === option.id}
                      onChange={(event) => updateCheckoutField('deliveryId', event.target.value)}
                    />
                    <span>{option.label}</span>
                    <strong>{option.price} грн</strong>
                  </label>
                ))}
              </div>
            </div>

            <div className="checkout-choice-group">
              <h3>Оплата</h3>
              <div className="option-grid">
                {paymentOptions.map((option) => (
                  <label className="option-card" key={option}>
                    <input
                      type="radio"
                      name="payment"
                      value={option}
                      checked={checkoutForm.payment === option}
                      onChange={(event) => updateCheckoutField('payment', event.target.value)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </section>
        </div>

        <aside className="checkout-panel">
          <h2>Підсумок</h2>
          <div className="summary-row">
            <span>Сума товарів</span>
            <strong>{total.toFixed(2)} грн</strong>
          </div>
          <div className="summary-row">
            <span>Доставка</span>
            <strong>{selectedDelivery.price.toFixed(2)} грн</strong>
          </div>
          <div className="summary-row total-row">
            <span>Загальна сума</span>
            <strong>{grandTotal.toFixed(2)} грн</strong>
          </div>
          <p className="checkout-note">
            На backend поки передаються тільки ID товарів. Дані доставки й оплати зберігаються локально.
          </p>
          <button className="primary-button full" type="submit" disabled={submitting}>
            {submitting ? 'Оформлення...' : 'Підтвердити замовлення'}
          </button>
          {message && <p className="form-message">{message}</p>}
        </aside>
      </form>
    </section>
  );
}
