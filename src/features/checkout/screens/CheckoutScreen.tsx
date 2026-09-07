import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowLeft,
  ChevronRight,
  CreditCard,
  Home,
  Lock,
  MapPin,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Truck,
  Zap,
} from 'lucide-react-native';
import { colors, spacing, typography } from '@theme';
import useAppDispatch from '@shared/hooks/useAppDispatch';
import useAppSelector from '@shared/hooks/useAppSelector';
import { clearCart } from '@features/cart/store/cartSlice';
import { ensureRazorpayMethod, RAZORPAY_PAYMENT_METHOD, setLastPlacedOrder } from '../store/checkoutSlice';
import AddressModal from '../components/AddressModal';
import PaymentModal from '../components/PaymentModal';
import RazorpayModal from '../components/RazorpayModal';
import { RazorpayPaymentSuccess } from '../types';
import { formatINR } from '@shared/utils/currency';

export const CheckoutScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector(state => state.auth.user);
  const { items, discountPercentage } = useAppSelector(state => state.cart);
  const { addresses, selectedAddressId, paymentMethods, selectedPaymentId } =
    useAppSelector(state => state.checkout);

  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [razorpayModalVisible, setRazorpayModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    dispatch(ensureRazorpayMethod());
  }, [dispatch]);

  const methodsList = paymentMethods.some(p => p.type === 'razorpay')
    ? paymentMethods
    : [RAZORPAY_PAYMENT_METHOD, ...paymentMethods];

  const selectedAddress =
    addresses.find(a => a.id === selectedAddressId) || addresses[0];
  const selectedPayment =
    methodsList.find(p => p.id === selectedPaymentId) ||
    methodsList.find(p => p.type === 'razorpay') ||
    methodsList[0];

  const subtotal = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );
  const discountAmount = Math.round((subtotal * discountPercentage) / 100);
  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      setAddressModalVisible(true);
      return;
    }

    if (selectedPayment?.type === 'razorpay') {
      
      setRazorpayModalVisible(true);
    } else {
      
      completeOrderPlacement();
    }
  };

  const handleRazorpaySuccess = (paymentData: RazorpayPaymentSuccess) => {
    setRazorpayModalVisible(false);
    completeOrderPlacement(paymentData.razorpay_payment_id, paymentData.razorpay_order_id);
  };

  const handleRazorpayFailure = (errorMsg: string) => {
    setRazorpayModalVisible(false);
    Alert.alert('Payment Not Completed', errorMsg);
  };

  const completeOrderPlacement = (razorpayPaymentId?: string, razorpayOrderId?: string) => {
    setIsSubmitting(true);
    setTimeout(() => {
      const orderId = `SNK-${Math.floor(1000 + Math.random() * 9000)}`;

      if (selectedAddress && selectedPayment) {
        dispatch(
          setLastPlacedOrder({
            orderId,
            placedAt: new Date().toISOString(),
            deliveryAddress: selectedAddress,
            paymentMethod: selectedPayment,
            itemsCount: totalItemsCount,
            totalAmount: finalTotal,
            estimatedMinutes: 8,
            status: 'confirmed',
            razorpayPaymentId,
            razorpayOrderId,
          }),
        );
      }

      dispatch(clearCart());
      setIsSubmitting(false);
      navigation.replace('OrderSuccess', {
        orderId,
        total: finalTotal,
        itemsCount: totalItemsCount,
        razorpayPaymentId,
      });
    }, 800);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0D0819', '#161026', '#1E1435']}
        style={StyleSheet.absoluteFill}
      />

      {}
      <View
        style={[
          styles.topBar,
          { paddingTop: Math.max(insets.top, 14) + spacing.xs },
        ]}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.75}
          onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color={colors.textOnDark} />
        </TouchableOpacity>

        <Text style={styles.topBarTitle}>Review & Place Drop</Text>

        <View style={styles.placeholderButton} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 110 },
        ]}>
        
        {}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderLeft}>
              <MapPin size={16} color={colors.accent} />
              <Text style={styles.sectionHeading}>DELIVERY ADDRESS</Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setAddressModalVisible(true)}>
              <Text style={styles.changeLinkText}>Change</Text>
            </TouchableOpacity>
          </View>

          {selectedAddress ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setAddressModalVisible(true)}
              style={styles.addressSummary}>
              <View style={styles.addressTitleRow}>
                <Text style={styles.addressTitleText}>{selectedAddress.title}</Text>
                <View style={styles.dropZoneBadge}>
                  <Zap size={10} color={colors.accent} />
                  <Text style={styles.dropZoneText}>10-MIN ZONE</Text>
                </View>
              </View>

              <Text style={styles.addressRecipient}>{selectedAddress.recipientName}</Text>
              <Text style={styles.addressStreet}>
                {selectedAddress.street}
                {selectedAddress.apartment ? `, ${selectedAddress.apartment}` : ''}
              </Text>
              <Text style={styles.addressCity}>
                {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}
              </Text>

              {Boolean(selectedAddress.deliveryNotes) && (
                <Text style={styles.addressNotes}>
                  💬 {selectedAddress.deliveryNotes}
                </Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.noItemButton}
              onPress={() => setAddressModalVisible(true)}>
              <Text style={styles.noItemText}>+ Add Delivery Address</Text>
            </TouchableOpacity>
          )}
        </View>

        {}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderLeft}>
              <CreditCard size={16} color={colors.primaryGradientEnd} />
              <Text style={styles.sectionHeading}>PAYMENT METHOD</Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setPaymentModalVisible(true)}>
              <Text style={styles.changeLinkText}>Change</Text>
            </TouchableOpacity>
          </View>

          {selectedPayment ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setPaymentModalVisible(true)}
              style={[
                styles.paymentSummaryRow,
                selectedPayment.type === 'razorpay' && styles.razorpaySummaryRow,
              ]}>
              <View
                style={[
                  styles.paymentIconBox,
                  selectedPayment.type === 'razorpay' && styles.rzpIconBox,
                ]}>
                {selectedPayment.type === 'razorpay' ? (
                  <Text style={styles.rzpLogoText}>R</Text>
                ) : selectedPayment.type === 'apple_pay' ? (
                  <Smartphone size={18} color={colors.textOnDark} />
                ) : (
                  <CreditCard size={18} color={colors.primaryGradientEnd} />
                )}
              </View>
              <View style={styles.paymentInfo}>
                <View style={styles.paymentTitleRow}>
                  <Text style={styles.paymentTitle}>{selectedPayment.title}</Text>
                  {selectedPayment.type === 'razorpay' && (
                    <View style={styles.demoPill}>
                      <Text style={styles.demoPillText}>DEMO ⚡</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.paymentSub}>
                  {selectedPayment.type === 'razorpay'
                    ? 'UPI (GPay/PhonePe), 3D Cards, Netbanking'
                    : selectedPayment.type === 'apple_pay'
                    ? '1-Tap biometric authorization'
                    : `Expires ${selectedPayment.expiryDate || '12/28'}`}
                </Text>
              </View>
              <ChevronRight size={18} color="rgba(255, 255, 255, 0.3)" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.noItemButton}
              onPress={() => setPaymentModalVisible(true)}>
              <Text style={styles.noItemText}>+ Select Payment Method</Text>
            </TouchableOpacity>
          )}
        </View>

        {}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderLeft}>
              <Sparkles size={16} color={colors.primaryGradientStart} />
              <Text style={styles.sectionHeading}>BAG ITEMS ({totalItemsCount})</Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.itemsPreviewScroll}>
            {items.map(item => (
              <View
                key={`${item.product.id}-${item.selectedSize}`}
                style={styles.itemPreviewCard}>
                <Image
                  source={{ uri: item.product.imageUrl }}
                  style={styles.itemImage}
                />
                <View style={styles.itemPreviewInfo}>
                  <Text style={styles.itemPreviewName} numberOfLines={1}>
                    {item.product.name}
                  </Text>
                  <Text style={styles.itemPreviewMeta}>
                    UK {item.selectedSize} · Qty {item.quantity} · {formatINR(item.product.price * item.quantity)}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {}
        <View style={styles.guaranteeCard}>
          <View style={styles.guaranteeIconCircle}>
            <Truck size={18} color={colors.accent} />
          </View>
          <View style={styles.guaranteeContent}>
            <Text style={styles.guaranteeTitle}>Instant 10-Minute Drop</Text>
            <Text style={styles.guaranteeSub}>
              Packed with tamper-evident NFC authenticity tag & climate shield.
            </Text>
          </View>
        </View>

        {}
        <View style={styles.sectionCard}>
          <Text style={[styles.sectionHeading, { marginBottom: spacing.sm + 2 }]}>
            PRICE BREAKDOWN
          </Text>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Bag Subtotal</Text>
            <Text style={styles.priceValue}>{formatINR(subtotal)}</Text>
          </View>

          {discountAmount > 0 && (
            <View style={styles.priceRow}>
              <Text style={[styles.priceLabel, { color: colors.accent }]}>
                Drop Discount ({discountPercentage}%)
              </Text>
              <Text style={[styles.priceValue, { color: colors.accent }]}>
                -{formatINR(discountAmount)}
              </Text>
            </View>
          )}

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Instant Courier Delivery</Text>
            <Text style={[styles.priceValue, { color: colors.accent }]}>FREE</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.priceRowTotal}>
            <Text style={styles.totalLabel}>Total Payable</Text>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.totalValue}>{formatINR(finalTotal)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom, 16) + spacing.xs },
        ]}>
        <TouchableOpacity
          activeOpacity={0.88}
          disabled={isSubmitting}
          onPress={handlePlaceOrder}
          style={styles.placeOrderButtonContainer}>
          {selectedPayment?.type === 'razorpay' ? (
            
            <View style={styles.razorpayCtaButton}>
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <View style={styles.placeOrderContent}>
                  <View style={styles.rzpCtaLogo}>
                    <Text style={styles.rzpCtaLogoText}>R</Text>
                  </View>
                  <Text style={styles.placeOrderText}>
                    Pay with Razorpay • {formatINR(finalTotal)} ⚡
                  </Text>
                </View>
              )}
            </View>
          ) : (
            
            <LinearGradient
              colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.placeOrderButton}>
              {isSubmitting ? (
                <ActivityIndicator size="small" color={colors.textOnDark} />
              ) : (
                <View style={styles.placeOrderContent}>
                  <Zap size={18} color={colors.textOnDark} />
                  <Text style={styles.placeOrderText}>
                    Confirm & Place Drop • {formatINR(finalTotal)} ⚡
                  </Text>
                </View>
              )}
            </LinearGradient>
          )}
        </TouchableOpacity>
      </View>

      {}
      <AddressModal
        visible={addressModalVisible}
        onClose={() => setAddressModalVisible(false)}
      />

      <PaymentModal
        visible={paymentModalVisible}
        onClose={() => setPaymentModalVisible(false)}
      />

      {}
      <RazorpayModal
        visible={razorpayModalVisible}
        amount={finalTotal}
        customerEmail={currentUser?.email || 'alex.mercer@appsyshop.com'}
        customerPhone={currentUser?.phoneNumber || '+91 98765 43210'}
        onSuccess={handleRazorpaySuccess}
        onFailure={handleRazorpayFailure}
        onClose={() => setRazorpayModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0819',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.sm,
    backgroundColor: 'rgba(13, 8, 25, 0.85)',
    zIndex: 10,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.black,
  },
  placeholderButton: {
    width: 42,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.md,
  },
  sectionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: spacing.cardRadius - 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm + 2,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionHeading: {
    color: colors.textOnDarkMuted,
    fontSize: 10,
    fontWeight: typography.fontWeight.extraBold,
    letterSpacing: typography.letterSpacing.wider,
  },
  changeLinkText: {
    color: colors.primaryGradientEnd,
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.bold,
  },
  addressSummary: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 10,
    padding: spacing.sm + 2,
  },
  addressTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  addressTitleText: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.sm + 1,
    fontWeight: typography.fontWeight.bold,
  },
  dropZoneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(163, 230, 53, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 3,
  },
  dropZoneText: {
    color: colors.accent,
    fontSize: 9,
    fontWeight: typography.fontWeight.extraBold,
  },
  addressRecipient: {
    color: colors.textOnDarkMuted,
    fontSize: typography.fontSize.xs,
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
    marginTop: 4,
    fontStyle: 'italic',
  },
  noItemButton: {
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderStyle: 'dashed',
    borderRadius: 8,
  },
  noItemText: {
    color: colors.accent,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  paymentSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 10,
    padding: spacing.sm + 2,
    gap: spacing.md,
  },
  razorpaySummaryRow: {
    backgroundColor: 'rgba(11, 103, 212, 0.12)',
    borderColor: 'rgba(11, 103, 212, 0.3)',
    borderWidth: 1,
  },
  paymentIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rzpIconBox: {
    backgroundColor: '#0B67D4',
  },
  rzpLogoText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  demoPill: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderWidth: 1,
    borderColor: '#F59E0B',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  demoPillText: {
    color: '#FBBF24',
    fontSize: 8,
    fontWeight: '900',
  },
  paymentTitle: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.sm + 1,
    fontWeight: typography.fontWeight.bold,
  },
  paymentSub: {
    color: colors.textOnDarkMuted,
    fontSize: typography.fontSize.xs,
    marginTop: 1,
  },
  itemsPreviewScroll: {
    gap: spacing.sm,
  },
  itemPreviewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 10,
    padding: spacing.xs + 2,
    gap: spacing.sm,
    width: 220,
  },
  itemImage: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#1E1736',
  },
  itemPreviewInfo: {
    flex: 1,
  },
  itemPreviewName: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  itemPreviewMeta: {
    color: colors.textOnDarkMuted,
    fontSize: 10,
    marginTop: 2,
  },
  guaranteeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(163, 230, 53, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(163, 230, 53, 0.25)',
    borderRadius: spacing.cardRadius - 4,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  guaranteeIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(163, 230, 53, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guaranteeContent: {
    flex: 1,
  },
  guaranteeTitle: {
    color: colors.accent,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  guaranteeSub: {
    color: colors.textOnDarkMuted,
    fontSize: 11,
    marginTop: 1,
    lineHeight: 15,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs + 2,
  },
  priceLabel: {
    color: colors.textOnDarkMuted,
    fontSize: typography.fontSize.xs + 1,
  },
  priceValue: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.bold,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: spacing.sm,
  },
  priceRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: spacing.xs,
  },
  totalLabel: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.black,
  },
  totalValue: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.black,
  },
  inrEquivalent: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(13, 8, 25, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.sm,
  },
  placeOrderButtonContainer: {
    borderRadius: spacing.cardRadius - 2,
    overflow: 'hidden',
  },
  placeOrderButton: {
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  razorpayCtaButton: {
    height: 54,
    backgroundColor: '#0B67D4',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0B67D4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  placeOrderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  rzpCtaLogo: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: '#0C2340',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rzpCtaLogoText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  placeOrderText: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.extraBold,
    letterSpacing: 0.3,
  },
});

export default CheckoutScreen;
