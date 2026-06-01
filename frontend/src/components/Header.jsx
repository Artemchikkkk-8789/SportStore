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
  const { count } = useCart();
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  function handleLogout() {
    logout();
    closeMobileMenu();
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <NavLink to="/" className="brand" onClick={closeMobileMenu}>
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

        <div className="mobile-header-actions">
          <NavLink className="mobile-cart-link" to="/cart" onClick={closeMobileMenu} aria-label="Кошик">
            <ShoppingBag size={21} />
            <span className="cart-badge">{count}</span>
          </NavLink>
          <button
            className="mobile-menu-button"
            type="button"
            aria-label={isMobileMenuOpen ? 'Закрити меню' : 'Відкрити меню'}
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((current) => !current)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <nav className="container mobile-menu-panel" aria-label="Мобільна навігація">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} onClick={closeMobileMenu}>
              {link.label}
              {link.to === '/cart' && <span className="cart-badge">{count}</span>}
            </NavLink>
          ))}
          {isAuthenticated && (
            <NavLink to="/profile" onClick={closeMobileMenu}>
              Профіль
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" onClick={closeMobileMenu}>
              Адмін
            </NavLink>
          )}
          {isAuthenticated ? (
            <button type="button" onClick={handleLogout}>
              Вийти
            </button>
          ) : (
            <NavLink to="/login" onClick={closeMobileMenu}>
              Увійти
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
