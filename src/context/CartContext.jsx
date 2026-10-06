import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "cart";

const loadCart = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const [cart, setCart] = useState(loadCart);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      return;
    }
  }, [cart]);

  const addToCart = useCallback((product) => {
    setCart((list) => {
      const found = list.find((i) => i.id === product.id);
      if (found) {
        return list.map((i) =>
          i.id === product.id
            ? { ...i, quantity: Math.min(i.quantity + 1, product.stock ?? Infinity) }
            : i
        );
      }
      return [...list, { ...product, quantity: 1 }];
    });
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    setCart((list) =>
      list.map((i) =>
        i.id === id ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock ?? Infinity)) } : i
      )
    );
  }, []);

  const increase = useCallback(
    (id) =>
      setCart((list) =>
        list.map((i) =>
          i.id === id ? { ...i, quantity: Math.min(i.quantity + 1, i.stock ?? Infinity) } : i
        )
      ),
    []
  );

  const decrease = useCallback(
    (id) =>
      setCart((list) =>
        list.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i))
      ),
    []
  );

  const removeFromCart = useCallback(
    (id) => setCart((list) => list.filter((i) => i.id !== id)),
    []
  );

  const clearCart = useCallback(() => setCart([]), []);

  const value = useMemo(
    () => ({
      cart,
      items: cart,
      addToCart,
      updateQuantity,
      increase,
      decrease,
      removeFromCart,
      clearCart,
      totalItems: cart.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    [cart, addToCart, updateQuantity, increase, decrease, removeFromCart, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);