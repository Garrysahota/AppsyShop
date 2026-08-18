/**
 * SocialAuthButtons — AppsyShop
 * Apple & Google social sign-in buttons with dark glass aesthetic.
 */

import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Globe, Sparkles } from 'lucide-react-native';
import { colors, spacing, typography } from '@theme';

interface SocialAuthButtonsProps {
  onGooglePress: () => void;
  onApplePress: () => void;
  isLoading?: boolean;
}

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
              <Globe size={18} color={colors.textOnDark} />
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
              <Sparkles size={18} color={colors.textOnDark} />
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
