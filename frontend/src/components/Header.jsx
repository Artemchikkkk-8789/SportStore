import { Dumbbell, LogOut, ShoppingBag, UserRound } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { storeImages } from '../services/assets.js';

const links = [
  { to: '/', label: 'Головна' },
  { to: '/catalog', label: 'Каталог' },
  { to: '/cart', label: 'Кошик' }
];

export default function Header() {
  const { count } = useCart();
  const { isAuthenticated, isAdmin, logout } = useAuth();

  return (
    <header className="site-header">
      <div className="container header-inner">
        <NavLink to="/" className="brand">
          <img src={storeImages.logo} alt="SportStore" />
          <span>SportStore</span>
        </NavLink>

        <nav className="main-nav">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to}>
              {link.label === 'Кошик' ? (
                <span className="cart-link">
                  <ShoppingBag size={18} />
                  {link.label}
                  <span className="cart-badge">{count}</span>
                </span>
              ) : (
                link.label
              )}
            </NavLink>
          ))}
          {isAuthenticated && (
            <NavLink to="/profile">
              <UserRound size={18} />
              Профіль
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin">
              <Dumbbell size={18} />
              Адмін
            </NavLink>
          )}
          {isAuthenticated ? (
            <button className="ghost-button nav-logout-button" type="button" onClick={logout}>
              <LogOut size={18} />
              Вийти
            </button>
          ) : null}
        </nav>

        <div className="header-actions">
          {!isAuthenticated && (
            <>
              <NavLink className="ghost-button" to="/login">
                Увійти
              </NavLink>
              <NavLink className="primary-button compact" to="/register">
                Реєстрація
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
