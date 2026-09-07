import React from 'react';
import {
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
  Heart,
  ShoppingBag,
  Sparkles,
  Zap,
} from 'lucide-react-native';
import { colors, spacing, typography } from '@theme';
import useAppDispatch from '@shared/hooks/useAppDispatch';
import useAppSelector from '@shared/hooks/useAppSelector';
import { addToCart } from '@features/cart/store/cartSlice';
import ProductCard from '../components/ProductCard';

export const WishlistScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();

  const { items, favorites } = useAppSelector(state => state.products);

  const favoritedProducts = items.filter(item => favorites.includes(item.id));

  const handleAddAllToBag = () => {
    favoritedProducts.forEach(product => {
      dispatch(addToCart({ product }));
    });
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
          style={styles.iconButton}
          activeOpacity={0.75}
          onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color={colors.textOnDark} />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>My Wishlist</Text>
          <Text style={styles.headerSubtitle}>
            {favoritedProducts.length} {favoritedProducts.length === 1 ? 'Saved Drop' : 'Saved Drops'}
          </Text>
        </View>

        <View style={styles.placeholderButton} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 90 },
        ]}>
        
        {favoritedProducts.length === 0 ? (
          
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Heart
                size={48}
                color={colors.error}
                fill="rgba(244, 63, 94, 0.25)"
              />
            </View>

            <Text style={styles.emptyTitle}>Your Wishlist is Empty</Text>
            <Text style={styles.emptySubtitle}>
              Tap the heart icon on any sneaker card or drop banner to save your grails for later.
            </Text>

            <TouchableOpacity
              style={styles.exploreButton}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Main', { screen: 'Home' })}>
              <LinearGradient
                colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.exploreGradient}>
                <Zap size={18} color={colors.textOnDark} />
                <Text style={styles.exploreButtonText}>Explore Drops ⚡</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          
          <View>
            {}
            <View style={styles.actionBar}>
              <View style={styles.countBadge}>
                <Sparkles size={12} color={colors.accent} />
                <Text style={styles.countBadgeText}>
                  {favoritedProducts.length} KICKS IN GRAIL LIST
                </Text>
              </View>

              <TouchableOpacity
                style={styles.addAllButton}
                activeOpacity={0.8}
                onPress={handleAddAllToBag}>
                <ShoppingBag size={14} color={colors.textOnDark} />
                <Text style={styles.addAllText}>Add All to Bag</Text>
              </TouchableOpacity>
            </View>

            {}
            <View style={styles.productsGrid}>
              {favoritedProducts.map(product => (
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
          </View>
        )}
      </ScrollView>
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
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.black,
  },
  headerSubtitle: {
    color: colors.textOnDarkMuted,
    fontSize: typography.fontSize.xs,
    marginTop: 1,
  },
  placeholderButton: {
    width: 42,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.md,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
  },
  emptyIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(244, 63, 94, 0.12)',
    borderWidth: 1.5,
    borderColor: colors.error,
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
    marginBottom: spacing.xl,
  },
  exploreButton: {
    width: '100%',
    borderRadius: spacing.cardRadius,
    overflow: 'hidden',
  },
  exploreGradient: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs + 2,
  },
  exploreButtonText: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: spacing.cardRadius - 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    marginBottom: spacing.md,
  },
  countBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  countBadgeText: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: typography.fontWeight.extraBold,
    letterSpacing: typography.letterSpacing.wide,
  },
  addAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  addAllText: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
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

export default WishlistScreen;
