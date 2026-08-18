/**
 * FilterBottomSheet — AppsyShop
 * Glassmorphic filter bottom sheet modal with smooth 2-stop snap points (Half ~55% & Full ~88%),
 * gesture drag support, and comprehensive sneaker filtering.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Check,
  Flame,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  Tag,
  X,
  Zap,
} from 'lucide-react-native';
import { colors, spacing, typography } from '@theme';
import useAppDispatch from '@shared/hooks/useAppDispatch';
import useAppSelector from '@shared/hooks/useAppSelector';
import { DEFAULT_FILTERS, setFilters } from '../store/productsSlice';
import {
  PriceRangeTier,
  Product,
  ProductFilters,
  SortOption,
} from '../types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// 2 Snap point heights (from bottom)
const SNAP_HALF = SCREEN_HEIGHT * 0.58;
const SNAP_FULL = SCREEN_HEIGHT * 0.88;

interface FilterBottomSheetProps {
  visible: boolean;
  onClose: () => void;
}

const BRANDS = ['Nike', 'Jordan', 'Yeezy', 'New Balance', 'Adidas', 'ASICS'];
const SIZES = [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12];

const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: 'featured', label: 'Featured ⚡' },
  { id: 'price_asc', label: 'Price: Low → High' },
  { id: 'price_desc', label: 'Price: High → Low' },
  { id: 'rating', label: 'Top Rated ★' },
  { id: 'newest', label: 'Newest Drops 🔥' },
];

const PRICE_TIERS: { id: PriceRangeTier; label: string }[] = [
  { id: 'all', label: 'All Prices' },
  { id: 'under_150', label: 'Under $150' },
  { id: '150_250', label: '$150 - $250' },
  { id: '250_350', label: '$250 - $350' },
  { id: 'above_350', label: '$350+' },
];

export const FilterBottomSheet: React.FC<FilterBottomSheetProps> = ({
  visible,
  onClose,
}) => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const allProducts = useAppSelector(state => state.products.items);
  const currentFilters = useAppSelector(state => state.products.filters);

  // Local copy of filters while modal is open
  const [localFilters, setLocalFilters] = useState<ProductFilters>(currentFilters);
  const [currentSnap, setCurrentSnap] = useState<'half' | 'full'>('half');

  // Animation values
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  // Sync filters whenever sheet opens
  useEffect(() => {
    if (visible) {
      setLocalFilters(currentFilters);
      setCurrentSnap('half');
      snapTo(SNAP_HALF);
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const snapTo = (snapHeight: number) => {
    const targetTranslate = SCREEN_HEIGHT - snapHeight;
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: targetTranslate,
        tension: 65,
        friction: 11,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Pan Responder for drag handle
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 5,
      onPanResponderMove: (_, gestureState) => {
        const baseHeight = currentSnap === 'full' ? SNAP_FULL : SNAP_HALF;
        const currentTranslate = SCREEN_HEIGHT - baseHeight + gestureState.dy;
        if (currentTranslate >= SCREEN_HEIGHT - SNAP_FULL) {
          translateY.setValue(currentTranslate);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 120) {
          // Dragged down significantly
          if (currentSnap === 'full' && gestureState.dy < 250) {
            setCurrentSnap('half');
            snapTo(SNAP_HALF);
          } else {
            handleClose();
          }
        } else if (gestureState.dy < -60) {
          // Dragged up
          setCurrentSnap('full');
          snapTo(SNAP_FULL);
        } else {
          // Return to current snap
          snapTo(currentSnap === 'full' ? SNAP_FULL : SNAP_HALF);
        }
      },
    }),
  ).current;

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const handleApply = () => {
    dispatch(setFilters(localFilters));
    handleClose();
  };

  const handleReset = () => {
    setLocalFilters(DEFAULT_FILTERS);
  };

  // Toggle brand
  const toggleBrand = (brand: string) => {
    setLocalFilters(prev => {
      const exists = prev.selectedBrands.includes(brand);
      return {
        ...prev,
        selectedBrands: exists
          ? prev.selectedBrands.filter(b => b !== brand)
          : [...prev.selectedBrands, brand],
      };
    });
  };

  // Toggle size
  const toggleSize = (size: number) => {
    setLocalFilters(prev => {
      const exists = prev.selectedSizes.includes(size);
      return {
        ...prev,
        selectedSizes: exists
          ? prev.selectedSizes.filter(s => s !== size)
          : [...prev.selectedSizes, size],
      };
    });
  };

  // Live match calculation
  const matchingCount = allProducts.filter(item => {
    // Brand
    if (
      localFilters.selectedBrands.length > 0 &&
      !localFilters.selectedBrands.includes(item.brand)
    ) {
      return false;
    }
    // Price
    if (localFilters.priceRange === 'under_150' && item.price >= 150) return false;
    if (
      localFilters.priceRange === '150_250' &&
      (item.price < 150 || item.price > 250)
    ) {
      return false;
    }
    if (
      localFilters.priceRange === '250_350' &&
      (item.price < 250 || item.price > 350)
    ) {
      return false;
    }
    if (localFilters.priceRange === 'above_350' && item.price <= 350) return false;

    // Sizes
    if (
      localFilters.selectedSizes.length > 0 &&
      !localFilters.selectedSizes.some(s => item.sizes.includes(s))
    ) {
      return false;
    }

    // Toggles
    if (localFilters.onlyHotDrops && !item.isHotDrop) return false;
    if (localFilters.onlyDiscounted && !item.discountPercentage) return false;
    if (localFilters.onlyInStock && item.stockLeft !== undefined && item.stockLeft <= 0) {
      return false;
    }

    return true;
  }).length;

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={handleClose}>
      <View style={styles.modalOverlay}>
        {/* Backdrop */}
        <TouchableWithoutFeedback onPress={handleClose}>
          <Animated.View
            style={[
              styles.backdrop,
              {
                opacity: backdropOpacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.65],
                }),
              },
            ]}
          />
        </TouchableWithoutFeedback>

        {/* Animated Sheet Container */}
        <Animated.View
          style={[
            styles.sheetContainer,
            {
              transform: [{ translateY }],
            },
          ]}>
          {/* Drag Handle Bar */}
          <View {...panResponder.panHandlers} style={styles.dragHandleArea}>
            <View style={styles.dragPill} />
            <Text style={styles.dragStopHint}>
              {currentSnap === 'half' ? 'Swipe up for full filters ↑' : 'Drag down to minimize ↓'}
            </Text>
          </View>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <SlidersHorizontal size={18} color={colors.accent} />
              <Text style={styles.headerTitle}>Filters & Sorting</Text>
            </View>

            <View style={styles.headerActions}>
              <TouchableOpacity
                onPress={handleReset}
                style={styles.resetButton}
                activeOpacity={0.7}>
                <RotateCcw size={13} color={colors.textOnDarkMuted} />
                <Text style={styles.resetText}>Reset</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
                activeOpacity={0.7}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <X size={18} color={colors.textOnDark} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Scrollable Filter Sections */}
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}>
            
            {/* ─── 1. Sort By ──────────────────────────────────────────────── */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>SORT BY</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsRow}>
                {SORT_OPTIONS.map(opt => {
                  const isSelected = localFilters.sortBy === opt.id;
                  return (
                    <TouchableOpacity
                      key={opt.id}
                      activeOpacity={0.75}
                      onPress={() => setLocalFilters(prev => ({ ...prev, sortBy: opt.id }))}
                      style={[styles.filterPill, isSelected && styles.filterPillActive]}>
                      <Text
                        style={[
                          styles.filterPillText,
                          isSelected && styles.filterPillTextActive,
                        ]}>
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* ─── 2. Brands ───────────────────────────────────────────────── */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>POPULAR BRANDS</Text>
              <View style={styles.wrapGrid}>
                {BRANDS.map(brand => {
                  const isSelected = localFilters.selectedBrands.includes(brand);
                  return (
                    <TouchableOpacity
                      key={brand}
                      activeOpacity={0.75}
                      onPress={() => toggleBrand(brand)}
                      style={[styles.brandChip, isSelected && styles.brandChipActive]}>
                      {isSelected && (
                        <Check size={13} color={colors.textOnDark} style={styles.checkIcon} />
                      )}
                      <Text
                        style={[
                          styles.brandChipText,
                          isSelected && styles.brandChipTextActive,
                        ]}>
                        {brand}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* ─── 3. Price Range ──────────────────────────────────────────── */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>PRICE TIER</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsRow}>
                {PRICE_TIERS.map(tier => {
                  const isSelected = localFilters.priceRange === tier.id;
                  return (
                    <TouchableOpacity
                      key={tier.id}
                      activeOpacity={0.75}
                      onPress={() => setLocalFilters(prev => ({ ...prev, priceRange: tier.id }))}
                      style={[styles.filterPill, isSelected && styles.filterPillActive]}>
                      <Text
                        style={[
                          styles.filterPillText,
                          isSelected && styles.filterPillTextActive,
                        ]}>
                        {tier.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* ─── 4. Shoe Sizes ───────────────────────────────────────────── */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>SIZE (US MEN'S)</Text>
              <View style={styles.sizeGrid}>
                {SIZES.map(size => {
                  const isSelected = localFilters.selectedSizes.includes(size);
                  return (
                    <TouchableOpacity
                      key={size}
                      activeOpacity={0.75}
                      onPress={() => toggleSize(size)}
                      style={[styles.sizeBox, isSelected && styles.sizeBoxActive]}>
                      <Text
                        style={[styles.sizeBoxText, isSelected && styles.sizeBoxTextActive]}>
                        {size}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* ─── 5. Quick Badges / Toggles ───────────────────────────────── */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>DROP PERKS & STATUS</Text>
              
              {/* Hot Drops Toggle */}
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() =>
                  setLocalFilters(prev => ({ ...prev, onlyHotDrops: !prev.onlyHotDrops }))
                }
                style={[
                  styles.toggleRow,
                  localFilters.onlyHotDrops && styles.toggleRowActive,
                ]}>
                <View style={styles.toggleLeft}>
                  <Flame size={16} color="#EC4899" />
                  <Text style={styles.toggleLabel}>VIP Flash Drops Only</Text>
                </View>
                <View
                  style={[
                    styles.toggleSwitch,
                    localFilters.onlyHotDrops && styles.toggleSwitchActive,
                  ]}>
                  {localFilters.onlyHotDrops && <Check size={11} color="#000" />}
                </View>
              </TouchableOpacity>

              {/* Discounted Toggle */}
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() =>
                  setLocalFilters(prev => ({
                    ...prev,
                    onlyDiscounted: !prev.onlyDiscounted,
                  }))
                }
                style={[
                  styles.toggleRow,
                  localFilters.onlyDiscounted && styles.toggleRowActive,
                ]}>
                <View style={styles.toggleLeft}>
                  <Tag size={16} color={colors.accent} />
                  <Text style={styles.toggleLabel}>On Sale / Discounted</Text>
                </View>
                <View
                  style={[
                    styles.toggleSwitch,
                    localFilters.onlyDiscounted && styles.toggleSwitchActive,
                  ]}>
                  {localFilters.onlyDiscounted && <Check size={11} color="#000" />}
                </View>
              </TouchableOpacity>

              {/* In Stock Toggle */}
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() =>
                  setLocalFilters(prev => ({
                    ...prev,
                    onlyInStock: !prev.onlyInStock,
                  }))
                }
                style={[
                  styles.toggleRow,
                  localFilters.onlyInStock && styles.toggleRowActive,
                ]}>
                <View style={styles.toggleLeft}>
                  <Zap size={16} color={colors.primaryGradientStart} />
                  <Text style={styles.toggleLabel}>In-Stock for 10-Min Delivery</Text>
                </View>
                <View
                  style={[
                    styles.toggleSwitch,
                    localFilters.onlyInStock && styles.toggleSwitchActive,
                  ]}>
                  {localFilters.onlyInStock && <Check size={11} color="#000" />}
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Sticky Apply Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleApply}
              style={styles.applyButtonContainer}>
              <LinearGradient
                colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.applyButton}>
                <Text style={styles.applyButtonText}>
                  Show {matchingCount} {matchingCount === 1 ? 'Kick' : 'Kicks'} ⚡
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
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
    backgroundColor: '#000000',
  },
  sheetContainer: {
    height: SNAP_FULL,
    backgroundColor: '#161026',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 24,
    flexDirection: 'column',
  },
  scrollView: {
    flex: 1,
  },
  dragHandleArea: {
    alignItems: 'center',
    paddingVertical: 10,
    width: '100%',
  },
  dragPill: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  dragStopHint: {
    color: 'rgba(255, 255, 255, 0.35)',
    fontSize: 9,
    fontWeight: typography.fontWeight.bold,
    marginTop: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.sm,
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  resetText: {
    color: colors.textOnDarkMuted,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
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
    paddingBottom: spacing.xxl,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: typography.fontWeight.black,
    color: colors.textOnDarkMuted,
    letterSpacing: typography.letterSpacing.wider,
    marginBottom: spacing.sm,
  },
  pillsRow: {
    flexDirection: 'row',
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 8,
  },
  filterPillActive: {
    backgroundColor: 'rgba(124, 58, 237, 0.35)',
    borderColor: colors.primaryGradientStart,
  },
  filterPillText: {
    color: colors.textOnDarkMuted,
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.semiBold,
  },
  filterPillTextActive: {
    color: colors.textOnDark,
    fontWeight: typography.fontWeight.bold,
  },
  wrapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  brandChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  brandChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryGradientEnd,
  },
  checkIcon: {
    marginRight: 4,
  },
  brandChipText: {
    color: colors.textOnDarkMuted,
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.bold,
  },
  brandChipTextActive: {
    color: colors.textOnDark,
  },
  sizeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sizeBox: {
    width: 48,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeBoxActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  sizeBoxText: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.bold,
  },
  sizeBoxTextActive: {
    color: '#000000',
    fontWeight: typography.fontWeight.black,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: spacing.cardRadius - 8,
    padding: spacing.md,
    marginBottom: 8,
  },
  toggleRowActive: {
    backgroundColor: 'rgba(124, 58, 237, 0.12)',
    borderColor: 'rgba(124, 58, 237, 0.3)',
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  toggleLabel: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  toggleSwitch: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleSwitchActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  footer: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    backgroundColor: '#161026',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  applyButtonContainer: {
    borderRadius: spacing.cardRadius,
    overflow: 'hidden',
  },
  applyButton: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.extraBold,
    letterSpacing: 0.4,
  },
});

export default FilterBottomSheet;
