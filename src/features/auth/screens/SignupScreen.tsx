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
import { AlertCircle, Check, Lock, Mail, User } from 'lucide-react-native';
import { colors, spacing, typography } from '@theme';
import useAppDispatch from '@shared/hooks/useAppDispatch';
import useAppSelector from '@shared/hooks/useAppSelector';
import { clearAuthError, loginSocialUser, registerUser, resetAuthLoading } from '../store/authSlice';
import AuthHeader from '../components/AuthHeader';
import AuthInput from '../components/AuthInput';
import SocialAuthButtons from '../components/SocialAuthButtons';
import type { AuthStackParamList } from '@app/navigation/types';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Signup'>;

export const SignupScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector(state => state.auth);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});

  React.useEffect(() => {
    dispatch(clearAuthError());
    dispatch(resetAuthLoading());
  }, [dispatch]);

  const getPasswordStrength = (): { label: string; score: number; color: string } => {
    if (!password) return { label: '', score: 0, color: 'transparent' };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) return { label: 'Weak', score: 1, color: colors.error };
    if (score <= 3) return { label: 'Medium', score: 2, color: colors.warning };
    return { label: 'Strong', score: 3, color: colors.success };
  };

  const strength = getPasswordStrength();

  const validate = (): boolean => {
    const errors: typeof formErrors = {};

    if (!fullName.trim()) {
      errors.fullName = 'Full name is required';
    }

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

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!agreeTerms) {
      errors.terms = 'Please accept the Terms & Privacy Policy to continue';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignup = async () => {
    if (error) dispatch(clearAuthError());
    if (!validate()) return;

    dispatch(
      registerUser({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
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
            title="Create Account"
            subtitle="Join AppsyShop & unlock VIP sneaker drops, instant checkout and member rewards."
            badgeText="10% OFF FIRST ORDER"
            onBackPress={() => navigation.goBack()}
          />

          {Boolean(error) && (
            <View style={styles.errorBanner}>
              <AlertCircle size={18} color={colors.error} />
              <Text style={styles.errorBannerText}>{error}</Text>
            </View>
          )}

          <View style={styles.form}>
            <AuthInput
              label="FULL NAME"
              icon={User}
              placeholder="Alex Mercer"
              value={fullName}
              onChangeText={text => {
                setFullName(text);
                if (formErrors.fullName) setFormErrors(prev => ({ ...prev, fullName: undefined }));
              }}
              error={formErrors.fullName}
            />

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
              placeholder="Minimum 6 characters"
              isPassword
              value={password}
              onChangeText={text => {
                setPassword(text);
                if (formErrors.password) setFormErrors(prev => ({ ...prev, password: undefined }));
              }}
              error={formErrors.password}
            />

            {}
            {password.length > 0 && (
              <View style={styles.strengthContainer}>
                <View style={styles.strengthBars}>
                  <View
                    style={[
                      styles.strengthBar,
                      strength.score >= 1 && { backgroundColor: strength.color },
                    ]}
                  />
                  <View
                    style={[
                      styles.strengthBar,
                      strength.score >= 2 && { backgroundColor: strength.color },
                    ]}
                  />
                  <View
                    style={[
                      styles.strengthBar,
                      strength.score >= 3 && { backgroundColor: strength.color },
                    ]}
                  />
                </View>
                <Text style={[styles.strengthLabel, { color: strength.color }]}>
                  {strength.label}
                </Text>
              </View>
            )}

            <AuthInput
              label="CONFIRM PASSWORD"
              icon={Lock}
              placeholder="Re-enter password"
              isPassword
              value={confirmPassword}
              onChangeText={text => {
                setConfirmPassword(text);
                if (formErrors.confirmPassword) {
                  setFormErrors(prev => ({ ...prev, confirmPassword: undefined }));
                }
              }}
              error={formErrors.confirmPassword}
            />

            {}
            <TouchableOpacity
              style={styles.termsRow}
              activeOpacity={0.7}
              onPress={() => {
                setAgreeTerms(prev => !prev);
                if (formErrors.terms) setFormErrors(prev => ({ ...prev, terms: undefined }));
              }}>
              <View style={[styles.checkbox, agreeTerms && styles.checkboxChecked]}>
                {agreeTerms && <Check size={12} color={colors.textOnDark} strokeWidth={3} />}
              </View>
              <Text style={styles.termsText}>
                I agree to the <Text style={styles.termsHighlight}>Terms of Service</Text> and{' '}
                <Text style={styles.termsHighlight}>Privacy Policy</Text>
              </Text>
            </TouchableOpacity>

            {Boolean(formErrors.terms) && (
              <Text style={styles.termsError}>{formErrors.terms}</Text>
            )}

            <TouchableOpacity
              activeOpacity={0.85}
              disabled={isLoading}
              onPress={handleSignup}
              style={styles.submitButtonContainer}>
              <LinearGradient
                colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.submitButton}>
                {isLoading ? (
                  <ActivityIndicator color={colors.textOnDark} />
                ) : (
                  <Text style={styles.submitButtonText}>Create Account</Text>
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
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}>Sign In</Text>
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
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: -spacing.xs,
    marginBottom: spacing.sm + 4,
  },
  strengthBars: {
    flexDirection: 'row',
    gap: 6,
    flex: 1,
    marginRight: spacing.md,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  strengthLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: spacing.sm,
    gap: spacing.sm,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
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
  termsText: {
    flex: 1,
    color: colors.textOnDarkMuted,
    fontSize: typography.fontSize.xs + 1,
    lineHeight: 18,
  },
  termsHighlight: {
    color: colors.accent,
    fontWeight: typography.fontWeight.semiBold,
  },
  termsError: {
    color: colors.error,
    fontSize: typography.fontSize.xs + 1,
    marginBottom: spacing.xs,
  },
  submitButtonContainer: {
    marginTop: spacing.md,
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

export default SignupScreen;
