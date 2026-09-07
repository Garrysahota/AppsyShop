import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import type { RootStackParamList } from './types';
import ProductDetailScreen from '@features/products/screens/ProductDetailScreen';
import WishlistScreen from '@features/products/screens/WishlistScreen';
import CheckoutScreen from '@features/checkout/screens/CheckoutScreen';
import OrderSuccessScreen from '@features/checkout/screens/OrderSuccessScreen';
import NotificationsScreen from '@features/notifications/screens/NotificationsScreen';
import useAppSelector from '@shared/hooks/useAppSelector';
import useAppDispatch from '@shared/hooks/useAppDispatch';
import { initializeCurrencyPreference } from '@shared/store/preferencesSlice';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(initializeCurrencyPreference());
  }, [dispatch]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      {isAuthenticated ? (
        <Stack.Group>
          <Stack.Screen name="Main" component={MainTabNavigator} />
          <Stack.Screen
            name="ProductDetail"
            component={ProductDetailScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="Wishlist"
            component={WishlistScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="Notifications"
            component={NotificationsScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="Checkout"
            component={CheckoutScreen}
            options={{ animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="OrderSuccess"
            component={OrderSuccessScreen}
            options={{ animation: 'fade' }}
          />
        </Stack.Group>
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
