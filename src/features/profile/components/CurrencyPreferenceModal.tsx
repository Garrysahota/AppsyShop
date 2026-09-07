import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Switch,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, Globe, HelpCircle, Info, X } from 'lucide-react-native';
import { colors, spacing, typography } from '@theme';
import useAppDispatch from '@shared/hooks/useAppDispatch';
import useAppSelector from '@shared/hooks/useAppSelector';
import {
  setCurrency,
  setAutoDetectCurrency,
  CurrencyType,
} from '@shared/store/preferencesSlice';

interface CurrencyPreferenceModalProps {
  visible: boolean;
  onClose: () => void;
}

export const CurrencyPreferenceModal: React.FC<CurrencyPreferenceModalProps> = ({
  visible,
  onClose,
}) => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  const { currency, autoDetectCurrency, detectedCountry } = useAppSelector(
    state => state.preferences
  );

  const handleSelectCurrency = (type: CurrencyType) => {
    dispatch(setCurrency(type));
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <View
          style={[
            styles.sheetContainer,
            { paddingBottom: Math.max(insets.bottom, 16) + spacing.sm },
          ]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Globe size={18} color={colors.accent} />
              <Text style={styles.headerTitle}>Display Currency</Text>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <X size={18} color={colors.textOnDark} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {/* Auto-detect Toggle */}
            <View style={styles.optionRow}>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>Auto-Detect Location</Text>
                <Text style={styles.optionDescription}>
                  Automatically switch currency based on your GPS / IP country.
                </Text>
              </View>
              <Switch
                value={autoDetectCurrency}
                onValueChange={val => {
                  dispatch(setAutoDetectCurrency(val));
                }}
                trackColor={{ false: '#3E3A4A', true: colors.primary }}
                thumbColor={autoDetectCurrency ? colors.accent : '#F3F4F6'}
              />
            </View>

            {autoDetectCurrency && (
              <View style={styles.detectedBadge}>
                <Info size={12} color={colors.accent} />
                <Text style={styles.detectedText}>
                  Detected Location: <Text style={styles.bold}>{detectedCountry}</Text>
                </Text>
              </View>
            )}

            <View style={styles.divider} />

            <Text style={styles.sectionHeading}>SELECT CURRENCY MANUALLY</Text>

            {/* Currency Options */}
            <View style={styles.optionsList}>
              {/* INR */}
              <TouchableOpacity
                activeOpacity={autoDetectCurrency ? 1 : 0.8}
                disabled={autoDetectCurrency}
                onPress={() => handleSelectCurrency('INR')}
                style={[
                  styles.currencyCard,
                  currency === 'INR' && styles.currencyCardActive,
                  autoDetectCurrency && styles.currencyCardDisabled,
                ]}>
                <View style={styles.currencyIconBox}>
                  <Text style={styles.currencySymbolText}>₹</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.currencyName}>Indian Rupee (INR)</Text>
                  <Text style={styles.currencyDetail}>Rupee pricing (standard formatting)</Text>
                </View>
                {currency === 'INR' && <Check size={18} color={colors.accent} />}
              </TouchableOpacity>

              {/* USD */}
              <TouchableOpacity
                activeOpacity={autoDetectCurrency ? 1 : 0.8}
                disabled={autoDetectCurrency}
                onPress={() => handleSelectCurrency('USD')}
                style={[
                  styles.currencyCard,
                  currency === 'USD' && styles.currencyCardActive,
                  autoDetectCurrency && styles.currencyCardDisabled,
                ]}>
                <View style={styles.currencyIconBox}>
                  <Text style={styles.currencySymbolText}>$</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.currencyName}>US Dollar (USD)</Text>
                  <Text style={styles.currencyDetail}>Dollar pricing (global standard)</Text>
                </View>
                {currency === 'USD' && <Check size={18} color={colors.accent} />}
              </TouchableOpacity>
            </View>

            {autoDetectCurrency && (
              <Text style={styles.helperText}>
                * Disable auto-detect to manually select your shopping currency preference.
              </Text>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  sheetContainer: {
    backgroundColor: '#161026',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.black,
    color: colors.textOnDark,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.md,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  optionTextContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  optionTitle: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.sm + 1,
    fontWeight: typography.fontWeight.bold,
  },
  optionDescription: {
    color: colors.textOnDarkMuted,
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  detectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(163, 230, 53, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(163, 230, 53, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
  },
  detectedText: {
    color: colors.textOnDark,
    fontSize: 10,
  },
  bold: {
    fontWeight: typography.fontWeight.black,
    color: colors.accent,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginVertical: spacing.md,
  },
  sectionHeading: {
    color: colors.textOnDarkMuted,
    fontSize: 10,
    fontWeight: typography.fontWeight.extraBold,
    letterSpacing: typography.letterSpacing.wider,
    marginBottom: 12,
  },
  optionsList: {
    gap: 10,
    marginBottom: spacing.lg,
  },
  currencyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    padding: spacing.md,
    gap: spacing.md,
  },
  currencyCardActive: {
    backgroundColor: 'rgba(138, 35, 135, 0.12)',
    borderColor: colors.primary,
  },
  currencyCardDisabled: {
    opacity: 0.6,
  },
  currencyIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencySymbolText: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.black,
  },
  currencyName: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  currencyDetail: {
    color: colors.textOnDarkMuted,
    fontSize: 10,
    marginTop: 2,
  },
  helperText: {
    color: colors.textOnDarkMuted,
    fontSize: 10,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default CurrencyPreferenceModal;
