export function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_TO_CART": {
      const exists = state.find((i) => i.id === action.payload.id);
      if (exists) {
        return state.map((i) =>
          i.id === exists.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];
    }
    case "REMOVE_FROM_CART":
      return state.filter((i) => i.id !== action.payload);
    case "INCREASE_QUANTITY":
      return state.map((i) =>
        i.id === action.payload ? { ...i, quantity: i.quantity + 1 } : i
      );
    case "DECREASE_QUANTITY":
      return state
        .map((i) =>
          i.id === action.payload ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0);
    case "CLEAR_CART":
      return [];
    default:
      return state;
  }
}
