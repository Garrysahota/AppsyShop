import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '@features/products/types';
import { CartItem, CartState } from '../types';

const initialState: CartState = {
  items: [],
  appliedCoupon: null,
  discountPercentage: 0,
  deliveryFee: 0, 
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{ product: Product; size?: number; color?: string; quantity?: number }>,
    ) => {
      const { product, size, color, quantity = 1 } = action.payload;
      const selectedSize = size || product.sizes[0] || 9;
      const selectedColor = color || product.colors[0] || '#000000';

      const existingIndex = state.items.findIndex(
        item =>
          item.product.id === product.id &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor,
      );

      if (existingIndex >= 0) {
        state.items[existingIndex].quantity += quantity;
      } else {
        state.items.push({
          product,
          selectedSize,
          selectedColor,
          quantity,
        });
      }
    },

    removeFromCart: (
      state,
      action: PayloadAction<{ productId: string; size: number; color?: string }>,
    ) => {
      const { productId, size, color } = action.payload;
      state.items = state.items.filter(
        item =>
          !(
            item.product.id === productId &&
            item.selectedSize === size &&
            (color ? item.selectedColor === color : true)
          ),
      );
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; size: number; quantity: number }>,
    ) => {
      const { productId, size, quantity } = action.payload;
      const item = state.items.find(
        i => i.product.id === productId && i.selectedSize === size,
      );
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(
            i => !(i.product.id === productId && i.selectedSize === size),
          );
        } else {
          item.quantity = quantity;
        }
      }
    },

    applyCoupon: (state, action: PayloadAction<string>) => {
      const code = action.payload.trim().toUpperCase();
      if (code === 'VIPDROP10' || code === 'APPSY10') {
        state.appliedCoupon = code;
        state.discountPercentage = 10;
      } else if (code === 'SNEAKER20') {
        state.appliedCoupon = code;
        state.discountPercentage = 20;
      } else {
        state.appliedCoupon = null;
        state.discountPercentage = 0;
      }
    },

    removeCoupon: state => {
      state.appliedCoupon = null;
      state.discountPercentage = 0;
    },

    clearCart: state => {
      state.items = [];
      state.appliedCoupon = null;
      state.discountPercentage = 0;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  applyCoupon,
  removeCoupon,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
