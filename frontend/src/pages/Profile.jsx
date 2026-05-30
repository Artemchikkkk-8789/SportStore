import { CalendarDays, CreditCard, LogOut, MapPin, PackageCheck, ShieldCheck, ShoppingBag, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

function readStoredOrders() {
  try {
    const orders = JSON.parse(localStorage.getItem('sportstore_orders') || '[]');
    if (Array.isArray(orders) && orders.length > 0) {
      return orders;
    }

    const lastCheckout = JSON.parse(localStorage.getItem('sportstore_last_checkout') || 'null');
    return lastCheckout ? [lastCheckout] : [];
  } catch {
    return [];
  }
}

function formatDate(value) {
  if (!value) {
    return 'Дата не вказана';
  }

  return new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value));
}

function formatDeliveryAddress(deliveryInfo) {
  if (!deliveryInfo) {
    return 'Адреса ще не збережена';
  }

  if (deliveryInfo.warehouse) {
    return deliveryInfo.warehouse;
  }

  const address = deliveryInfo.courierAddress;
  if (!address) {
    return 'Адреса ще не збережена';
  }

  return [
    address.street && `вул. ${address.street}`,
    address.building && `буд. ${address.building}`,
    address.entrance && `під’їзд ${address.entrance}`,
    address.floor && `поверх ${address.floor}`,
    address.apartment && `кв. ${address.apartment}`
  ]
    .filter(Boolean)
    .join(', ');
}

export default function Profile() {
  const { user, isAdmin, logout } = useAuth();
  const { count, total } = useCart();
  const orders = readStoredOrders();
  const lastOrder = orders[0];
  const lastDelivery = lastOrder?.deliveryInfo;

  return (
    <section className="container profile-page">
      <div className="page-heading">
        <p className="eyebrow">Профіль</p>
        <h1>Кабінет користувача</h1>
        <p>Дані акаунта беруться з JWT, а локальна історія оформлень зберігається у браузері.</p>
      </div>

      <div className="profile-summary-grid">
        <article className="profile-stat-card">
          <UserRound size={30} />
          <span>Користувач</span>
          <strong>{user?.username || 'Гість'}</strong>
        </article>
        <article className="profile-stat-card">
          <ShieldCheck size={30} />
          <span>Роль</span>
          <strong>{user?.role || 'ROLE_USER'}</strong>
        </article>
        <article className="profile-stat-card">
          <ShoppingBag size={30} />
          <span>Кошик</span>
          <strong>{count} товарів</strong>
          <p>{total.toFixed(2)} грн</p>
        </article>
      </div>

      <div className="profile-dashboard">
        <section className="profile-panel">
          <div className="profile-panel-heading">
            <UserRound size={22} />
            <h2>Мої дані</h2>
          </div>
          <dl className="profile-details-list">
            <div>
              <dt>Username</dt>
              <dd>{user?.username || 'Не вказано'}</dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd>{user?.role || 'ROLE_USER'}</dd>
            </div>
            <div>
              <dt>JWT дійсний до</dt>
              <dd>{user?.expiresAt ? formatDate(user.expiresAt) : 'Не визначено'}</dd>
            </div>
          </dl>
        </section>

        <section className="profile-panel">
          <div className="profile-panel-heading">
            <MapPin size={22} />
            <h2>Остання адреса доставки</h2>
          </div>
          {lastDelivery ? (
            <dl className="profile-details-list">
              <div>
                <dt>ПІБ</dt>
                <dd>{lastDelivery.fullName}</dd>
              </div>
              <div>
                <dt>Телефон</dt>
                <dd>{lastDelivery.phone}</dd>
              </div>
              <div>
                <dt>Місто</dt>
                <dd>{lastDelivery.city}</dd>
              </div>
              <div>
                <dt>Доставка</dt>
                <dd>{lastDelivery.deliveryType}</dd>
              </div>
              <div>
                <dt>Адреса</dt>
                <dd>{formatDeliveryAddress(lastDelivery)}</dd>
              </div>
            </dl>
          ) : (
            <p className="empty-profile-note">Остання адреса доставки з’явиться після оформлення замовлення.</p>
          )}
        </section>
      </div>

      <section className="profile-panel orders-panel">
        <div className="profile-panel-heading">
          <PackageCheck size={22} />
          <h2>Мої замовлення</h2>
        </div>
        {orders.length === 0 ? (
          <p className="empty-profile-note">У вас ще немає замовлень</p>
        ) : (
          <div className="orders-list">
            {orders.map((order, index) => (
              <article className="order-card" key={`${order.createdAt || 'order'}-${index}`}>
                <div>
                  <span>Замовлення #{orders.length - index}</span>
                  <strong>{Number(order.total || 0).toFixed(2)} грн</strong>
                </div>
                <p>
                  <CalendarDays size={16} />
                  {formatDate(order.createdAt)}
                </p>
                <p>
                  <MapPin size={16} />
                  {order.deliveryInfo?.city || 'Місто не вказано'} · {order.deliveryInfo?.deliveryType || 'Доставка не вказана'}
                </p>
                <p>
                  <CreditCard size={16} />
                  {order.deliveryInfo?.paymentType || 'Оплата не вказана'}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>

      <div className="profile-actions">
        <Link className="primary-button" to="/catalog">
          Перейти в каталог
        </Link>
        {isAdmin && (
          <Link className="ghost-button" to="/admin">
            Адмін-панель
          </Link>
        )}
        <button className="ghost-button" type="button" onClick={logout}>
          <LogOut size={18} />
          Вийти
        </button>
      </div>
    </section>
  );
}
