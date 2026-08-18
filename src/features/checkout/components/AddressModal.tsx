/**
 * AddressModal — AppsyShop
 * Bottom sheet modal to select a saved delivery address or add a new address.
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
  CheckCircle2,
  Home,
  MapPin,
  Plus,
  Trash2,
  X,
  Zap,
} from 'lucide-react-native';
import { colors, spacing, typography } from '@theme';
import useAppDispatch from '@shared/hooks/useAppDispatch';
import useAppSelector from '@shared/hooks/useAppSelector';
import {
  addAddress,
  deleteAddress,
  selectAddress,
} from '../store/checkoutSlice';
import { DeliveryAddress } from '../types';

interface AddressModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AddressModal: React.FC<AddressModalProps> = ({
  visible,
  onClose,
}) => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { addresses, selectedAddressId } = useAppSelector(state => state.checkout);

  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [street, setStreet] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('New York');
  const [state, setState] = useState('NY');
  const [zipCode, setZipCode] = useState('10001');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSaveNewAddress = () => {
    if (!street.trim() || !name.trim()) {
      setFormError('Recipient name and street address are required');
      return;
    }

    dispatch(
      addAddress({
        title: title.trim() || 'Custom Drop Address',
        recipientName: name.trim(),
        street: street.trim(),
        apartment: apartment.trim(),
        city: city.trim(),
        state: state.trim(),
        zipCode: zipCode.trim(),
        phone: '+1 (555) 000-0000',
        deliveryNotes: deliveryNotes.trim(),
        isDefault: false,
        isFlashDropEligible: true,
      }),
    );

    // Reset
    setIsAddingNew(false);
    setTitle('');
    setName('');
    setStreet('');
    setApartment('');
    setDeliveryNotes('');
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
              <MapPin size={18} color={colors.accent} />
              <Text style={styles.headerTitle}>
                {isAddingNew ? 'Add New Address' : 'Delivery Address'}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                if (isAddingNew) {
                  setIsAddingNew(false);
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
            
            {isAddingNew ? (
              /* Add New Address Form */
              <View style={styles.formContainer}>
                {Boolean(formError) && (
                  <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{formError}</Text>
                  </View>
                )}

                <Text style={styles.inputLabel}>ADDRESS LABEL (E.G. HOME, OFFICE)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Penthouse Loft"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  value={title}
                  onChangeText={setTitle}
                />

                <Text style={styles.inputLabel}>RECIPIENT FULL NAME *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Alex Mercer"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  value={name}
                  onChangeText={setName}
                />

                <Text style={styles.inputLabel}>STREET ADDRESS *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="350 5th Ave"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  value={street}
                  onChangeText={setStreet}
                />

                <View style={styles.rowInputs}>
                  <View style={styles.halfInput}>
                    <Text style={styles.inputLabel}>APT / SUITE</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Apt 14B"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                      value={apartment}
                      onChangeText={setApartment}
                    />
                  </View>
                  <View style={styles.halfInput}>
                    <Text style={styles.inputLabel}>ZIP CODE</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="10001"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                      value={zipCode}
                      onChangeText={setZipCode}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <Text style={styles.inputLabel}>DELIVERY INSTRUCTIONS (OPTIONAL)</Text>
                <TextInput
                  style={[styles.input, styles.multilineInput]}
                  placeholder="Leave with front desk / doorman..."
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  value={deliveryNotes}
                  onChangeText={setDeliveryNotes}
                  multiline
                />

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleSaveNewAddress}
                  style={styles.saveButtonContainer}>
                  <LinearGradient
                    colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>Save Address 📍</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ) : (
              /* Address List */
              <View>
                <View style={styles.deliveryBadge}>
                  <Zap size={14} color={colors.accent} />
                  <Text style={styles.deliveryBadgeText}>
                    All saved locations qualify for 10-Minute Instant Drop
                  </Text>
                </View>

                {addresses.map(addr => {
                  const isSelected = selectedAddressId === addr.id;
                  return (
                    <TouchableOpacity
                      key={addr.id}
                      activeOpacity={0.8}
                      onPress={() => {
                        dispatch(selectAddress(addr.id));
                        onClose();
                      }}
                      style={[
                        styles.addressCard,
                        isSelected && styles.addressCardSelected,
                      ]}>
                      <View style={styles.addressTop}>
                        <View style={styles.titleWithIcon}>
                          <Home size={16} color={isSelected ? colors.accent : colors.textOnDarkMuted} />
                          <Text style={styles.addressTitle}>{addr.title}</Text>
                        </View>

                        <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                          {isSelected && <Check size={12} color="#000" strokeWidth={3} />}
                        </View>
                      </View>

                      <Text style={styles.addressRecipient}>{addr.recipientName}</Text>
                      <Text style={styles.addressStreet}>
                        {addr.street} {addr.apartment ? `, ${addr.apartment}` : ''}
                      </Text>
                      <Text style={styles.addressCity}>
                        {addr.city}, {addr.state} {addr.zipCode}
                      </Text>

                      {Boolean(addr.deliveryNotes) && (
                        <Text style={styles.addressNotes}>💬 {addr.deliveryNotes}</Text>
                      )}
                    </TouchableOpacity>
                  );
                })}

                {/* Add New Address Button */}
                <TouchableOpacity
                  style={styles.addNewButton}
                  activeOpacity={0.8}
                  onPress={() => setIsAddingNew(true)}>
                  <Plus size={18} color={colors.accent} />
                  <Text style={styles.addNewText}>Add New Delivery Address</Text>
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
  deliveryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(163, 230, 53, 0.15)',
    borderWidth: 1,
    borderColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: spacing.md,
    gap: 6,
  },
  deliveryBadgeText: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
    flex: 1,
  },
  addressCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: spacing.cardRadius - 4,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  addressCardSelected: {
    backgroundColor: 'rgba(124, 58, 237, 0.2)',
    borderColor: colors.primaryGradientStart,
  },
  addressTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addressTitle: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.sm + 1,
    fontWeight: typography.fontWeight.black,
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
  addressRecipient: {
    color: colors.textOnDarkMuted,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    marginTop: 2,
  },
  addressStreet: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    marginTop: 2,
  },
  addressCity: {
    color: colors.textOnDarkMuted,
    fontSize: typography.fontSize.xs,
    marginTop: 1,
  },
  addressNotes: {
    color: colors.accent,
    fontSize: 11,
    marginTop: 6,
    fontStyle: 'italic',
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
  multilineInput: {
    height: 70,
    paddingTop: 10,
    textAlignVertical: 'top',
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

export default AddressModal;
