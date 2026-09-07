import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, spacing, typography } from '@theme';

interface SocialAuthButtonsProps {
  onGooglePress: () => void;
  onApplePress: () => void;
  isLoading?: boolean;
}

const GoogleIcon = ({ size = 20 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <Path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <Path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="#FBBC05"
    />
    <Path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="#EA4335"
    />
  </Svg>
);

const AppleIcon = ({ size = 20, color = '#FFFFFF' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path
      d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.77 1.06-1.84.94-2.92-1 .04-2.14.67-2.81 1.45-.58.67-1.1 1.77-.96 2.82 1.11.09 2.2-.59 2.83-1.35z"
      fill={color}
    />
  </Svg>
);

export const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({
  onGooglePress,
  onApplePress,
  isLoading = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.dividerRow}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.buttonsRow}>
        <TouchableOpacity
          style={styles.socialButton}
          activeOpacity={0.8}
          disabled={isLoading}
          onPress={onGooglePress}>
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.textOnDark} />
          ) : (
            <>
              <GoogleIcon size={19} />
              <Text style={styles.socialLabel}>Google</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.socialButton}
          activeOpacity={0.8}
          disabled={isLoading}
          onPress={onApplePress}>
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.textOnDark} />
          ) : (
            <>
              <AppleIcon size={20} color={colors.textOnDark} />
              <Text style={styles.socialLabel}>Apple</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.lg,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  dividerText: {
    color: colors.textOnDarkMuted,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: typography.letterSpacing.wider,
    marginHorizontal: spacing.md,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  socialButton: {
    flex: 1,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: spacing.cardRadius - 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    gap: spacing.sm,
  },
  socialIcon: {
    fontSize: 20,
    color: colors.textOnDark,
  },
  socialLabel: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.sm + 1,
    fontWeight: typography.fontWeight.bold,
  },
});

export default SocialAuthButtons;
