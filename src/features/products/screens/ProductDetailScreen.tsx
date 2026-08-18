/**
 * ProductDetailScreen — AppsyShop
 * Flagship sneaker deep dive with interactive size/color selectors, authenticity guarantee,
 * and sticky "Add to Bag / Cop Now" checkout bar.
 */

import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import {
  ArrowLeft,
  Check,
  Flame,
  Heart,
  Minus,
  Plus,
  RotateCw,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  Zap,
} from 'lucide-react-native';
import { colors, spacing, typography } from '@theme';
import useAppDispatch from '@shared/hooks/useAppDispatch';
import useAppSelector from '@shared/hooks/useAppSelector';
import { toggleFavorite } from '../store/productsSlice';
import { addToCart, updateQuantity } from '@features/cart/store/cartSlice';
import type { MainTabParamList } from '@app/navigation/types';

const { width } = Dimensions.get('window');

type ProductDetailRouteProp = RouteProp<MainTabParamList, 'ProductDetail'>;

export const ProductDetailScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<ProductDetailRouteProp>();
  const dispatch = useAppDispatch();

  const productId = route.params?.productId;
  const products = useAppSelector(state => state.products.items);
  const favorites = useAppSelector(state => state.products.favorites);
  const cartItems = useAppSelector(state => state.cart.items);

  const product = products.find(p => p.id === productId) || products[0];
  const isFavorite = favorites.includes(product.id);

  // User selections
  const [selectedSize, setSelectedSize] = useState<number>(product.sizes[0] || 9);
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0] || '#000000');
  const [quantity, setQuantity] = useState<number>(1);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  const cartItem = cartItems.find(
    i => i.product.id === product.id && i.selectedSize === selectedSize,
  );
  const inBagQuantity = cartItem?.quantity || 0;

  const handleAddOrIncrement = () => {
    dispatch(
      addToCart({
        product,
        size: selectedSize,
        color: selectedColor,
        quantity: 1,
      }),
    );
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
    }, 1500);
  };

  const handleDecrement = () => {
    if (cartItem) {
      dispatch(
        updateQuantity({
          productId: product.id,
          size: selectedSize,
          quantity: inBagQuantity - 1,
        }),
      );
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0D0819', '#161026', '#1E1435']}
        style={StyleSheet.absoluteFill}
      />

      {/* ─── Top Header Bar ─────────────────────────────────────────────── */}
      <View
        style={[
          styles.topBar,
          { paddingTop: Math.max(insets.top, 14) + spacing.xs },
        ]}>
        <TouchableOpacity
          style={styles.iconButton}
          activeOpacity={0.75}
          onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color={colors.textOnDark} />
        </TouchableOpacity>

        <View style={styles.topBarBadge}>
          <Text style={styles.topBarBrand}>{product.brand.toUpperCase()}</Text>
        </View>

        <View style={styles.topBarRight}>
          <TouchableOpacity
            style={styles.iconButton}
            activeOpacity={0.75}
            onPress={() => dispatch(toggleFavorite(product.id))}>
            <Heart
              size={20}
              color={isFavorite ? colors.error : colors.textOnDark}
              fill={isFavorite ? colors.error : 'transparent'}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* ─── Scrollable Sneaker Content ──────────────────────────────────── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 110 },
        ]}>
        
        {/* Hero Sneaker Image Showcase */}
        <View style={styles.imageShowcase}>
          <Image
            source={{ uri: product.imageUrl }}
            style={styles.heroImage}
            resizeMode="cover"
          />

          {/* Badges Overlay */}
          <View style={styles.imageBadges}>
            {product.isHotDrop && (
              <LinearGradient
                colors={['#EC4899', '#7C3AED']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.dropBadge}>
                <Flame size={12} color={colors.textOnDark} />
                <Text style={styles.dropBadgeText}>HOT DROP ⚡</Text>
              </LinearGradient>
            )}

            {product.discountPercentage && (
              <View style={styles.discountPill}>
                <Text style={styles.discountPillText}>
                  SAVE {product.discountPercentage}%
                </Text>
              </View>
            )}
          </View>

          {/* 360 preview hint */}
          <View style={styles.view360Pill}>
            <RotateCw size={13} color={colors.accent} />
            <Text style={styles.view360Text}>360° SNEAKER VIEW</Text>
          </View>
        </View>

        {/* Sneaker Title & Rating */}
        <View style={styles.titleSection}>
          <View style={styles.brandRow}>
            <Text style={styles.brandSubtitle}>{product.brand.toUpperCase()} EXCLUSIVE</Text>
            <View style={styles.ratingBadge}>
              <Star size={13} color="#FBBF24" fill="#FBBF24" />
              <Text style={styles.ratingScore}>{product.rating.toFixed(1)}</Text>
              <Text style={styles.reviewsCount}>({product.reviewsCount} verified)</Text>
            </View>
          </View>

          <Text style={styles.sneakerName}>{product.name}</Text>

          {/* Price Header */}
          <View style={styles.priceRow}>
            <Text style={styles.currentPrice}>${product.price}</Text>
            {Boolean(product.originalPrice) && (
              <Text style={styles.originalPrice}>${product.originalPrice}</Text>
            )}
            {product.stockLeft !== undefined && product.stockLeft <= 5 && (
              <View style={styles.stockUrgency}>
                <Text style={styles.stockUrgencyText}>
                  🔥 Only {product.stockLeft} pairs remaining in warehouse
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* ─── 10-Minute Drop Delivery Guarantee ───────────────────────────── */}
        <View style={styles.guaranteeCard}>
          <View style={styles.guaranteeItem}>
            <View style={[styles.guaranteeIconBox, { backgroundColor: 'rgba(163, 230, 53, 0.15)' }]}>
              <Zap size={18} color={colors.accent} />
            </View>
            <View style={styles.guaranteeTextContainer}>
              <Text style={styles.guaranteeTitle}>10-Minute Flash Drop</Text>
              <Text style={styles.guaranteeSubtitle}>
                In stock at Manhattan warehouse. Dispatches instantly upon checkout.
              </Text>
            </View>
          </View>

          <View style={styles.guaranteeDivider} />

          <View style={styles.guaranteeItem}>
            <View style={[styles.guaranteeIconBox, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
              <ShieldCheck size={18} color="#60A5FA" />
            </View>
            <View style={styles.guaranteeTextContainer}>
              <Text style={styles.guaranteeTitle}>100% Authenticity Guarantee</Text>
              <Text style={styles.guaranteeSubtitle}>
                Verified by certified sneakerheads. Includes physical encrypted NFC tag.
              </Text>
            </View>
          </View>
        </View>

        {/* ─── Size Selector ──────────────────────────────────────────────── */}
        <View style={styles.optionSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.optionTitle}>SELECT SIZE (US MEN'S)</Text>
            <Text style={styles.sizeGuideLink}>Size Guide</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sizesScroll}>
            {product.sizes.map(size => {
              const isSelected = selectedSize === size;
              return (
                <TouchableOpacity
                  key={size}
                  activeOpacity={0.8}
                  onPress={() => setSelectedSize(size)}
                  style={[styles.sizeOption, isSelected && styles.sizeOptionActive]}>
                  <Text
                    style={[
                      styles.sizeOptionText,
                      isSelected && styles.sizeOptionTextActive,
                    ]}>
                    {size}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ─── Color Swatches ─────────────────────────────────────────────── */}
        <View style={styles.optionSection}>
          <Text style={styles.optionTitle}>COLORWAY</Text>
          <View style={styles.colorsRow}>
            {product.colors.map(color => {
              const isSelected = selectedColor === color;
              return (
                <TouchableOpacity
                  key={color}
                  activeOpacity={0.8}
                  onPress={() => setSelectedColor(color)}
                  style={[
                    styles.colorSwatchRing,
                    isSelected && styles.colorSwatchRingActive,
                  ]}>
                  <View style={[styles.colorSwatchInner, { backgroundColor: color }]} />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ─── Description & Sneaker Story ─────────────────────────────────── */}
        <View style={styles.storySection}>
          <Text style={styles.optionTitle}>SNEAKER STORY & SPECS</Text>
          <Text style={styles.storyParagraph}>{product.description}</Text>

          <View style={styles.specsGrid}>
            <View style={styles.specBox}>
              <Text style={styles.specLabel}>SILHOUETTE</Text>
              <Text style={styles.specValue}>{product.category}</Text>
            </View>
            <View style={styles.specBox}>
              <Text style={styles.specLabel}>CONDITION</Text>
              <Text style={styles.specValue}>Deadstock / Brand New</Text>
            </View>
            <View style={styles.specBox}>
              <Text style={styles.specLabel}>AUTHENTICATION</Text>
              <Text style={styles.specValue}>NFC Chip Scanned</Text>
            </View>
            <View style={styles.specBox}>
              <Text style={styles.specLabel}>BOX</Text>
              <Text style={styles.specValue}>Original Collector Box</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ─── Sticky Bottom Action Bar ─────────────────────────────────────── */}
      <View
        style={[
          styles.stickyBottomBar,
          { paddingBottom: Math.max(insets.bottom, 14) + 6 },
        ]}>
        <View style={styles.bottomPriceColumn}>
          <Text style={styles.bottomPriceLabel}>TOTAL PRICE</Text>
          <Text style={styles.bottomPriceValue}>${product.price * (inBagQuantity || 1)}</Text>
        </View>

        {inBagQuantity > 0 ? (
          /* When in bag: Stepper + View Bag */
          <View style={styles.bottomActionsGroup}>
            <View style={styles.bottomStepper}>
              <TouchableOpacity
                style={styles.bottomStepperBtn}
                onPress={handleDecrement}
                activeOpacity={0.7}>
                <Minus size={16} color={colors.textOnDark} strokeWidth={2.5} />
              </TouchableOpacity>

              <Text style={styles.bottomStepperCount}>{inBagQuantity}</Text>

              <TouchableOpacity
                style={styles.bottomStepperBtn}
                onPress={handleAddOrIncrement}
                activeOpacity={0.7}>
                <Plus size={16} color={colors.textOnDark} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.viewBagButton}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Main', { screen: 'Cart' })}>
              <LinearGradient
                colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.viewBagGradient}>
                <ShoppingBag size={18} color={colors.textOnDark} />
                <Text style={styles.viewBagText}>View Bag ({inBagQuantity})</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          /* When not in bag: 1-Tap Add to Bag */
          <TouchableOpacity
            style={styles.addToBagButton}
            activeOpacity={0.85}
            onPress={handleAddOrIncrement}>
            <LinearGradient
              colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.addToBagGradient}>
              {addedSuccess ? (
                <View style={styles.ctaContent}>
                  <Check size={20} color={colors.textOnDark} strokeWidth={3} />
                  <Text style={styles.addToBagText}>Added to Bag!</Text>
                </View>
              ) : (
                <View style={styles.ctaContent}>
                  <Zap size={18} color={colors.textOnDark} />
                  <Text style={styles.addToBagText}>Cop Now (${product.price})</Text>
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.sm,
    backgroundColor: 'rgba(13, 8, 25, 0.85)',
    zIndex: 10,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarBadge: {
    backgroundColor: 'rgba(124, 58, 237, 0.2)',
    borderWidth: 1,
    borderColor: colors.primaryGradientStart,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  topBarBrand: {
    color: colors.textOnDark,
    fontSize: 11,
    fontWeight: typography.fontWeight.extraBold,
    letterSpacing: typography.letterSpacing.wider,
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.sm,
  },
  imageShowcase: {
    width: '100%',
    height: 280,
    borderRadius: spacing.cardRadiusLg,
    backgroundColor: '#161026',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    overflow: 'hidden',
    position: 'relative',
    marginBottom: spacing.md,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  imageBadges: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    gap: 6,
  },
  dropBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  dropBadgeText: {
    color: colors.textOnDark,
    fontSize: 10,
    fontWeight: typography.fontWeight.black,
    letterSpacing: typography.letterSpacing.wide,
  },
  discountPill: {
    backgroundColor: 'rgba(163, 230, 53, 0.2)',
    borderWidth: 1,
    borderColor: colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  discountPillText: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
  },
  view360Pill: {
    position: 'absolute',
    bottom: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 22, 37, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 5,
  },
  view360Text: {
    color: colors.accent,
    fontSize: 9,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 0.5,
  },
  titleSection: {
    marginBottom: spacing.md,
  },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  brandSubtitle: {
    color: colors.textOnDarkMuted,
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: typography.letterSpacing.wider,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingScore: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.black,
  },
  reviewsCount: {
    color: colors.textOnDarkMuted,
    fontSize: typography.fontSize.xs,
  },
  sneakerName: {
    color: colors.textOnDark,
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.black,
    lineHeight: 28,
    marginVertical: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginTop: 6,
    flexWrap: 'wrap',
  },
  currentPrice: {
    color: colors.textOnDark,
    fontSize: typography.fontSize['2xl'] + 2,
    fontWeight: typography.fontWeight.black,
  },
  originalPrice: {
    color: 'rgba(255, 255, 255, 0.35)',
    fontSize: typography.fontSize.base,
    textDecorationLine: 'line-through',
  },
  stockUrgency: {
    backgroundColor: 'rgba(244, 63, 94, 0.15)',
    borderWidth: 1,
    borderColor: colors.error,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  stockUrgencyText: {
    color: '#FECDD3',
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
  },
  guaranteeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: spacing.cardRadius,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  guaranteeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  guaranteeIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guaranteeTextContainer: {
    flex: 1,
  },
  guaranteeTitle: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  guaranteeSubtitle: {
    color: colors.textOnDarkMuted,
    fontSize: typography.fontSize.xs,
    marginTop: 2,
    lineHeight: 16,
  },
  guaranteeDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  optionSection: {
    marginBottom: spacing.lg,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  optionTitle: {
    color: colors.textOnDarkMuted,
    fontSize: 10,
    fontWeight: typography.fontWeight.extraBold,
    letterSpacing: typography.letterSpacing.wider,
    marginBottom: spacing.xs + 2,
  },
  sizeGuideLink: {
    color: colors.primaryGradientEnd,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  sizesScroll: {
    flexDirection: 'row',
  },
  sizeOption: {
    width: 54,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  sizeOptionActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  sizeOptionText: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  sizeOptionTextActive: {
    color: '#000000',
    fontWeight: typography.fontWeight.black,
  },
  colorsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  colorSwatchRing: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorSwatchRingActive: {
    borderColor: colors.accent,
  },
  colorSwatchInner: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  storySection: {
    marginBottom: spacing.lg,
  },
  storyParagraph: {
    color: colors.textOnDarkMuted,
    fontSize: typography.fontSize.sm,
    lineHeight: 22,
    marginTop: 4,
    marginBottom: spacing.md,
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specBox: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    padding: spacing.sm + 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  specLabel: {
    color: colors.textOnDarkMuted,
    fontSize: 9,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 0.5,
  },
  specValue: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.bold,
    marginTop: 2,
  },
  stickyBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(18, 14, 30, 0.95)',
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  bottomPriceColumn: {
    justifyContent: 'center',
  },
  bottomPriceLabel: {
    color: colors.textOnDarkMuted,
    fontSize: 9,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 0.5,
  },
  bottomPriceValue: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.black,
  },
  addToBagButton: {
    flex: 1,
    borderRadius: spacing.cardRadius - 2,
    overflow: 'hidden',
  },
  addToBagGradient: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  addToBagText: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.sm + 1,
    fontWeight: typography.fontWeight.extraBold,
  },
  bottomActionsGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  bottomStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: spacing.cardRadius - 4,
    paddingHorizontal: 6,
    height: 52,
    gap: 8,
  },
  bottomStepperBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomStepperCount: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.sm + 1,
    fontWeight: typography.fontWeight.black,
    minWidth: 16,
    textAlign: 'center',
  },
  viewBagButton: {
    flex: 1,
    borderRadius: spacing.cardRadius - 4,
    overflow: 'hidden',
  },
  viewBagGradient: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs + 2,
  },
  viewBagText: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.bold,
  },
});

export default ProductDetailScreen;
