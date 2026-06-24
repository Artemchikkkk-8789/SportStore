import { CalendarDays, CreditCard, LogOut, MapPin, PackageCheck, ShieldCheck, ShoppingBag, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import StateBlock from '../components/StateBlock.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { api } from '../services/api.js';
import { getOrderStatusClass } from '../services/orderStorage.js';

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

export default function Profile() {
  const { user, isAdmin, logout } = useAuth();
  const { count, total } = useCart();
  const orders = useAsyncData(() => api.getMyOrders(), []);
  const orderList = orders.data || [];
  const lastOrder = orderList[0];

  return (
    <section className="container profile-page">
      <div className="page-heading">
        <p className="eyebrow">Профіль</p>
        <h1>Кабінет користувача</h1>
        <p>Дані акаунта беруться з JWT, а історія замовлень завантажується з backend.</p>
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
              <dt>Email</dt>
              <dd>{user?.email || 'Не вказано'}</dd>
            </div>
            <div>
              <dt>Provider</dt>
              <dd>{user?.provider || 'LOCAL'}</dd>
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
          {lastOrder ? (
            <dl className="profile-details-list">
              <div>
                <dt>ПІБ</dt>
                <dd>{lastOrder.fullName}</dd>
              </div>
              <div>
                <dt>Телефон</dt>
                <dd>{lastOrder.phone}</dd>
              </div>
              <div>
                <dt>Місто</dt>
                <dd>{lastOrder.city}</dd>
              </div>
              <div>
                <dt>Доставка</dt>
                <dd>{lastOrder.deliveryService}</dd>
              </div>
              <div>
                <dt>Відправлення</dt>
                <dd>{lastOrder.dispatchCity || 'Тернопіль'}</dd>
              </div>
              <div>
                <dt>Час доставки</dt>
                <dd>{lastOrder.estimatedDeliveryTime || 'уточнюється'}</dd>
              </div>
              <div>
                <dt>Адреса</dt>
                <dd>{lastOrder.address || 'Адреса ще не збережена'}</dd>
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
        {orders.loading && <StateBlock title="Завантаження замовлень..." />}
        {orders.error && <StateBlock title="Не вдалося завантажити замовлення" text={orders.error} />}
        {!orders.loading && !orders.error && orderList.length === 0 ? (
          <p className="empty-profile-note">У вас ще немає замовлень</p>
        ) : null}
        {!orders.loading && !orders.error && orderList.length > 0 && (
          <div className="orders-list">
            {orderList.map((order, index) => (
              <article className="order-card" key={`${order.createdAt || 'order'}-${index}`}>
                <div>
                  <span>Замовлення #{order.id}</span>
                  <strong>{Number(order.totalPrice || 0).toFixed(2)} грн</strong>
                </div>
                <p>
                  <CalendarDays size={16} />
                  {formatDate(order.createdAt)}
                </p>
                <p>
                  <MapPin size={16} />
                  Звідки відправлено: {order.dispatchCity || 'Тернопіль'}
                </p>
                <p>
                  <CalendarDays size={16} />
                  Орієнтовний час: {order.estimatedDeliveryTime || 'уточнюється'}
                </p>
                <p>
                  <MapPin size={16} />
                  Місто доставки: {order.city || 'не вказано'}
                </p>
                <p>
                  <PackageCheck size={16} />
                  Служба доставки: {order.deliveryService || 'не вказана'}
                </p>
                <p>
                  <span className={`status-badge ${getOrderStatusClass(order.status)}`}>
                    {order.status || 'NEW'}
                  </span>
                </p>
                <p>
                  <CreditCard size={16} />
                  {order.paymentMethod || 'Оплата не вказана'}
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
