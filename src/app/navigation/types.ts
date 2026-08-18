/**
 * Navigation Types — AppsyShop
 * Central type definitions for all navigators.
 * Import these for useNavigation<NativeStackNavigationProp<AuthStackParamList>>()
 */

export type AuthStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Cart: undefined;
  Orders: undefined;
  Profile: undefined;
  ProductDetail: { productId: string };
  Checkout: undefined;
  OrderSuccess: { orderId: string; total: number; itemsCount: number };
  Wishlist: undefined;
  Notifications: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  ProductDetail: { productId: string };
  Checkout: undefined;
  OrderSuccess: { orderId: string; total: number; itemsCount: number };
  Wishlist: undefined;
  Notifications: undefined;
};
