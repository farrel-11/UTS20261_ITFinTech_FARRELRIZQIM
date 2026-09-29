import { createContext, useContext, useState, useEffect, useRef } from 'react';

const CartContext = createContext();
const STORAGE_KEY = 'bonechick_cart';

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const hasHydrated = useRef(false);

  // Hydrate dari localStorage sekali aja, setelah mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCart(parsed);
        }
      }
    } catch (err) {
      console.warn('Failed to load cart:', err);
    } finally {
      hasHydrated.current = true;
    }
  }, []);

  // Persist ke localStorage — hanya setelah hydrated (biar nggak overwrite dengan [] kosong)
  useEffect(() => {
    if (!hasHydrated.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (err) {
      console.warn('Failed to save cart:', err);
    }
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, qty: item.qty + delta } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = Math.round(subtotal * 0.1);
  const shipping = cart.length > 0 ? 5000 : 0;
  const total = subtotal + tax + shipping;
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQty,
        removeItem,
        clearCart,
        subtotal,
        tax,
        shipping,
        total,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);