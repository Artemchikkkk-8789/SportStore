import { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';

const CartContext = createContext(null);

function getCartKey(item) {
  return item.cartKey || `${item.id}-${item.selectedSize || item.size || ''}-${item.selectedColor || ''}`;
}

export function CartProvider({ children }) {
  const [items, setItems] = useLocalStorage('sportstore_cart', []);

  function addToCart(product, quantity = 1) {
    const selectedSize = product.selectedSize || product.size || '';
    const selectedColor = product.selectedColor || '';
    const cartKey = `${product.id}-${selectedSize}-${selectedColor}`;

    setItems((current) => {
      const existing = current.find((item) => getCartKey(item) === cartKey);
      if (existing) {
        return current.map((item) =>
          getCartKey(item) === cartKey ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...current, { ...product, cartKey, selectedSize, selectedColor, quantity }];
    });
  }

  function removeFromCart(cartKey) {
    setItems((current) => current.filter((item) => getCartKey(item) !== cartKey));
  }

  function updateQuantity(cartKey, quantity) {
    setItems((current) =>
      current.map((item) => (getCartKey(item) === cartKey ? { ...item, quantity: Math.max(1, quantity) } : item))
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
