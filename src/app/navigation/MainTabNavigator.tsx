/**
 * MainTabNavigator — AppsyShop
 * Bottom tab navigator routing Home, Search, Cart, Orders, and Profile.
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '@features/products/screens/HomeScreen';
import SearchScreen from '@features/products/screens/SearchScreen';
import CartScreen from '@features/cart/screens/CartScreen';
import OrdersScreen from '@features/orders/screens/OrdersScreen';
import ProfileScreen from '@features/profile/screens/ProfileScreen';
import CustomBottomTabBar from './CustomBottomTabBar';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomBottomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="Search" component={SearchScreen} options={{ title: 'Search' }} />
      <Tab.Screen name="Cart" component={CartScreen} options={{ title: 'Bag' }} />
      <Tab.Screen name="Orders" component={OrdersScreen} options={{ title: 'Drops' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
