import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Flame, Heart, Minus, Plus, Star } from 'lucide-react-native';
import { colors, spacing, typography } from '@theme';
import useAppDispatch from '@shared/hooks/useAppDispatch';
import useAppSelector from '@shared/hooks/useAppSelector';
import { toggleFavorite } from '../store/productsSlice';
import { addToCart, updateQuantity } from '@features/cart/store/cartSlice';
import { Product } from '../types';

import { formatINR } from '@shared/utils/currency';

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  cardWidth?: number;
  variant?: 'standard' | 'flash';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  cardWidth,
  variant = 'standard',
}) => {
  const dispatch = useAppDispatch();
  const isFavorite = useAppSelector(state =>
    state.products.favorites.includes(product.id),
  );

  const cartItem = useAppSelector(state =>
    state.cart.items.find(item => item.product.id === product.id),
  );
  const cartQuantity = cartItem?.quantity || 0;

  const handleAddToCart = (e: any) => {
    e.stopPropagation?.();
    dispatch(addToCart({ product }));
  };

  const handleDecrement = (e: any) => {
    e.stopPropagation?.();
    if (cartItem) {
      dispatch(
        updateQuantity({
          productId: product.id,
          size: cartItem.selectedSize,
          quantity: cartQuantity - 1,
        }),
      );
    }
  };

  const handleIncrement = (e: any) => {
    e.stopPropagation?.();
    if (cartItem) {
      dispatch(
        updateQuantity({
          productId: product.id,
          size: cartItem.selectedSize,
          quantity: cartQuantity + 1,
        }),
      );
    } else {
      dispatch(addToCart({ product }));
    }
  };

  const handleToggleFavorite = (e: any) => {
    e.stopPropagation?.();
    dispatch(toggleFavorite(product.id));
  };

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={[
        styles.container,
        variant === 'flash' && styles.flashContainer,
        cardWidth ? { width: cardWidth } : styles.defaultWidth,
      ]}>
      {}
      <View style={[styles.imageContainer, variant === 'flash' && styles.flashImageContainer]}>
        <Image
          source={{ uri: product.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />

        {}
        <View style={styles.topBadgesRow}>
          {product.isHotDrop ? (
            <LinearGradient
              colors={['#EC4899', '#7C3AED']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.badge}>
              <Flame size={11} color={colors.textOnDark} />
              <Text style={styles.badgeText}>DROP</Text>
            </LinearGradient>
          ) : product.discountPercentage ? (
            <View style={[styles.badge, styles.discountBadge]}>
              <Text style={styles.discountBadgeText}>-{product.discountPercentage}%</Text>
            </View>
          ) : (
            <View />
          )}

          {}
          <TouchableOpacity
            style={styles.favoriteButton}
            activeOpacity={0.7}
            onPress={handleToggleFavorite}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Heart
              size={16}
              color={isFavorite ? colors.error : 'rgba(255, 255, 255, 0.7)'}
              fill={isFavorite ? colors.error : 'transparent'}
            />
          </TouchableOpacity>
        </View>

        {}
        {product.stockLeft !== undefined && product.stockLeft <= 5 && (
          <View style={styles.stockAlert}>
            <Text style={styles.stockAlertText}>Only {product.stockLeft} left</Text>
          </View>
        )}
      </View>

      {}
      <View style={[styles.detailsContainer, variant === 'flash' && styles.flashDetailsContainer]}>
        <View style={styles.brandRow}>
          <Text style={styles.brandText}>{product.brand.toUpperCase()}</Text>
          <View style={styles.ratingRow}>
            <Star size={12} color="#FBBF24" fill="#FBBF24" />
            <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
          </View>
        </View>

        <Text style={styles.nameText} numberOfLines={2}>
          {product.name}
        </Text>

        {}
        <View style={styles.bottomRow}>
          <View style={styles.priceColumn}>
            <Text style={styles.priceText}>{formatINR(product.price)}</Text>
            {Boolean(product.originalPrice) && (
              <Text style={styles.originalPriceText}>
                {formatINR(product.originalPrice!)}
              </Text>
            )}
          </View>

          {cartQuantity > 0 ? (
            <View style={styles.stepperPill}>
              <TouchableOpacity
                style={styles.stepperAction}
                activeOpacity={0.7}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                onPress={handleDecrement}>
                <Minus size={12} color={colors.textOnDark} strokeWidth={3} />
              </TouchableOpacity>

              <Text style={styles.stepperNumber}>{cartQuantity}</Text>

              <TouchableOpacity
                style={styles.stepperAction}
                activeOpacity={0.7}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                onPress={handleIncrement}>
                <Plus size={12} color={colors.textOnDark} strokeWidth={3} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addButton}
              activeOpacity={0.8}
              onPress={handleAddToCart}>
              <Plus size={18} color={colors.textOnDark} strokeWidth={2.5} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#18122B',
    borderRadius: spacing.cardRadius - 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  flashContainer: {
    backgroundColor: '#1E1736',
    borderColor: 'rgba(236, 72, 153, 0.35)',
    borderWidth: 1.5,
  },
  defaultWidth: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 155,
    backgroundColor: '#120D20',
    position: 'relative',
  },
  flashImageContainer: {
    height: 170,
    backgroundColor: '#120D20',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  topBadgesRow: {
    position: 'absolute',
    top: spacing.xs + 2,
    left: spacing.xs + 2,
    right: spacing.xs + 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 3,
  },
  badgeText: {
    color: colors.textOnDark,
    fontSize: 9,
    fontWeight: typography.fontWeight.black,
    letterSpacing: typography.letterSpacing.wide,
  },
  discountBadge: {
    backgroundColor: 'rgba(163, 230, 53, 0.2)',
    borderWidth: 1,
    borderColor: colors.accent,
  },
  discountBadgeText: {
    color: colors.accent,
    fontSize: 9,
    fontWeight: typography.fontWeight.extraBold,
  },
  favoriteButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(26, 22, 37, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stockAlert: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: 'rgba(244, 63, 94, 0.85)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  stockAlertText: {
    color: colors.textOnDark,
    fontSize: 9,
    fontWeight: typography.fontWeight.bold,
  },
  detailsContainer: {
    padding: spacing.sm + 2,
    backgroundColor: '#18122B',
  },
  flashDetailsContainer: {
    backgroundColor: '#1E1736',
  },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  brandText: {
    color: colors.textOnDarkMuted,
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: typography.letterSpacing.wider,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  nameText: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    lineHeight: 18,
    minHeight: 36,
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: spacing.xs + 2,
  },
  priceColumn: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  priceText: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.black,
  },
  originalPriceText: {
    color: 'rgba(255, 255, 255, 0.35)',
    fontSize: typography.fontSize.xs,
    textDecorationLine: 'line-through',
  },
  addButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 17,
    paddingHorizontal: 4,
    paddingVertical: 3,
    gap: 6,
  },
  stepperAction: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperNumber: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.black,
    minWidth: 14,
    textAlign: 'center',
  },
});

export default ProductCard;
