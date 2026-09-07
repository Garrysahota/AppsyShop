import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowRight,
  Check,
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
  Zap,
} from 'lucide-react-native';
import { colors, spacing, typography } from '@theme';
import useAppDispatch from '@shared/hooks/useAppDispatch';
import useAppSelector from '@shared/hooks/useAppSelector';
import {
  applyCoupon,
  clearCart,
  removeFromCart,
  removeCoupon,
  updateQuantity,
} from '../store/cartSlice';
import { formatINR } from '@shared/utils/currency';

export const CartScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();

  const { items, appliedCoupon, discountPercentage, deliveryFee } = useAppSelector(
    state => state.cart,
  );

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  const subtotal = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );
  const discountAmount = Math.round((subtotal * discountPercentage) / 100);
  const total = Math.max(0, subtotal - discountAmount + deliveryFee);

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    const code = couponCode.trim().toUpperCase();
    if (code === 'VIPDROP10' || code === 'APPSY10' || code === 'SNEAKER20') {
      dispatch(applyCoupon(code));
      setCouponError(null);
      setCouponCode('');
    } else {
      setCouponError('Invalid coupon code. Try "VIPDROP10" or "SNEAKER20"');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0D0819', '#161026', '#1E1435']}
        style={StyleSheet.absoluteFill}
      />

      <View
        style={[
          styles.content,
          {
            paddingTop: Math.max(insets.top, 16) + spacing.xs,
            paddingBottom: insets.bottom + 90,
          },
        ]}>
        
        {}
        <View style={styles.headerRow}>
          <Text style={styles.title}>Your Bag 🛍️</Text>
          {items.length > 0 && (
            <TouchableOpacity onPress={() => dispatch(clearCart())}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>

        {items.length === 0 ? (
          
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <ShoppingBag size={48} color={colors.primaryGradientEnd} />
            </View>
            <Text style={styles.emptyTitle}>Your Bag is Empty</Text>
            <Text style={styles.emptySubtitle}>
              You haven't added any heat yet. Check out the latest exclusive sneaker drops!
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Home')}>
              <LinearGradient
                colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.emptyButtonGradient}>
                <Text style={styles.emptyButtonText}>Explore Drops ⚡</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          /* Items & Summary */
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Delivery Guarantee Pill */}
            <View style={styles.deliveryPill}>
              <Zap size={14} color={colors.accent} />
              <Text style={styles.deliveryPillText}>
                Guaranteed 10-minute drop to Manhattan warehouse zone
              </Text>
            </View>

            {/* Cart Items */}
            {items.map(item => (
              <View
                key={`${item.product.id}-${item.selectedSize}`}
                style={styles.cartCard}>
                <Image
                  source={{ uri: item.product.imageUrl }}
                  style={styles.itemImage}
                  resizeMode="cover"
                />

                <View style={styles.itemDetails}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemBrand}>{item.product.brand}</Text>
                    <TouchableOpacity
                      onPress={() =>
                        dispatch(
                          removeFromCart({
                            productId: item.product.id,
                            size: item.selectedSize,
                            color: item.selectedColor,
                          }),
                        )
                      }>
                      <Trash2 size={16} color={colors.error} />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.product.name}
                  </Text>

                  <View style={styles.metaRow}>
                    <View style={styles.sizePill}>
                      <Text style={styles.sizePillText}>UK {item.selectedSize}</Text>
                    </View>
                    <Text style={styles.itemPrice}>
                      {formatINR(item.product.price * item.quantity)}
                    </Text>
                  </View>

                  {/* Quantity Stepper */}
                  <View style={styles.stepperRow}>
                    <TouchableOpacity
                      style={styles.stepperButton}
                      onPress={() =>
                        dispatch(
                          updateQuantity({
                            productId: item.product.id,
                            size: item.selectedSize,
                            quantity: item.quantity - 1,
                          }),
                        )
                      }>
                      <Minus size={14} color={colors.textOnDark} />
                    </TouchableOpacity>

                    <Text style={styles.quantityText}>{item.quantity}</Text>

                    <TouchableOpacity
                      style={styles.stepperButton}
                      onPress={() =>
                        dispatch(
                          updateQuantity({
                            productId: item.product.id,
                            size: item.selectedSize,
                            quantity: item.quantity + 1,
                          }),
                        )
                      }>
                      <Plus size={14} color={colors.textOnDark} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}

            {/* Promo Code Box */}
            <View style={styles.couponContainer}>
              <View style={styles.couponInputRow}>
                <Tag size={16} color={colors.primaryGradientEnd} style={styles.couponIcon} />
                <TextInput
                  style={styles.couponInput}
                  placeholder="Enter Promo Code (e.g. VIPDROP10)"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  value={couponCode}
                  onChangeText={text => {
                    setCouponCode(text);
                    if (couponError) setCouponError(null);
                  }}
                  autoCapitalize="characters"
                />
                <TouchableOpacity
                  style={styles.couponApplyButton}
                  activeOpacity={0.8}
                  onPress={handleApplyCoupon}>
                  <Text style={styles.couponApplyText}>Apply</Text>
                </TouchableOpacity>
              </View>

              {Boolean(couponError) && (
                <Text style={styles.couponErrorText}>{couponError}</Text>
              )}

              {Boolean(appliedCoupon) && (
                <View style={styles.appliedBadge}>
                  <Check size={14} color={colors.success} />
                  <Text style={styles.appliedText}>
                    Coupon <Text style={styles.bold}>{appliedCoupon}</Text> applied (
                    {discountPercentage}% off)
                  </Text>
                  <TouchableOpacity onPress={() => dispatch(removeCoupon())}>
                    <Text style={styles.removeCouponText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Order Summary */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Order Summary</Text>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>{formatINR(subtotal)}</Text>
              </View>

              {discountAmount > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryDiscountLabel}>Discount ({discountPercentage}%)</Text>
                  <Text style={styles.summaryDiscountValue}>-{formatINR(discountAmount)}</Text>
                </View>
              )}

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery (10-Min Flash)</Text>
                <Text style={styles.summaryFreeValue}>FREE</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.summaryTotalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{formatINR(total)}</Text>
              </View>

              <TouchableOpacity
                style={styles.checkoutButton}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('Checkout')}>
                <LinearGradient
                  colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.checkoutGradient}>
                  <Text style={styles.checkoutText}>
                    Proceed to Drop Checkout ({formatINR(total)})
                  </Text>
                  <ArrowRight size={18} color={colors.textOnDark} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0819',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.screenPadding,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.black,
    color: colors.textOnDark,
  },
  clearText: {
    color: colors.error,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(236, 72, 153, 0.15)',
    borderWidth: 2,
    borderColor: colors.primaryGradientEnd,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.black,
    color: colors.textOnDark,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textOnDarkMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  emptyButton: {
    width: '100%',
    borderRadius: spacing.cardRadius,
    overflow: 'hidden',
  },
  emptyButtonGradient: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyButtonText: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.sm + 1,
    fontWeight: typography.fontWeight.bold,
  },
  deliveryPill: {
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
  deliveryPillText: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
    flex: 1,
  },
  cartCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: spacing.cardRadius - 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: spacing.sm + 2,
    marginBottom: spacing.sm + 4,
    gap: spacing.md,
  },
  itemImage: {
    width: 84,
    height: 84,
    borderRadius: 12,
    backgroundColor: '#1E1435',
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemBrand: {
    color: colors.textOnDarkMuted,
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: typography.letterSpacing.wider,
    textTransform: 'uppercase',
  },
  itemName: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  sizePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  sizePillText: {
    color: colors.textOnDark,
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
  },
  itemPrice: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.black,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 8,
    marginTop: 6,
    padding: 2,
    gap: 8,
  },
  stepperButton: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.bold,
  },
  couponContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: spacing.cardRadius - 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: spacing.md,
    marginVertical: spacing.md,
  },
  couponInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  couponIcon: {
    marginRight: spacing.sm,
  },
  couponInput: {
    flex: 1,
    color: colors.textOnDark,
    fontSize: typography.fontSize.sm,
    paddingVertical: 0,
  },
  couponApplyButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: 8,
  },
  couponApplyText: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  couponErrorText: {
    color: colors.error,
    fontSize: typography.fontSize.xs,
    marginTop: 6,
  },
  appliedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  appliedText: {
    color: colors.success,
    fontSize: typography.fontSize.xs,
    flex: 1,
  },
  bold: {
    fontWeight: typography.fontWeight.bold,
  },
  removeCouponText: {
    color: colors.error,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  summaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: spacing.cardRadius - 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  summaryTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.black,
    color: colors.textOnDark,
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    color: colors.textOnDarkMuted,
    fontSize: typography.fontSize.sm,
  },
  summaryValue: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  summaryDiscountLabel: {
    color: colors.accent,
    fontSize: typography.fontSize.sm,
  },
  summaryDiscountValue: {
    color: colors.accent,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  summaryFreeValue: {
    color: colors.accent,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: spacing.sm + 2,
  },
  summaryTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: spacing.md,
  },
  totalLabel: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  totalValue: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.black,
  },
  checkoutButton: {
    borderRadius: spacing.cardRadius - 4,
    overflow: 'hidden',
  },
  checkoutGradient: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  checkoutText: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.sm + 1,
    fontWeight: typography.fontWeight.extraBold,
  },
});

export default CartScreen;
