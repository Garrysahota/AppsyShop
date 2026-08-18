/**
 * PaymentModal — AppsyShop
 * Bottom sheet modal to select a payment method or add a new card.
 */

import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Check,
  CreditCard,
  Plus,
  ShieldCheck,
  Smartphone,
  Sparkles,
  X,
} from 'lucide-react-native';
import { colors, spacing, typography } from '@theme';
import useAppDispatch from '@shared/hooks/useAppDispatch';
import useAppSelector from '@shared/hooks/useAppSelector';
import {
  addPaymentMethod,
  selectPaymentMethod,
} from '../store/checkoutSlice';
import { PaymentMethod } from '../types';

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  visible,
  onClose,
}) => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { paymentMethods, selectedPaymentId } = useAppSelector(
    state => state.checkout,
  );

  const [isAddingCard, setIsAddingCard] = useState(false);

  // Form State
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Format Card Number (adds space every 4 digits)
  const handleCardNumberChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 16);
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    setCardNumber(formatted);
  };

  // Format Expiry (MM/YY)
  const handleExpiryChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 3) {
      setExpiry(`${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`);
    } else {
      setExpiry(cleaned);
    }
  };

  const handleSaveCard = () => {
    const rawCard = cardNumber.replace(/\s/g, '');
    if (!cardholderName.trim() || rawCard.length < 15 || expiry.length < 4 || cvv.length < 3) {
      setFormError('Please enter valid card details');
      return;
    }

    const last4 = rawCard.slice(-4);
    dispatch(
      addPaymentMethod({
        type: 'card',
        title: `Visa ending in ${last4}`,
        cardLast4: last4,
        cardBrand: 'visa',
        expiryDate: expiry,
        isDefault: false,
      }),
    );

    setIsAddingCard(false);
    setCardholderName('');
    setCardNumber('');
    setExpiry('');
    setCvv('');
    setFormError(null);
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}>
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
              <CreditCard size={18} color={colors.accent} />
              <Text style={styles.headerTitle}>
                {isAddingCard ? 'Add New Card' : 'Payment Method'}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                if (isAddingCard) {
                  setIsAddingCard(false);
                } else {
                  onClose();
                }
              }}
              style={styles.closeButton}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <X size={18} color={colors.textOnDark} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled">
            
            {isAddingCard ? (
              /* Add New Card Form */
              <View style={styles.formContainer}>
                {Boolean(formError) && (
                  <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{formError}</Text>
                  </View>
                )}

                <Text style={styles.inputLabel}>CARDHOLDER NAME</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Alex Mercer"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  value={cardholderName}
                  onChangeText={setCardholderName}
                />

                <Text style={styles.inputLabel}>CARD NUMBER</Text>
                <TextInput
                  style={styles.input}
                  placeholder="4000 1234 5678 9010"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  value={cardNumber}
                  onChangeText={handleCardNumberChange}
                  keyboardType="numeric"
                />

                <View style={styles.rowInputs}>
                  <View style={styles.halfInput}>
                    <Text style={styles.inputLabel}>EXPIRY (MM/YY)</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="08/28"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                      value={expiry}
                      onChangeText={handleExpiryChange}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.halfInput}>
                    <Text style={styles.inputLabel}>CVV / CVC</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="123"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                      value={cvv}
                      onChangeText={text => setCvv(text.slice(0, 4))}
                      keyboardType="numeric"
                      secureTextEntry
                    />
                  </View>
                </View>

                <View style={styles.encryptionNotice}>
                  <ShieldCheck size={14} color={colors.success} />
                  <Text style={styles.encryptionText}>
                    End-to-end 256-bit encrypted checkout. PCI-DSS Level 1 certified.
                  </Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleSaveCard}
                  style={styles.saveButtonContainer}>
                  <LinearGradient
                    colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>Save Card 💳</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ) : (
              /* Payment Methods List */
              <View>
                {paymentMethods.map(pay => {
                  const isSelected = selectedPaymentId === pay.id;
                  return (
                    <TouchableOpacity
                      key={pay.id}
                      activeOpacity={0.8}
                      onPress={() => {
                        dispatch(selectPaymentMethod(pay.id));
                        onClose();
                      }}
                      style={[
                        styles.paymentCard,
                        isSelected && styles.paymentCardSelected,
                      ]}>
                      <View style={styles.paymentIconCircle}>
                        {pay.type === 'apple_pay' ? (
                          <Smartphone size={18} color={colors.textOnDark} />
                        ) : (
                          <CreditCard size={18} color={colors.primaryGradientEnd} />
                        )}
                      </View>

                      <View style={styles.paymentInfo}>
                        <Text style={styles.paymentTitle}>{pay.title}</Text>
                        <Text style={styles.paymentSubtitle}>
                          {pay.type === 'apple_pay'
                            ? 'Instant Touch / Face ID authorization'
                            : `Expires ${pay.expiryDate || '12/28'}`}
                        </Text>
                      </View>

                      <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                        {isSelected && <Check size={12} color="#000" strokeWidth={3} />}
                      </View>
                    </TouchableOpacity>
                  );
                })}

                {/* Add New Card Button */}
                <TouchableOpacity
                  style={styles.addNewButton}
                  activeOpacity={0.8}
                  onPress={() => setIsAddingCard(true)}>
                  <Plus size={18} color={colors.accent} />
                  <Text style={styles.addNewText}>Add Credit / Debit Card</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  sheetContainer: {
    backgroundColor: '#161026',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    maxHeight: '85%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 24,
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
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.md,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: spacing.cardRadius - 4,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  paymentCardSelected: {
    backgroundColor: 'rgba(124, 58, 237, 0.2)',
    borderColor: colors.primaryGradientStart,
  },
  paymentIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.sm + 1,
    fontWeight: typography.fontWeight.bold,
  },
  paymentSubtitle: {
    color: colors.textOnDarkMuted,
    fontSize: typography.fontSize.xs,
    marginTop: 2,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  addNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(163, 230, 53, 0.12)',
    borderWidth: 1.5,
    borderColor: colors.accent,
    borderRadius: spacing.cardRadius - 4,
    paddingVertical: spacing.md,
    gap: spacing.xs + 2,
    marginVertical: spacing.sm,
  },
  addNewText: {
    color: colors.accent,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  formContainer: {
    paddingBottom: spacing.lg,
  },
  errorBox: {
    backgroundColor: 'rgba(244, 63, 94, 0.15)',
    borderWidth: 1,
    borderColor: colors.error,
    padding: spacing.sm,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  errorText: {
    color: '#FECDD3',
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  inputLabel: {
    fontSize: 9,
    fontWeight: typography.fontWeight.extraBold,
    color: colors.textOnDarkMuted,
    letterSpacing: typography.letterSpacing.wider,
    marginBottom: 4,
    marginTop: spacing.sm,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: spacing.cardRadius - 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: spacing.md,
    height: 48,
    color: colors.textOnDark,
    fontSize: typography.fontSize.sm,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  encryptionNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.md,
  },
  encryptionText: {
    color: colors.textOnDarkMuted,
    fontSize: 10,
    flex: 1,
  },
  saveButtonContainer: {
    borderRadius: spacing.cardRadius,
    overflow: 'hidden',
    marginTop: spacing.lg,
  },
  saveButton: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.extraBold,
  },
});

export default PaymentModal;
