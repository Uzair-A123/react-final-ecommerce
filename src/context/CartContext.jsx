import { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from "react";
import { cartReducer } from "../reducers/cartReducer";

const CartContext = createContext(null);

export function CartProvider({ children }) {

  const [cart, dispatch] = useReducer(cartReducer, [], () => {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((p) => dispatch({ type: "ADD_TO_CART", payload: p }), []);
  const removeFromCart = useCallback((id) => dispatch({ type: "REMOVE_FROM_CART", payload: id }), []);
  const increaseQuantity = useCallback((id) => dispatch({ type: "INCREASE_QUANTITY", payload: id }), []);
  const decreaseQuantity = useCallback((id) => dispatch({ type: "DECREASE_QUANTITY", payload: id }), []);
  const clearCart = useCallback(() => dispatch({ type: "CLEAR_CART" }), []);

  const totalItems = useMemo(() => cart.reduce((sum, i) => sum + i.quantity, 0), [cart]);
  const totalPrice = useMemo(() => cart.reduce((sum, i) => sum + i.price * i.quantity, 0), [cart]);

  const value = { cart, totalItems, totalPrice, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
