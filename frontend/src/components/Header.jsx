import { Dumbbell, LogOut, Menu, ShoppingBag, UserRound, X } from 'lucide-react';
import { useState } from 'react';
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
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const { isAuthenticated, isAdmin, logout } = useAuth();

  return (
    <header className="site-header">
      <div className="container header-inner">
        <NavLink to="/" className="brand" onClick={() => setOpen(false)}>
          <img src={storeImages.logo} alt="SportStore" />
          <span>SportStore</span>
        </NavLink>

        <button className="icon-button mobile-menu-button" type="button" onClick={() => setOpen((value) => !value)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav className={`main-nav ${open ? 'open' : ''}`}>
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)}>
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
            <NavLink to="/profile" onClick={() => setOpen(false)}>
              <UserRound size={18} />
              Профіль
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" onClick={() => setOpen(false)}>
              <Dumbbell size={18} />
              Адмін
            </NavLink>
          )}
          {isAuthenticated ? (
            <button className="ghost-button mobile-auth-action" type="button" onClick={logout}>
              <LogOut size={18} />
              Вийти
            </button>
          ) : (
            <>
              <NavLink className="mobile-auth-link" to="/login" onClick={() => setOpen(false)}>
                Увійти
              </NavLink>
              <NavLink className="mobile-auth-link" to="/register" onClick={() => setOpen(false)}>
                Реєстрація
              </NavLink>
            </>
          )}
        </nav>

        <div className="header-actions">
          {isAuthenticated ? (
            <button className="ghost-button" type="button" onClick={logout}>
              <LogOut size={18} />
              Вийти
            </button>
          ) : (
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
