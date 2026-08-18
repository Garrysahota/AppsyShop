import React, { useEffect, useState } from 'react';
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
import { AlertCircle, Mail, MailCheck, Send } from 'lucide-react-native';
import { colors, spacing, typography } from '@theme';
import useAppDispatch from '@shared/hooks/useAppDispatch';
import useAppSelector from '@shared/hooks/useAppSelector';
import { clearAuthError, resetPasswordResetStatus, sendPasswordReset } from '../store/authSlice';
import AuthHeader from '../components/AuthHeader';
import AuthInput from '../components/AuthInput';
import type { AuthStackParamList } from '@app/navigation/types';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

export const ForgotPasswordScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const { isLoading, error, resetEmailSent } = useAppSelector(state => state.auth);

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>();
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    return () => {
      dispatch(resetPasswordResetStatus());
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  // Countdown timer for resend
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const validate = (): boolean => {
    if (!email.trim()) {
      setEmailError('Email address is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email.trim())) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError(undefined);
    return true;
  };

  const handleSendReset = async () => {
    if (error) dispatch(clearAuthError());
    if (!validate()) return;

    dispatch(sendPasswordReset(email.trim()));
    setCooldown(60);
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
            title="Reset Password"
            subtitle="Don't sweat it. Enter your registered email and we'll send recovery instructions."
            badgeText="SECURE RECOVERY"
            onBackPress={() => navigation.goBack()}
          />

          {Boolean(error) && (
            <View style={styles.errorBanner}>
              <AlertCircle size={18} color={colors.error} />
              <Text style={styles.errorBannerText}>{error}</Text>
            </View>
          )}

          {resetEmailSent ? (
            /* Success State */
            <View style={styles.successCard}>
              <View style={styles.successIconCircle}>
                <MailCheck size={36} color={colors.accent} />
              </View>

              <Text style={styles.successTitle}>Check Your Inbox</Text>
              <Text style={styles.successDesc}>
                We've sent a password reset link to:
              </Text>
              <Text style={styles.emailHighlight}>{email}</Text>
              <Text style={styles.successHint}>
                If you don't see it within a few minutes, be sure to check your spam/junk folder.
              </Text>

              <TouchableOpacity
                activeOpacity={0.8}
                disabled={cooldown > 0 || isLoading}
                onPress={handleSendReset}
                style={[styles.resendButton, cooldown > 0 && styles.resendButtonDisabled]}>
                <Text style={styles.resendButtonText}>
                  {cooldown > 0 ? `Resend email in ${cooldown}s` : 'Resend Email'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => navigation.navigate('Login')}
                style={styles.backToLoginButton}>
                <LinearGradient
                  colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.submitButton}>
                  <Text style={styles.submitButtonText}>Back to Sign In</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            /* Form State */
            <View style={styles.form}>
              <AuthInput
                label="EMAIL ADDRESS"
                icon={Mail}
                placeholder="alex@example.com"
                keyboardType="email-address"
                value={email}
                onChangeText={text => {
                  setEmail(text);
                  if (emailError) setEmailError(undefined);
                }}
                error={emailError}
              />

              <TouchableOpacity
                activeOpacity={0.85}
                disabled={isLoading}
                onPress={handleSendReset}
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
                      <Text style={styles.submitButtonText}>Send Reset Link</Text>
                      <Send size={18} color={colors.textOnDark} style={styles.submitButtonIcon} />
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.footerRow}>
                <Text style={styles.footerText}>Remembered your password? </Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.footerLink}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
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
    marginTop: spacing.sm,
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
    marginTop: spacing.xl,
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
  successCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: spacing.cardRadius,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    padding: spacing.xl,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  successIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(124, 58, 237, 0.2)',
    borderWidth: 2,
    borderColor: colors.primaryGradientStart,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  successIcon: {
    fontSize: 32,
  },
  successTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.black,
    color: colors.textOnDark,
    marginBottom: spacing.xs,
  },
  successDesc: {
    fontSize: typography.fontSize.sm + 1,
    color: colors.textOnDarkMuted,
    textAlign: 'center',
  },
  emailHighlight: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.accent,
    marginVertical: spacing.xs,
  },
  successHint: {
    fontSize: typography.fontSize.xs + 1,
    color: colors.textOnDarkMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  resendButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  resendButtonDisabled: {
    opacity: 0.5,
  },
  resendButtonText: {
    color: colors.primaryGradientEnd,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  backToLoginButton: {
    width: '100%',
    borderRadius: spacing.cardRadius,
    overflow: 'hidden',
  },
});

export default ForgotPasswordScreen;
