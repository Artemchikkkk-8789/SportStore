import { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useLocalStorage('sportstore_cart', []);

  function addToCart(product, quantity = 1) {
    setItems((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...current, { ...product, quantity }];
    });
  }

  function removeFromCart(id) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  function updateQuantity(id, quantity) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item))
    );
  }

  function clearCart() {
    setItems([]);
  }

  const summary = useMemo(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return { count, total };
  }, [items]);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, ...summary }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
