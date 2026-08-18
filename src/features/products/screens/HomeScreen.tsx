/**
 * HomeScreen — AppsyShop
 * Flagship e-commerce storefront with live drop banner, category filters, and sneaker cards.
 */

import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
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
  Bell,
  Clock,
  Flame,
  Heart,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
  Zap,
} from 'lucide-react-native';
import { colors, spacing, typography } from '@theme';
import useAppDispatch from '@shared/hooks/useAppDispatch';
import useAppSelector from '@shared/hooks/useAppSelector';
import { setSelectedCategory } from '../store/productsSlice';
import ProductCard from '../components/ProductCard';
import FilterBottomSheet from '../components/FilterBottomSheet';
import { ProductCategory } from '../types';

const { width } = Dimensions.get('window');

const CATEGORIES: ProductCategory[] = [
  'All',
  'Drops',
  'Nike',
  'Jordan',
  'Yeezy',
  'Running',
  'Retro',
];

export const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();

  const user = useAppSelector(state => state.auth.user);
  const { items, selectedCategory, filters, favorites } = useAppSelector(
    state => state.products,
  );

  const unreadNotifCount = useAppSelector(
    state => state.notifications.items.filter(n => !n.isRead).length,
  );

  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // Countdown timer simulation
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 2, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hasActiveFilters =
    filters.selectedBrands.length > 0 ||
    filters.priceRange !== 'all' ||
    filters.selectedSizes.length > 0 ||
    filters.onlyHotDrops ||
    filters.onlyDiscounted ||
    filters.onlyInStock ||
    filters.sortBy !== 'featured';

  const filteredProducts = items
    .filter(item => {
      // 1. Category
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      // 2. Brand
      if (
        filters.selectedBrands.length > 0 &&
        !filters.selectedBrands.includes(item.brand)
      ) {
        return false;
      }
      // 3. Price
      if (filters.priceRange === 'under_150' && item.price >= 150) return false;
      if (
        filters.priceRange === '150_250' &&
        (item.price < 150 || item.price > 250)
      ) {
        return false;
      }
      if (
        filters.priceRange === '250_350' &&
        (item.price < 250 || item.price > 350)
      ) {
        return false;
      }
      if (filters.priceRange === 'above_350' && item.price <= 350) return false;

      // 4. Sizes
      if (
        filters.selectedSizes.length > 0 &&
        !filters.selectedSizes.some(s => item.sizes.includes(s))
      ) {
        return false;
      }

      // 5. Badges
      if (filters.onlyHotDrops && !item.isHotDrop) return false;
      if (filters.onlyDiscounted && !item.discountPercentage) return false;
      if (filters.onlyInStock && item.stockLeft !== undefined && item.stockLeft <= 0) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'price_asc') return a.price - b.price;
      if (filters.sortBy === 'price_desc') return b.price - a.price;
      if (filters.sortBy === 'rating') return b.rating - a.rating;
      if (filters.sortBy === 'newest') return (b.isHotDrop ? 1 : 0) - (a.isHotDrop ? 1 : 0);
      return 0;
    });

  const flashDropProducts = items.filter(p => p.isHotDrop);

  const formatTimerNumber = (num: number) => (num < 10 ? `0${num}` : `${num}`);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0D0819', '#161026', '#1E1435']}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Math.max(insets.top, 16) + spacing.xs,
            paddingBottom: insets.bottom + 90, // Extra spacing for floating bottom bar
          },
        ]}>
        
        {/* ─── Top Header Bar ─────────────────────────────────────────────── */}
        <View style={styles.headerRow}>
          <View style={styles.locationContainer}>
            <View style={styles.deliveryBadge}>
              <Zap size={11} color={colors.accent} />
              <Text style={styles.deliveryBadgeText}>10 MIN DROP</Text>
            </View>
            <View style={styles.locationRow}>
              <MapPin size={14} color={colors.primaryGradientEnd} />
              <Text style={styles.locationText} numberOfLines={1}>
                Manhattan, NY · 10001
              </Text>
            </View>
          </View>

          {/* Right Icon Buttons (Wishlist Heart & Notification Bell) */}
          <View style={styles.topRightIcons}>
            <TouchableOpacity
              style={styles.headerIconButton}
              activeOpacity={0.75}
              onPress={() => navigation.navigate('Wishlist')}>
              <Heart
                size={20}
                color={favorites.length > 0 ? colors.error : colors.textOnDark}
                fill={favorites.length > 0 ? colors.error : 'transparent'}
              />
              {favorites.length > 0 && (
                <View style={styles.badgeCount}>
                  <Text style={styles.badgeCountText}>{favorites.length}</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.headerIconButton}
              activeOpacity={0.75}
              onPress={() => navigation.navigate('Notifications')}>
              <Bell size={20} color={colors.textOnDark} />
              {unreadNotifCount > 0 && <View style={styles.notificationDot} />}
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── User Greeting ──────────────────────────────────────────────── */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingText}>
            Hey, {user?.displayName?.split(' ')[0] || 'Sneakerhead'} 👋
          </Text>
          <Text style={styles.subGreetingText}>
            Fresh drops just landed at your nearest warehouse
          </Text>
        </View>

        {/* ─── Search & Filter Bar ────────────────────────────────────────── */}
        <View style={styles.searchBarRow}>
          <TouchableOpacity
            style={styles.searchBar}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('Search')}>
            <Search size={18} color="rgba(255, 255, 255, 0.45)" style={styles.searchIcon} />
            <Text style={styles.searchPlaceholder}>Search Jordans, Dunks, Yeezys...</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, hasActiveFilters && styles.filterButtonActive]}
            activeOpacity={0.8}
            onPress={() => setFilterModalVisible(true)}>
            <SlidersHorizontal
              size={17}
              color={hasActiveFilters ? colors.accent : colors.textOnDark}
            />
            {hasActiveFilters && <View style={styles.filterActiveDot} />}
          </TouchableOpacity>
        </View>

        {/* ─── Hero Drop Card ─────────────────────────────────────────────── */}
        <LinearGradient
          colors={['#7C3AED', '#DB2777', '#F43F5E']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroBanner}>
          <View style={styles.heroContent}>
            <View style={styles.heroTopRow}>
              <View style={styles.heroBadge}>
                <Sparkles size={11} color="#000" />
                <Text style={styles.heroBadgeText}>EXCLUSIVE DROP</Text>
              </View>
              <View style={styles.timerContainer}>
                <Clock size={12} color={colors.textOnDark} />
                <Text style={styles.timerText}>
                  {formatTimerNumber(timeLeft.hours)}:{formatTimerNumber(timeLeft.minutes)}:
                  {formatTimerNumber(timeLeft.seconds)}
                </Text>
              </View>
            </View>

            <Text style={styles.heroTitle}>Travis Scott x AJ1</Text>
            <Text style={styles.heroSubtitle}>Reverse Mocha • Limited Run</Text>

            <View style={styles.heroFooter}>
              <View>
                <Text style={styles.heroPriceLabel}>VIP DROP PRICE</Text>
                <Text style={styles.heroPrice}>$380</Text>
              </View>
              <TouchableOpacity
                style={styles.heroButton}
                activeOpacity={0.85}
                onPress={() =>
                  navigation.navigate('ProductDetail', { productId: 'snk-1' })
                }>
                <Text style={styles.heroButtonText}>Cop Now ⚡</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=80',
            }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </LinearGradient>

        {/* ─── Category Filter Pills ───────────────────────────────────────── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}>
          {CATEGORIES.map(category => {
            const isSelected = selectedCategory === category;
            return (
              <TouchableOpacity
                key={category}
                activeOpacity={0.8}
                onPress={() => dispatch(setSelectedCategory(category))}
                style={styles.categoryPillContainer}>
                {isSelected ? (
                  <LinearGradient
                    colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.categoryPill, styles.categoryPillActive]}>
                    <Text style={styles.categoryTextActive}>{category}</Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.categoryPill}>
                    <Text style={styles.categoryText}>{category}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ─── Flash Drops Carousel ────────────────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Flame size={18} color="#F43F5E" />
            <Text style={styles.sectionTitle}>Flash Drops</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => dispatch(setSelectedCategory('Drops'))}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flashDropsScroll}>
          {flashDropProducts.map(product => (
            <ProductCard
              key={'flash-' + product.id}
              product={product}
              cardWidth={width * 0.44}
              onPress={() =>
                navigation.navigate('ProductDetail', { productId: product.id })
              }
            />
          ))}
        </ScrollView>

        {/* ─── All Sneakers / Trending Grid ─────────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Sparkles size={18} color={colors.accent} />
            <Text style={styles.sectionTitle}>Trending Now</Text>
          </View>
          <Text style={styles.resultsCount}>{filteredProducts.length} Kicks</Text>
        </View>

        <View style={styles.productsGrid}>
          {filteredProducts.map(product => (
            <View key={product.id} style={styles.gridColumn}>
              <ProductCard
                product={product}
                onPress={() =>
                  navigation.navigate('ProductDetail', { productId: product.id })
                }
              />
            </View>
          ))}
        </View>
      </ScrollView>

      {/* ─── Filter Bottom Sheet Modal ────────────────────────────────────── */}
      <FilterBottomSheet
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0819',
  },
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    gap: 3,
  },
  deliveryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(163, 230, 53, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 4,
  },
  deliveryBadgeText: {
    color: colors.accent,
    fontSize: 9,
    fontWeight: typography.fontWeight.extraBold,
    letterSpacing: typography.letterSpacing.wider,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  topRightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerIconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
    borderWidth: 1.5,
    borderColor: '#0D0819',
  },
  badgeCount: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.error,
    borderRadius: 9,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeCountText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: typography.fontWeight.black,
  },
  greetingSection: {
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  greetingText: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.black,
    color: colors.textOnDark,
    letterSpacing: typography.letterSpacing.tight,
  },
  subGreetingText: {
    fontSize: typography.fontSize.xs + 1,
    color: colors.textOnDarkMuted,
    marginTop: 2,
  },
  searchBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: spacing.cardRadius - 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: spacing.md,
    height: 50,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchPlaceholder: {
    flex: 1,
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: typography.fontSize.sm,
  },
  filterButton: {
    width: 50,
    height: 50,
    borderRadius: spacing.cardRadius - 4,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  filterButtonActive: {
    backgroundColor: 'rgba(124, 58, 237, 0.25)',
    borderColor: colors.primaryGradientStart,
  },
  filterActiveDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.accent,
  },
  heroBanner: {
    borderRadius: spacing.cardRadiusLg - 4,
    padding: spacing.md + 2,
    position: 'relative',
    overflow: 'hidden',
    minHeight: 160,
    marginBottom: spacing.lg,
  },
  heroContent: {
    width: '65%',
    zIndex: 2,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 3,
  },
  heroBadgeText: {
    color: '#000000',
    fontSize: 9,
    fontWeight: typography.fontWeight.black,
    letterSpacing: typography.letterSpacing.wide,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
  },
  timerText: {
    color: colors.textOnDark,
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
  },
  heroTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.black,
    color: colors.textOnDark,
    lineHeight: 24,
  },
  heroSubtitle: {
    fontSize: typography.fontSize.xs,
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: spacing.sm,
  },
  heroFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  heroPriceLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 8,
    fontWeight: typography.fontWeight.bold,
  },
  heroPrice: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.black,
  },
  heroButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: 20,
  },
  heroButtonText: {
    color: '#161026',
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.extraBold,
  },
  heroImage: {
    position: 'absolute',
    right: -10,
    bottom: -10,
    width: 140,
    height: 140,
    borderRadius: 20,
    opacity: 0.9,
    transform: [{ rotate: '-12deg' }],
  },
  categoryList: {
    gap: spacing.xs + 2,
    marginBottom: spacing.lg,
  },
  categoryPillContainer: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  categoryPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
  categoryPillActive: {
    borderColor: colors.transparent,
  },
  categoryText: {
    color: colors.textOnDarkMuted,
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.semiBold,
  },
  categoryTextActive: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.bold,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm + 2,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.black,
    color: colors.textOnDark,
    letterSpacing: typography.letterSpacing.wide,
  },
  seeAllText: {
    color: colors.primaryGradientEnd,
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.bold,
  },
  resultsCount: {
    color: colors.textOnDarkMuted,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semiBold,
  },
  flashDropsScroll: {
    gap: spacing.md,
    paddingBottom: spacing.sm,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridColumn: {
    width: '48%',
  },
});

export default HomeScreen;
