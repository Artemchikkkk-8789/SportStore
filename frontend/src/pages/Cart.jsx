import { Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import StateBlock from '../components/StateBlock.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { deliveryData, deliveryTimeByCity, dispatchCity } from '../data/deliveryData.js';
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

const ukrainianCities = Object.keys(deliveryData);

const initialCheckout = {
  fullName: '',
  phone: '',
  city: '',
  warehouse: '',
  courierAddress: {
    street: '',
    building: '',
    entrance: '',
    floor: '',
    apartment: ''
  },
  comment: '',
  deliveryId: deliveryOptions[0].id,
  payment: paymentOptions[0]
};

function getCartItemKey(item) {
  const productId = item.productId || item.id;
  return item.cartKey || `${productId}-${item.selectedSize || item.size || ''}-${item.selectedColor || ''}`;
}

export default function Cart() {
  const { items, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState(initialCheckout);

  const selectedDelivery = deliveryOptions.find((option) => option.id === checkoutForm.deliveryId) || deliveryOptions[0];
  const grandTotal = total + selectedDelivery.price;
  const isCourierDelivery = selectedDelivery.id === 'courier';
  const deliveryDataKey = selectedDelivery.id === 'nova-poshta' ? 'novaPoshta' : 'ukrposhta';
  const warehouseOptions = checkoutForm.city ? deliveryData[checkoutForm.city]?.[deliveryDataKey] || [] : [];
  const estimatedDeliveryTime = checkoutForm.city ? deliveryTimeByCity[checkoutForm.city] || 'уточнюється' : '';
  const warehouseLabel =
    selectedDelivery.id === 'nova-poshta'
      ? 'Виберіть відділення НП'
      : 'Виберіть відділення Укрпошти';

  function updateCheckoutField(key, value) {
    setCheckoutForm((current) => {
      if (key === 'phone') {
        return { ...current, phone: value.replace(/\D/g, '').slice(0, 9) };
      }

      if (key === 'city') {
        return { ...current, city: value, warehouse: '' };
      }

      if (key === 'deliveryId') {
        return {
          ...current,
          deliveryId: value,
          warehouse: '',
          courierAddress: initialCheckout.courierAddress
        };
      }

      return { ...current, [key]: value };
    });
  }

  function updateCourierAddressField(key, value) {
    setCheckoutForm((current) => ({
      ...current,
      courierAddress: {
        ...current.courierAddress,
        [key]: value
      }
    }));
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
      const productIds = items.flatMap((item) =>
        Array.from({ length: item.quantity }, () => item.productId || item.id)
      );
      await api.createOrder(productIds);

      const deliveryInfo = {
        fullName: checkoutForm.fullName,
        phone: `+380${checkoutForm.phone}`,
        city: checkoutForm.city,
        deliveryType: selectedDelivery.label,
        dispatchCity,
        estimatedDeliveryTime,
        paymentType: checkoutForm.payment,
        comment: checkoutForm.comment
      };

      if (isCourierDelivery) {
        deliveryInfo.courierAddress = checkoutForm.courierAddress;
      } else {
        deliveryInfo.warehouse = checkoutForm.warehouse;
      }

      const orderInfo = {
        deliveryInfo,
        itemsTotal: total,
        deliveryPrice: selectedDelivery.price,
        total: grandTotal,
        createdAt: new Date().toISOString()
      };
      const storedOrders = JSON.parse(localStorage.getItem('sportstore_orders') || '[]');
      const orders = Array.isArray(storedOrders) ? storedOrders : [];

      localStorage.setItem('sportstore_last_checkout', JSON.stringify(orderInfo));
      localStorage.setItem('sportstore_orders', JSON.stringify([orderInfo, ...orders]));
      clearCart();
      setCheckoutForm(initialCheckout);
      setMessage(
        `Замовлення успішно оформлено для ${deliveryInfo.fullName}. Телефон: ${deliveryInfo.phone}. Доставка: ${deliveryInfo.deliveryType}, оплата: ${deliveryInfo.paymentType}. Загальна сума: ${grandTotal.toFixed(2)} грн.`
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
            <article className="cart-item" key={getCartItemKey(item)}>
              <img src={item.image} alt={item.name} />
              <div>
                <h2>{item.name}</h2>
                <p>
                  {item.brand} · Розмір: {item.selectedSize || item.size}
                  {item.selectedColor ? ` · Колір: ${item.selectedColor}` : ''}
                </p>
                <strong>{Number(item.price).toFixed(2)} грн</strong>
              </div>
              <div className="quantity-control">
                <button type="button" className="icon-button" onClick={() => updateQuantity(getCartItemKey(item), item.quantity - 1)}>
                  <Minus size={16} />
                </button>
                <span>{item.quantity}</span>
                <button type="button" className="icon-button" onClick={() => updateQuantity(getCartItemKey(item), item.quantity + 1)}>
                  <Plus size={16} />
                </button>
              </div>
              <button type="button" className="icon-button danger" onClick={() => removeFromCart(getCartItemKey(item))}>
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
                  placeholder="Прізвище Ім’я По батькові"
                  onChange={(event) => updateCheckoutField('fullName', event.target.value)}
                  required
                />
              </label>
              <label>
                Телефон
                <span className="phone-input">
                  <span>+380</span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]{9}"
                    maxLength="9"
                    value={checkoutForm.phone}
                    placeholder="XXXXXXXXX"
                    title="Введіть 9 цифр після +380"
                    onChange={(event) => updateCheckoutField('phone', event.target.value)}
                    required
                  />
                </span>
              </label>
              <label>
                Місто
                <select
                  value={checkoutForm.city}
                  onChange={(event) => updateCheckoutField('city', event.target.value)}
                  required
                >
                  <option value="">Оберіть місто</option>
                  {ukrainianCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {checkoutForm.city && (
              <div className="delivery-route-note">
                <strong>Відправлення з м. {dispatchCity}</strong>
                <span>Орієнтовний час доставки: {estimatedDeliveryTime}</span>
              </div>
            )}

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

            {!isCourierDelivery && (
              <label>
                {warehouseLabel}
                <select
                  value={checkoutForm.warehouse}
                  onChange={(event) => updateCheckoutField('warehouse', event.target.value)}
                  disabled={!checkoutForm.city}
                  required
                >
                  <option value="">
                    {checkoutForm.city ? 'Оберіть відділення' : 'Спочатку оберіть місто'}
                  </option>
                  {warehouseOptions.map((warehouse) => (
                    <option key={warehouse} value={warehouse}>
                      {warehouse}
                    </option>
                  ))}
                </select>
              </label>
            )}

            {isCourierDelivery && (
              <div className="courier-fields">
                <label>
                  Вулиця
                  <input
                    value={checkoutForm.courierAddress.street}
                    onChange={(event) => updateCourierAddressField('street', event.target.value)}
                    required
                  />
                </label>
                <label>
                  Будинок
                  <input
                    value={checkoutForm.courierAddress.building}
                    onChange={(event) => updateCourierAddressField('building', event.target.value)}
                    required
                  />
                </label>
                <label>
                  Під’їзд
                  <input
                    value={checkoutForm.courierAddress.entrance}
                    onChange={(event) => updateCourierAddressField('entrance', event.target.value)}
                  />
                </label>
                <label>
                  Поверх
                  <input
                    value={checkoutForm.courierAddress.floor}
                    onChange={(event) => updateCourierAddressField('floor', event.target.value)}
                  />
                </label>
                <label>
                  Квартира
                  <input
                    value={checkoutForm.courierAddress.apartment}
                    onChange={(event) => updateCourierAddressField('apartment', event.target.value)}
                  />
                </label>
              </div>
            )}

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

            <label>
              Коментар
              <textarea
                rows="4"
                value={checkoutForm.comment}
                placeholder="Додаткові побажання до замовлення"
                onChange={(event) => updateCheckoutField('comment', event.target.value)}
              />
            </label>
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
            Відправлення з м. {dispatchCity}
            {estimatedDeliveryTime ? ` · орієнтовний час доставки: ${estimatedDeliveryTime}` : ''}.
            На backend поки передаються тільки ID товарів.
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
