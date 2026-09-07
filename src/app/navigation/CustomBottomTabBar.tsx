import React, { useCallback, useMemo } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Flame,
  Home,
  Search,
  ShoppingBag,
  User,
} from 'lucide-react-native';
import { colors, spacing, typography } from '@theme';
import useAppSelector from '@shared/hooks/useAppSelector';

const TabIcon = React.memo(({ name, isFocused, cartItemsCount }: { name: string; isFocused: boolean; cartItemsCount: number }) => {
  const iconColor = isFocused ? colors.textOnDark : 'rgba(255, 255, 255, 0.5)';
  const size = 20;

  switch (name) {
    case 'Home':
      return <Home size={size} color={iconColor} />;
    case 'Search':
      return <Search size={size} color={iconColor} />;
    case 'Cart':
      return (
        <View style={styles.cartIconContainer}>
          <ShoppingBag size={size} color={iconColor} />
          {cartItemsCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {cartItemsCount > 9 ? '9+' : cartItemsCount}
              </Text>
            </View>
          )}
        </View>
      );
    case 'Orders':
      return <Flame size={size} color={iconColor} />;
    case 'Profile':
      return <User size={size} color={iconColor} />;
    default:
      return <Home size={size} color={iconColor} />;
  }
});

interface TabBarButtonProps {
  routeName: string;
  routeKey: string;
  label: string;
  isFocused: boolean;
  onPress: (routeName: string, routeKey: string, isFocused: boolean) => void;
  cartItemsCount: number;
}

const TabBarButton = React.memo(({
  routeName,
  routeKey,
  label,
  isFocused,
  onPress,
  cartItemsCount,
}: TabBarButtonProps) => {
  const handlePress = () => {
    onPress(routeName, routeKey, isFocused);
  };

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      onPress={handlePress}
      activeOpacity={0.9}
      style={styles.tabButton}>
      {isFocused ? (
        <LinearGradient
          colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.activePill}>
          <TabIcon name={routeName} isFocused={true} cartItemsCount={cartItemsCount} />
          <Text style={styles.activeLabel}>{label}</Text>
        </LinearGradient>
      ) : (
        <View style={styles.inactivePill}>
          <TabIcon name={routeName} isFocused={false} cartItemsCount={cartItemsCount} />
        </View>
      )}
    </TouchableOpacity>
  );
});

export const CustomBottomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  
  const cartItemsCount = useAppSelector(s =>
    s.cart.items.reduce((total, item) => total + item.quantity, 0),
  );

  const wrapperStyle = useMemo(() => [
    styles.wrapper,
    { bottom: Math.max(insets.bottom, 12) + (Platform.OS === 'ios' ? 4 : 8) },
  ], [insets.bottom]);

  const handlePress = useCallback((routeName: string, routeKey: string, isFocused: boolean) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: routeKey,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(routeName);
    }
  }, [navigation]);

  return (
    <View style={wrapperStyle}>
      <View style={styles.glassContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

          const isFocused = state.index === index;

          return (
            <TabBarButton
              key={route.key}
              routeName={route.name}
              routeKey={route.key}
              label={String(label)}
              isFocused={isFocused}
              onPress={handlePress}
              cartItemsCount={cartItemsCount}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: spacing.screenPadding,
    right: spacing.screenPadding,
    alignItems: 'center',
    zIndex: 100,
  },
  glassContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(20, 15, 34, 0.92)',
    borderRadius: 32,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    paddingVertical: 6,
    paddingHorizontal: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
    width: '100%',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  activeLabel: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.black,
    letterSpacing: 0.3,
  },
  inactivePill: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  cartIconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -8,
    backgroundColor: colors.accent,
    borderRadius: 9,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#000000',
    fontSize: 9,
    fontWeight: typography.fontWeight.black,
  },
});

export default CustomBottomTabBar;
