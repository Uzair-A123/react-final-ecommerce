import { memo } from "react";
const CartItem = memo(function CartItem({ item, onInc, onDec, onRemove }) {
  return (
    <div className="mb-2 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800">
      <img src={item.thumbnail} alt={item.title} width="70" />
      <div><strong>{item.title}</strong><p>${item.price} × {item.quantity} = ${(item.price * item.quantity).toFixed(2)}</p></div>
      <div>
        <button onClick={() => onDec(item.id)}>−</button> {item.quantity}{" "}
        <button onClick={() => onInc(item.id)}>+</button>{" "}
        <button onClick={() => onRemove(item.id)}>Remove</button>
      </div>
    </div>
  );
});
export default CartItem;
