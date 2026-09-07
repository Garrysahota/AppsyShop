import React, { useEffect, useRef } from 'react';
import { Animated, DimensionValue, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, spacing } from '@theme';

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.75,
          duration: 850,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 850,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeletonBase,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
};

export const ProductCardSkeleton: React.FC = () => {
  return (
    <View style={styles.cardContainer}>
      <Skeleton width="100%" height={160} borderRadius={spacing.cardRadius - 4} />
      <View style={styles.cardContent}>
        <Skeleton width="45%" height={12} borderRadius={4} style={{ marginBottom: 6 }} />
        <Skeleton width="90%" height={16} borderRadius={4} style={{ marginBottom: 10 }} />
        <View style={styles.cardFooter}>
          <Skeleton width="35%" height={18} borderRadius={4} />
          <Skeleton width={32} height={32} borderRadius={16} />
        </View>
      </View>
    </View>
  );
};

export const BannerSkeleton: React.FC = () => {
  return (
    <View style={styles.bannerContainer}>
      <Skeleton width="100%" height={180} borderRadius={spacing.cardRadius} />
    </View>
  );
};

export const CategoryPillSkeleton: React.FC = () => {
  return (
    <View style={styles.categoriesRow}>
      {[80, 70, 75, 85, 65].map((w, i) => (
        <Skeleton key={i} width={w} height={36} borderRadius={18} style={{ marginRight: 8 }} />
      ))}
    </View>
  );
};

export const ProductDetailSkeleton: React.FC = () => {
  return (
    <View style={styles.detailContainer}>
      <Skeleton width="100%" height={320} borderRadius={0} />
      <View style={styles.detailContent}>
        <Skeleton width="30%" height={14} borderRadius={4} style={{ marginBottom: 8 }} />
        <Skeleton width="85%" height={26} borderRadius={6} style={{ marginBottom: 12 }} />
        <Skeleton width="40%" height={22} borderRadius={6} style={{ marginBottom: 20 }} />

        <Skeleton width="25%" height={16} borderRadius={4} style={{ marginBottom: 10 }} />
        <View style={styles.sizesRow}>
          {[50, 50, 50, 50, 50].map((_, i) => (
            <Skeleton key={i} width={48} height={44} borderRadius={8} style={{ marginRight: 8 }} />
          ))}
        </View>

        <Skeleton width="100%" height={80} borderRadius={10} style={{ marginTop: 20 }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonBase: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  cardContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: spacing.cardRadius,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: spacing.sm,
    margin: spacing.xs,
  },
  cardContent: {
    paddingTop: spacing.sm,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerContainer: {
    marginHorizontal: spacing.screenPadding,
    marginVertical: spacing.md,
  },
  categoriesRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.screenPadding,
    marginVertical: spacing.md,
  },
  detailContainer: {
    flex: 1,
    backgroundColor: '#0F0A1E',
  },
  detailContent: {
    padding: spacing.screenPadding,
  },
  sizesRow: {
    flexDirection: 'row',
  },
});

export default Skeleton;
