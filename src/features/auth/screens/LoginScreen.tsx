import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AlertCircle, Check, Lock, LogIn, Mail } from 'lucide-react-native';
import { colors, spacing, typography } from '@theme';
import useAppDispatch from '@shared/hooks/useAppDispatch';
import useAppSelector from '@shared/hooks/useAppSelector';
import { clearAuthError, loginSocialUser, loginUser } from '../store/authSlice';
import AuthHeader from '../components/AuthHeader';
import AuthInput from '../components/AuthInput';
import SocialAuthButtons from '../components/SocialAuthButtons';
import type { AuthStackParamList } from '@app/navigation/types';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector(state => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});

  const validate = (): boolean => {
    const errors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    if (error) dispatch(clearAuthError());
    if (!validate()) return;

    dispatch(
      loginUser({
        email: email.trim(),
        password,
        rememberMe,
      }),
    );
  };

  const handleSocialLogin = (provider: 'google' | 'apple') => {
    if (error) dispatch(clearAuthError());
    dispatch(loginSocialUser(provider));
  };

  return (
    <LinearGradient
      colors={['#0F0A1E', '#1A1625', '#24143D']}
      style={[styles.container, { paddingTop: Math.max(insets.top, 16) }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 24) + spacing.md },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          
          <AuthHeader
            title="Welcome Back"
            subtitle="Sign in to access your bag, orders and exclusive sneaker drops."
            badgeText="SNEAKERHEAD PASS"
          />

          {Boolean(error) && (
            <View style={styles.errorBanner}>
              <AlertCircle size={18} color={colors.error} />
              <Text style={styles.errorBannerText}>{error}</Text>
            </View>
          )}

          <View style={styles.form}>
            <AuthInput
              label="EMAIL ADDRESS"
              icon={Mail}
              placeholder="alex@example.com"
              keyboardType="email-address"
              value={email}
              onChangeText={text => {
                setEmail(text);
                if (formErrors.email) setFormErrors(prev => ({ ...prev, email: undefined }));
              }}
              error={formErrors.email}
            />

            <AuthInput
              label="PASSWORD"
              icon={Lock}
              placeholder="••••••••"
              isPassword
              value={password}
              onChangeText={text => {
                setPassword(text);
                if (formErrors.password) setFormErrors(prev => ({ ...prev, password: undefined }));
              }}
              error={formErrors.password}
            />

            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={styles.rememberMeRow}
                activeOpacity={0.7}
                onPress={() => setRememberMe(prev => !prev)}>
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe && <Check size={12} color={colors.textOnDark} strokeWidth={3} />}
                </View>
                <Text style={styles.rememberMeText}>Remember me</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              disabled={isLoading}
              onPress={handleLogin}
              style={styles.submitButtonContainer}>
              <LinearGradient
                colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.submitButton}>
                {isLoading ? (
                  <ActivityIndicator color={colors.textOnDark} />
                ) : (
                  <View style={styles.submitButtonContent}>
                    <Text style={styles.submitButtonText}>Sign In</Text>
                    <LogIn size={18} color={colors.textOnDark} style={styles.submitButtonIcon} />
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <SocialAuthButtons
            isLoading={isLoading}
            onGooglePress={() => handleSocialLogin('google')}
            onApplePress={() => handleSocialLogin('apple')}
          />

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.footerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.md,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(244, 63, 94, 0.15)',
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: spacing.cardRadius - 8,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  errorIcon: {
    fontSize: 16,
  },
  errorBannerText: {
    flex: 1,
    color: '#FECDD3',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  form: {
    marginTop: spacing.xs,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  rememberMeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.textOnDark,
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
  },
  rememberMeText: {
    color: colors.textOnDarkMuted,
    fontSize: typography.fontSize.sm,
  },
  forgotPasswordText: {
    color: colors.primaryGradientEnd,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  submitButtonContainer: {
    marginTop: spacing.lg,
    borderRadius: spacing.cardRadius,
    overflow: 'hidden',
  },
  submitButton: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs + 2,
  },
  submitButtonIcon: {
    marginLeft: 2,
  },
  submitButtonText: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.extraBold,
    letterSpacing: typography.letterSpacing.wide,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  footerText: {
    color: colors.textOnDarkMuted,
    fontSize: typography.fontSize.sm + 1,
  },
  footerLink: {
    color: colors.accent,
    fontSize: typography.fontSize.sm + 1,
    fontWeight: typography.fontWeight.bold,
  },
});

export default LoginScreen;
