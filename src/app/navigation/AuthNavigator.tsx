import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '@features/splash/screens/SplashScreen';
import OnboardingScreen from '@features/onboarding/screens/OnboardingScreen';
import LoginScreen from '@features/auth/screens/LoginScreen';
import SignupScreen from '@features/auth/screens/SignupScreen';
import ForgotPasswordScreen from '@features/auth/screens/ForgotPasswordScreen';
import type { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
    <Stack.Screen name="Splash" component={SplashScreen} />
    <Stack.Screen
      name="Onboarding"
      component={OnboardingScreen}
      options={{ animation: 'slide_from_right' }}
    />
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{ animation: 'slide_from_bottom' }}
    />
    <Stack.Screen
      name="Signup"
      component={SignupScreen}
      options={{ animation: 'slide_from_right' }}
    />
    <Stack.Screen
      name="ForgotPassword"
      component={ForgotPasswordScreen}
      options={{ animation: 'slide_from_right' }}
    />
  </Stack.Navigator>
);

export default AuthNavigator;
