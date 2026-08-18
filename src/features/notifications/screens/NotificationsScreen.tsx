/**
 * NotificationsScreen — AppsyShop
 * Flagship notifications hub with drop alerts, rider delivery tracking, promo codes,
 * and category filtering.
 */

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
  Bell,
  CheckCheck,
  ChevronRight,
  Clock,
  Flame,
  Sparkles,
  Tag,
  Truck,
  Zap,
} from 'lucide-react-native';
import { colors, spacing, typography } from '@theme';
import useAppDispatch from '@shared/hooks/useAppDispatch';
import useAppSelector from '@shared/hooks/useAppSelector';
import {
  markAllAsRead,
  markAsRead,
  setSelectedCategory,
} from '../store/notificationsSlice';
import { NotificationCategory, NotificationItem } from '../types';

const CATEGORIES: { id: NotificationCategory; label: string }[] = [
  { id: 'all', label: 'All Alerts' },
  { id: 'drops', label: 'VIP Drops ⚡' },
  { id: 'orders', label: 'Orders 📦' },
  { id: 'promos', label: 'Promos 🏷️' },
];

export const NotificationsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();

  const { items, selectedCategory } = useAppSelector(state => state.notifications);

  const unreadCount = items.filter(n => !n.isRead).length;

  const filteredItems = items.filter(item => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const getNotificationIcon = (iconType: string) => {
    switch (iconType) {
      case 'flame':
        return <Flame size={18} color="#EC4899" />;
      case 'truck':
        return <Truck size={18} color={colors.accent} />;
      case 'tag':
        return <Tag size={18} color="#FBBF24" />;
      case 'sparkles':
        return <Sparkles size={18} color="#60A5FA" />;
      case 'zap':
        return <Zap size={18} color={colors.accent} />;
      default:
        return <Bell size={18} color={colors.textOnDark} />;
    }
  };

  const getIconBgColor = (iconType: string) => {
    switch (iconType) {
      case 'flame':
        return 'rgba(236, 72, 153, 0.18)';
      case 'truck':
        return 'rgba(163, 230, 53, 0.15)';
      case 'tag':
        return 'rgba(251, 191, 36, 0.18)';
      case 'sparkles':
        return 'rgba(96, 165, 250, 0.18)';
      case 'zap':
        return 'rgba(163, 230, 53, 0.15)';
      default:
        return 'rgba(255, 255, 255, 0.08)';
    }
  };

  const handleNotificationPress = (item: NotificationItem) => {
    dispatch(markAsRead(item.id));

    if (item.targetScreen === 'ProductDetail' && item.targetParams) {
      navigation.navigate('ProductDetail', item.targetParams);
    } else if (item.targetScreen === 'Orders') {
      navigation.navigate('Main', { screen: 'Orders' });
    } else if (item.targetScreen === 'Cart') {
      navigation.navigate('Main', { screen: 'Cart' });
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0D0819', '#161026', '#1E1435']}
        style={StyleSheet.absoluteFill}
      />

      {/* Top Header Bar */}
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

        <View style={styles.titleContainer}>
          <Text style={styles.topBarTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <Text style={styles.unreadBadgeText}>{unreadCount} unread</Text>
          )}
        </View>

        {unreadCount > 0 ? (
          <TouchableOpacity
            style={styles.markAllButton}
            activeOpacity={0.75}
            onPress={() => dispatch(markAllAsRead())}>
            <CheckCheck size={18} color={colors.accent} />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholderButton} />
        )}
      </View>

      {/* Filter Tabs Bar */}
      <View style={styles.categoriesWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}>
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                activeOpacity={0.8}
                onPress={() => dispatch(setSelectedCategory(cat.id))}
                style={styles.categoryPillContainer}>
                {isSelected ? (
                  <LinearGradient
                    colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.categoryPillActive}>
                    <Text style={styles.categoryTextActive}>{cat.label}</Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.categoryPill}>
                    <Text style={styles.categoryText}>{cat.label}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 90 },
        ]}>
        
        {filteredItems.length === 0 ? (
          /* Empty Notifications */
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Bell size={44} color={colors.primaryGradientEnd} />
            </View>
            <Text style={styles.emptyTitle}>All Caught Up!</Text>
            <Text style={styles.emptySubtitle}>
              You don't have any notifications in this section right now.
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
                <Text style={styles.exploreButtonText}>Explore Sneaker Drops ⚡</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          /* Notifications List */
          <View style={styles.listContainer}>
            {filteredItems.map(item => {
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.8}
                  onPress={() => handleNotificationPress(item)}
                  style={[
                    styles.notificationCard,
                    !item.isRead && styles.notificationCardUnread,
                  ]}>
                  {/* Icon Circle */}
                  <View
                    style={[
                      styles.iconCircle,
                      { backgroundColor: getIconBgColor(item.iconType) },
                    ]}>
                    {getNotificationIcon(item.iconType)}
                  </View>

                  {/* Content */}
                  <View style={styles.contentContainer}>
                    <View style={styles.cardHeaderRow}>
                      <Text
                        style={[
                          styles.cardTitle,
                          !item.isRead && styles.cardTitleUnread,
                        ]}
                        numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text style={styles.timestampText}>{item.timeAgo}</Text>
                    </View>

                    <Text style={styles.cardMessage} numberOfLines={3}>
                      {item.message}
                    </Text>

                    {item.targetScreen && (
                      <View style={styles.actionHintRow}>
                        <Text style={styles.actionHintText}>
                          {item.targetScreen === 'ProductDetail'
                            ? 'View Drop Details'
                            : item.targetScreen === 'Orders'
                            ? 'Track Drop Live'
                            : 'Apply in Bag'}
                        </Text>
                        <ChevronRight size={14} color={colors.accent} />
                      </View>
                    )}
                  </View>

                  {/* Unread Dot Indicator */}
                  {!item.isRead && <View style={styles.unreadDot} />}
                </TouchableOpacity>
              );
            })}
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
  titleContainer: {
    alignItems: 'center',
  },
  topBarTitle: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.black,
  },
  unreadBadgeText: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    marginTop: 1,
  },
  markAllButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(163, 230, 53, 0.12)',
    borderWidth: 1,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderButton: {
    width: 42,
  },
  categoriesWrapper: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  categoriesScroll: {
    paddingHorizontal: spacing.screenPadding,
    gap: spacing.xs + 2,
  },
  categoryPillContainer: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryPillActive: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
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
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.md,
  },
  listContainer: {
    gap: spacing.sm + 2,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: spacing.cardRadius - 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: spacing.md,
    alignItems: 'flex-start',
    gap: spacing.md,
    position: 'relative',
  },
  notificationCardUnread: {
    backgroundColor: 'rgba(124, 58, 237, 0.12)',
    borderColor: 'rgba(124, 58, 237, 0.35)',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  contentContainer: {
    flex: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    flex: 1,
    marginRight: 8,
  },
  cardTitleUnread: {
    color: colors.textOnDark,
    fontWeight: typography.fontWeight.black,
  },
  timestampText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 10,
    fontWeight: typography.fontWeight.medium,
  },
  cardMessage: {
    color: colors.textOnDarkMuted,
    fontSize: typography.fontSize.xs + 1,
    lineHeight: 18,
  },
  actionHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 2,
  },
  actionHintText: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
  },
  unreadDot: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(124, 58, 237, 0.18)',
    borderWidth: 1.5,
    borderColor: colors.primaryGradientStart,
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
});

export default NotificationsScreen;
