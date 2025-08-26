import { createSlice } from "@reduxjs/toolkit";

const saveCartToLocalStorage = (state) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(state));
  }
};

const initialState = {
  cartItems: [],
  cartTotal: 0,
  coupon: "",
  discount: 0,
  totalAfterDiscount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, price, quantity = 1, title, image, unit } = action.payload;
      if (!product || !price || !title || !image) {
        console.warn("Dữ liệu sản phẩm không hợp lệ:", action.payload);
        return;
      }
      const existingIndex = state.cartItems.findIndex(
        (item) => item.product === product
      );
      if (existingIndex >= 0) {
        state.cartItems[existingIndex].quantity += quantity;
      } else {
        state.cartItems.push({ product, price, quantity, title, image, unit });
      }
      state.cartTotal = state.cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      state.totalAfterDiscount = state.cartTotal * (1 - state.discount / 100);
      saveCartToLocalStorage(state);
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.product !== action.payload
      );
      state.cartTotal = state.cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      state.totalAfterDiscount = state.cartTotal * (1 - state.discount / 100);
      saveCartToLocalStorage(state);
    },

    increaseQuantity: (state, action) => {
      const index = state.cartItems.findIndex(
        (item) => item.product === action.payload
      );
      if (index >= 0) {
        state.cartItems[index].quantity += 1;
        state.cartTotal += state.cartItems[index].price;
        state.totalAfterDiscount = state.cartTotal * (1 - state.discount / 100);
      }
      saveCartToLocalStorage(state);
    },

    decreaseQuantity: (state, action) => {
      const index = state.cartItems.findIndex(
        (item) => item.product === action.payload
      );
      if (index >= 0) {
        if (state.cartItems[index].quantity > 1) {
          state.cartItems[index].quantity -= 1;
          state.cartTotal -= state.cartItems[index].price;
        } else {
          state.cartItems.splice(index, 1);
          state.cartTotal = state.cartItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );
        }
        state.totalAfterDiscount = state.cartTotal * (1 - state.discount / 100);
      }
      saveCartToLocalStorage(state);
    },

    setCart: (state, action) => {
      if (!Array.isArray(action.payload.products)) {
        console.warn("Dữ liệu products không hợp lệ:", action.payload.products);
      }
      state.cartItems = Array.isArray(action.payload.products) ? action.payload.products : [];
      state.cartTotal = action.payload.cartTotal || 0;
      state.coupon = action.payload.coupon || "";
      state.discount = action.payload.discount || 0;
      state.totalAfterDiscount =
        action.payload.totalAfterDiscount ||
        state.cartTotal * (1 - (state.discount || 0) / 100);
      saveCartToLocalStorage(state);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  setCart,
} = cartSlice.actions;
export default cartSlice.reducer;