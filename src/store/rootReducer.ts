import { combineReducers } from '@reduxjs/toolkit';
import onboardingReducer from '@features/onboarding/store/onboardingSlice';
import authReducer from '@features/auth/store/authSlice';
import productsReducer from '@features/products/store/productsSlice';
import cartReducer from '@features/cart/store/cartSlice';
import checkoutReducer from '@features/checkout/store/checkoutSlice';
import notificationsReducer from '@features/notifications/store/notificationsSlice';
import preferencesReducer from '@shared/store/preferencesSlice';

const rootReducer = combineReducers({
  onboarding: onboardingReducer,
  auth: authReducer,
  products: productsReducer,
  cart: cartReducer,
  checkout: checkoutReducer,
  notifications: notificationsReducer,
  preferences: preferencesReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
