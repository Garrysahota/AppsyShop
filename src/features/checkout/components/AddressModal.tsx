import React, { useState } from 'react';
import {
  ActivityIndicator,
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
  Crosshair,
  Home,
  MapPin,
  Navigation,
  Plus,
  Trash2,
  X,
  Zap,
} from 'lucide-react-native';
import { colors, spacing, typography } from '@theme';
import useAppDispatch from '@shared/hooks/useAppDispatch';
import useAppSelector from '@shared/hooks/useAppSelector';
import locationService from '@shared/services/locationService';
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
  const currentUser = useAppSelector(state => state.auth.user);

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [locationSuccessMsg, setLocationSuccessMsg] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [name, setName] = useState(currentUser?.displayName || '');
  const [street, setStreet] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('New York');
  const [state, setState] = useState('NY');
  const [zipCode, setZipCode] = useState('10001');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleUseCurrentLocation = async () => {
    setIsFetchingLocation(true);
    setFormError(null);
    setLocationSuccessMsg(null);

    try {
      const detailed = await locationService.getDetailedAddress();

      setTitle(detailed.title || '📍 Live Drop Location');
      if (!name) {
        setName(currentUser?.displayName || 'Sneakerhead');
      }
      setStreet(detailed.street || 'Current Location Street');
      setCity(detailed.city || 'New York');
      setState(detailed.state || 'NY');
      setZipCode(detailed.zipCode || '10001');
      setLocationSuccessMsg(`Detected: ${detailed.formattedLocation}`);
    } catch (err: any) {
      setFormError('Could not detect location. Please type your street address.');
    } finally {
      setIsFetchingLocation(false);
    }
  };

  const handleQuickAddCurrentLocation = async () => {
    setIsFetchingLocation(true);
    try {
      const detailed = await locationService.getDetailedAddress();
      dispatch(
        addAddress({
          title: '📍 Current Location Drop',
          recipientName: currentUser?.displayName || 'Sneakerhead',
          street: detailed.street,
          apartment: '',
          city: detailed.city,
          state: detailed.state,
          zipCode: detailed.zipCode,
          phone: '+1 (555) 000-0000',
          deliveryNotes: 'Instant drop at current location',
          isDefault: true,
          isFlashDropEligible: true,
        }),
      );
      onClose();
    } catch {
      setIsAddingNew(true);
    } finally {
      setIsFetchingLocation(false);
    }
  };

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

    setIsAddingNew(false);
    setTitle('');
    setName(currentUser?.displayName || '');
    setStreet('');
    setApartment('');
    setDeliveryNotes('');
    setFormError(null);
    setLocationSuccessMsg(null);
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
          {}
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
                  setFormError(null);
                  setLocationSuccessMsg(null);
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
              
              <View style={styles.formContainer}>
                {}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleUseCurrentLocation}
                  disabled={isFetchingLocation}
                  style={styles.useCurrentLocationBtn}>
                  {isFetchingLocation ? (
                    <ActivityIndicator size="small" color={colors.accent} />
                  ) : (
                    <Crosshair size={18} color={colors.accent} />
                  )}
                  <View style={styles.useLocationTextContainer}>
                    <Text style={styles.useLocationTitle}>
                      {isFetchingLocation
                        ? 'Acquiring GPS & Network Address...'
                        : 'Use My Current Location'}
                    </Text>
                    <Text style={styles.useLocationSubtitle}>
                      Auto-fills street, city, state & zip code
                    </Text>
                  </View>
                </TouchableOpacity>

                {Boolean(locationSuccessMsg) && (
                  <View style={styles.successBox}>
                    <CheckCircle2 size={15} color={colors.accent} />
                    <Text style={styles.successText}>{locationSuccessMsg}</Text>
                  </View>
                )}

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

                <View style={styles.rowInputs}>
                  <View style={styles.halfInput}>
                    <Text style={styles.inputLabel}>CITY</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="New York"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                      value={city}
                      onChangeText={setCity}
                    />
                  </View>
                  <View style={styles.halfInput}>
                    <Text style={styles.inputLabel}>STATE / REGION</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="NY"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                      value={state}
                      onChangeText={setState}
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
              
              <View>
                <View style={styles.deliveryBadge}>
                  <Zap size={14} color={colors.accent} />
                  <Text style={styles.deliveryBadgeText}>
                    All saved locations qualify for 10-Minute Instant Drop
                  </Text>
                </View>

                {}
                <TouchableOpacity
                  style={styles.quickLocationButton}
                  activeOpacity={0.8}
                  disabled={isFetchingLocation}
                  onPress={handleQuickAddCurrentLocation}>
                  <View style={styles.quickLocationLeft}>
                    <Crosshair size={18} color={colors.accent} />
                    <View>
                      <Text style={styles.quickLocationTitle}>
                        Deliver to My Current Location
                      </Text>
                      <Text style={styles.quickLocationSubtitle}>
                        Auto-detects GPS address & sets as drop point
                      </Text>
                    </View>
                  </View>
                  {isFetchingLocation && (
                    <ActivityIndicator size="small" color={colors.accent} />
                  )}
                </TouchableOpacity>

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

                {}
                <TouchableOpacity
                  style={styles.addNewButton}
                  activeOpacity={0.8}
                  onPress={() => {
                    setIsAddingNew(true);
                    setFormError(null);
                    setLocationSuccessMsg(null);
                  }}>
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
    maxHeight: '88%',
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
  quickLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(163, 230, 53, 0.1)',
    borderWidth: 1.5,
    borderColor: 'rgba(163, 230, 53, 0.35)',
    borderRadius: spacing.cardRadius - 4,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  quickLocationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  quickLocationTitle: {
    color: colors.accent,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  quickLocationSubtitle: {
    color: colors.textOnDarkMuted,
    fontSize: 11,
    marginTop: 2,
  },
  useCurrentLocationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(163, 230, 53, 0.12)',
    borderWidth: 1.5,
    borderColor: colors.accent,
    borderRadius: spacing.cardRadius - 6,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  useLocationTextContainer: {
    flex: 1,
  },
  useLocationTitle: {
    color: colors.accent,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  useLocationSubtitle: {
    color: colors.textOnDarkMuted,
    fontSize: 11,
    marginTop: 2,
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(163, 230, 53, 0.12)',
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 8,
    padding: 10,
    marginBottom: spacing.md,
  },
  successText: {
    color: colors.accent,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semiBold,
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
    borderRadius: 8,
    padding: 10,
    marginBottom: spacing.md,
  },
  errorText: {
    color: '#FDA4AF',
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semiBold,
  },
  inputLabel: {
    color: colors.textOnDarkMuted,
    fontSize: 10,
    fontWeight: typography.fontWeight.black,
    letterSpacing: typography.letterSpacing.wider,
    marginBottom: 6,
    marginTop: spacing.sm,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: spacing.cardRadius - 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    color: colors.textOnDark,
    fontSize: typography.fontSize.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  multilineInput: {
    height: 70,
    textAlignVertical: 'top',
  },
  saveButtonContainer: {
    borderRadius: spacing.cardRadius - 4,
    overflow: 'hidden',
    marginTop: spacing.lg,
  },
  saveButton: {
    height: 50,
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
