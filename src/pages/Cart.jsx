import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";
import EmptyState from "../components/EmptyState";
import Button from "../components/Button";

export default function Cart() {
  const { cart, totalItems, totalPrice, increaseQuantity, decreaseQuantity, removeFromCart, clearCart } = useCart();
  if (cart.length === 0) return <EmptyState text="Your cart is empty." />;
  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold">Your Cart</h2>
      {cart.map((i) => (
        <CartItem key={i.id} item={i} onInc={increaseQuantity} onDec={decreaseQuantity} onRemove={removeFromCart} />
      ))}
      <h3 className="mb-2 mt-4 text-lg font-semibold">Items: {totalItems} · Total: ${totalPrice.toFixed(2)}</h3>
      <Button variant="danger" onClick={clearCart}>Clear Cart</Button>
    </div>
  );
}
