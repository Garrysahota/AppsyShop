/**
 * Root Reducer — AppsyShop
 * Combines all feature slices.
 * Add new feature reducers here as the app grows.
 */

import { combineReducers } from '@reduxjs/toolkit';
import onboardingReducer from '@features/onboarding/store/onboardingSlice';
import authReducer from '@features/auth/store/authSlice';
import productsReducer from '@features/products/store/productsSlice';
import cartReducer from '@features/cart/store/cartSlice';
import checkoutReducer from '@features/checkout/store/checkoutSlice';
import notificationsReducer from '@features/notifications/store/notificationsSlice';

const rootReducer = combineReducers({
  onboarding: onboardingReducer,
  auth: authReducer,
  products: productsReducer,
  cart: cartReducer,
  checkout: checkoutReducer,
  notifications: notificationsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
