/**
 * AuthInput — AppsyShop
 * Custom text input with focus highlight, secure toggle, and validation error support.
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import { Eye, EyeOff, LucideIcon } from 'lucide-react-native';
import { colors, spacing, typography } from '@theme';

interface AuthInputProps extends TextInputProps {
  label: string;
  icon?: LucideIcon;
  error?: string | null;
  isPassword?: boolean;
}

export const AuthInput: React.FC<AuthInputProps> = ({
  label,
  icon: Icon,
  error,
  isPassword = false,
  ...inputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
          Boolean(error) && styles.inputWrapperError,
        ]}>
        {Boolean(Icon) && (
          <View style={styles.iconContainer}>
            {Icon && (
              <Icon
                size={18}
                color={
                  error
                    ? colors.error
                    : isFocused
                    ? colors.primaryGradientStart
                    : 'rgba(255, 255, 255, 0.45)'
                }
              />
            )}
          </View>
        )}

        <TextInput
          style={styles.input}
          placeholderTextColor="rgba(255, 255, 255, 0.35)"
          secureTextEntry={isPassword && !isPasswordVisible}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          selectionColor={colors.primaryGradientEnd}
          autoCapitalize="none"
          {...inputProps}
        />

        {isPassword && (
          <TouchableOpacity
            style={styles.eyeButton}
            activeOpacity={0.7}
            onPress={() => setIsPasswordVisible(prev => !prev)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            {isPasswordVisible ? (
              <EyeOff size={18} color="rgba(255, 255, 255, 0.6)" />
            ) : (
              <Eye size={18} color="rgba(255, 255, 255, 0.6)" />
            )}
          </TouchableOpacity>
        )}
      </View>

      {Boolean(error) && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textOnDark,
    marginBottom: spacing.xs,
    letterSpacing: typography.letterSpacing.wide,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: spacing.cardRadius - 4,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: spacing.md,
    height: 54,
  },
  inputWrapperFocused: {
    borderColor: colors.primaryGradientStart,
    backgroundColor: 'rgba(124, 58, 237, 0.12)',
  },
  inputWrapperError: {
    borderColor: colors.error,
    backgroundColor: 'rgba(244, 63, 94, 0.08)',
  },
  iconContainer: {
    marginRight: spacing.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 18,
    marginRight: spacing.sm + 2,
  },
  input: {
    flex: 1,
    fontSize: typography.fontSize.md,
    color: colors.textOnDark,
    height: '100%',
    paddingVertical: 0,
  },
  eyeButton: {
    padding: spacing.xs,
  },
  eyeIcon: {
    fontSize: 16,
  },
  errorText: {
    fontSize: typography.fontSize.xs + 1,
    color: colors.error,
    marginTop: 4,
    fontWeight: typography.fontWeight.medium,
  },
});

export default AuthInput;
