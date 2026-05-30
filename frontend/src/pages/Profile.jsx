import { Crown, LogOut, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Profile() {
  const { user, isAdmin, logout } = useAuth();
  const { count, total } = useCart();

  return (
    <section className="container profile-page">
      <div className="page-heading">
        <p className="eyebrow">Профіль</p>
        <h1>Кабінет користувача</h1>
        <p>Дані профілю отримуються з JWT, який повертає Spring Boot backend.</p>
      </div>

      <div className="profile-grid">
        <article className="profile-card">
          <UserRound size={34} />
          <span>Логін</span>
          <strong>{user?.username}</strong>
        </article>
        <article className="profile-card">
          <Crown size={34} />
          <span>Роль</span>
          <strong>{user?.role}</strong>
        </article>
        <article className="profile-card">
          <span>Кошик</span>
          <strong>{count} товарів</strong>
          <p>{total.toFixed(2)} грн</p>
        </article>
      </div>

      <div className="profile-actions">
        <Link className="primary-button" to="/catalog">
          Продовжити покупки
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
