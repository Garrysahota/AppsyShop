/**
 * AuthHeader — AppsyShop
 * High-impact brand header for auth screens.
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft, Zap } from 'lucide-react-native';
import { colors, spacing, typography } from '@theme';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
  badgeText?: string;
  onBackPress?: () => void;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  title,
  subtitle,
  badgeText = 'VIP DROP ACCESS',
  onBackPress,
}) => {
  return (
    <View style={styles.container}>
      {onBackPress && (
        <TouchableOpacity
          onPress={onBackPress}
          style={styles.backButton}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <ArrowLeft size={20} color={colors.textOnDark} />
        </TouchableOpacity>
      )}

      <View style={styles.badgeRow}>
        <LinearGradient
          colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.badge}>
          <Zap size={13} color={colors.textOnDark} style={styles.badgeIcon} />
          <Text style={styles.badgeText}>{badgeText}</Text>
        </LinearGradient>
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: colors.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  backButtonText: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  badgeIcon: {
    marginRight: 2,
  },
  badgeText: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.extraBold,
    letterSpacing: typography.letterSpacing.wider,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.black,
    color: colors.textOnDark,
    letterSpacing: typography.letterSpacing.tight,
    marginTop: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.md,
    color: colors.textOnDarkMuted,
    lineHeight: typography.fontSize.md * typography.lineHeight.normal,
    marginTop: spacing.xs,
  },
});

export default AuthHeader;
