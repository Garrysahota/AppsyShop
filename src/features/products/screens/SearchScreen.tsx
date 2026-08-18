import React, { useState } from 'react';
import {
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
import { Search, SlidersHorizontal, Sparkles, X } from 'lucide-react-native';
import { colors, spacing, typography } from '@theme';
import useAppSelector from '@shared/hooks/useAppSelector';
import ProductCard from '../components/ProductCard';
import FilterBottomSheet from '../components/FilterBottomSheet';

const TRENDING_SEARCHES = ['Travis Scott', 'Panda Dunk', 'Jordan 4', 'Yeezy 350', 'Samba OG', 'ASICS'];

export const SearchScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { items, filters } = useAppSelector(state => state.products);
  const [query, setQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const hasActiveFilters =
    filters.selectedBrands.length > 0 ||
    filters.priceRange !== 'all' ||
    filters.selectedSizes.length > 0 ||
    filters.onlyHotDrops ||
    filters.onlyDiscounted ||
    filters.onlyInStock ||
    filters.sortBy !== 'featured';

  const searchResults = items
    .filter(item => {
      // 1. Text Query
      if (query.trim()) {
        const q = query.toLowerCase();
        const matches =
          item.name.toLowerCase().includes(q) ||
          item.brand.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q);
        if (!matches) return false;
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
        
        {/* Title */}
        <Text style={styles.title}>Search Kicks 🔍</Text>

        {/* Search Input & Filter Button */}
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Search size={18} color="rgba(255, 255, 255, 0.45)" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search drops, models, brands..."
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              value={query}
              onChangeText={setQuery}
              autoFocus={false}
            />
            {Boolean(query) && (
              <TouchableOpacity
                onPress={() => setQuery('')}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <X size={18} color={colors.textOnDarkMuted} />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={[styles.filterButton, hasActiveFilters && styles.filterButtonActive]}
            activeOpacity={0.8}
            onPress={() => setFilterModalVisible(true)}>
            <SlidersHorizontal
              size={18}
              color={hasActiveFilters ? colors.accent : colors.textOnDark}
            />
            {hasActiveFilters && <View style={styles.filterActiveDot} />}
          </TouchableOpacity>
        </View>

        {/* Suggestions */}
        <View style={styles.suggestionsSection}>
          <View style={styles.suggestionsHeader}>
            <Sparkles size={13} color={colors.accent} />
            <Text style={styles.suggestionsTitle}>TRENDING SEARCHES</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
            {TRENDING_SEARCHES.map(chip => (
              <TouchableOpacity
                key={chip}
                activeOpacity={0.75}
                onPress={() => setQuery(chip)}
                style={[styles.chip, query === chip && styles.chipActive]}>
                <Text style={[styles.chipText, query === chip && styles.chipTextActive]}>
                  {chip}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Results */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {query.trim()
              ? `Found ${searchResults.length} results for "${query}"`
              : `Showing ${searchResults.length} Available Drops`}
          </Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.productsGrid}>
            {searchResults.map(product => (
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
      </View>

      {/* Filter Bottom Sheet */}
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
  content: {
    flex: 1,
    paddingHorizontal: spacing.screenPadding,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.black,
    color: colors.textOnDark,
    marginBottom: spacing.md,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: spacing.cardRadius - 4,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    paddingHorizontal: spacing.md,
    height: 52,
  },
  filterButton: {
    width: 52,
    height: 52,
    borderRadius: spacing.cardRadius - 4,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.14)',
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
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: colors.textOnDark,
    fontSize: typography.fontSize.sm + 1,
    height: '100%',
    paddingVertical: 0,
  },
  suggestionsSection: {
    marginBottom: spacing.md,
  },
  suggestionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: spacing.xs,
  },
  suggestionsTitle: {
    color: colors.textOnDarkMuted,
    fontSize: 10,
    fontWeight: typography.fontWeight.extraBold,
    letterSpacing: typography.letterSpacing.wider,
  },
  chipsScroll: {
    flexDirection: 'row',
  },
  chip: {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: 'rgba(124, 58, 237, 0.3)',
    borderColor: colors.primaryGradientStart,
  },
  chipText: {
    color: colors.textOnDarkMuted,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  chipTextActive: {
    color: colors.textOnDark,
    fontWeight: typography.fontWeight.bold,
  },
  resultsHeader: {
    marginBottom: spacing.sm,
  },
  resultsCount: {
    color: colors.textOnDarkMuted,
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.semiBold,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: spacing.lg,
  },
  gridColumn: {
    width: '48%',
  },
});

export default SearchScreen;
