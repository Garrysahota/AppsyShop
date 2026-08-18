/**
 * OrdersScreen — AppsyShop
 * Live drop tracking with multi-step delivery status and order history.
 */

import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  CheckCircle2,
  Clock,
  Flame,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  Truck,
  Zap,
} from 'lucide-react-native';
import { colors, spacing, typography } from '@theme';

export const OrdersScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

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
            paddingBottom: insets.bottom + 90,
          },
        ]}>
        
        {/* Title */}
        <Text style={styles.title}>Drop Tracking 🚀</Text>

        {/* Live Active Order Card */}
        <View style={styles.liveOrderCard}>
          <View style={styles.liveHeader}>
            <View style={styles.liveBadge}>
              <View style={styles.pulsingDot} />
              <Text style={styles.liveBadgeText}>LIVE DROP IN TRANSIT</Text>
            </View>
            <Text style={styles.etaText}>ETA: 6 MINS</Text>
          </View>

          <View style={styles.productRow}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=80',
              }}
              style={styles.productImage}
            />
            <View style={styles.productInfo}>
              <Text style={styles.orderNumber}>ORDER #SNK-9042</Text>
              <Text style={styles.productName} numberOfLines={1}>
                Travis Scott x AJ1 Low OG
              </Text>
              <Text style={styles.productSize}>Size: US 9.5 · $380</Text>
            </View>
          </View>

          {/* Stepper Timeline */}
          <View style={styles.timelineContainer}>
            {/* Step 1: Confirmed */}
            <View style={styles.timelineStep}>
              <View style={[styles.stepIconContainer, styles.stepIconActive]}>
                <CheckCircle2 size={16} color="#000" />
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitleActive}>Order Confirmed</Text>
                <Text style={styles.stepTime}>8:14 PM · Warehouse verified</Text>
              </View>
            </View>
            <View style={[styles.timelineLine, styles.timelineLineActive]} />

            {/* Step 2: Packed */}
            <View style={styles.timelineStep}>
              <View style={[styles.stepIconContainer, styles.stepIconActive]}>
                <Package size={16} color="#000" />
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitleActive}>Bagged & Authenticated</Text>
                <Text style={styles.stepTime}>8:16 PM · NFC security tag sealed</Text>
              </View>
            </View>
            <View style={[styles.timelineLine, styles.timelineLineActive]} />

            {/* Step 3: Out for Delivery */}
            <View style={styles.timelineStep}>
              <View style={[styles.stepIconContainer, styles.stepIconCurrent]}>
                <Truck size={16} color={colors.textOnDark} />
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitleCurrent}>Rider Speeding Your Way</Text>
                <Text style={styles.stepTimeHighlight}>0.8 miles away · 6 mins left</Text>
              </View>
            </View>
            <View style={styles.timelineLine} />

            {/* Step 4: Delivered */}
            <View style={styles.timelineStep}>
              <View style={styles.stepIconContainer}>
                <MapPin size={16} color="rgba(255, 255, 255, 0.4)" />
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Doorstep Handover</Text>
                <Text style={styles.stepTime}>Pending arrival</Text>
              </View>
            </View>
          </View>

          {/* Rider Card */}
          <View style={styles.riderCard}>
            <View style={styles.riderAvatar}>
              <Text style={styles.riderEmoji}>⚡</Text>
            </View>
            <View style={styles.riderInfo}>
              <Text style={styles.riderName}>Marcus Vance (Rider)</Text>
              <Text style={styles.riderRating}>★ 4.9 · 1,420 drops completed</Text>
            </View>
            <TouchableOpacity style={styles.callButton} activeOpacity={0.8}>
              <Phone size={16} color={colors.accent} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Past Drops Header */}
        <Text style={styles.sectionTitle}>Past Delivered Drops</Text>

        {/* Past Order Card */}
        <View style={styles.pastOrderCard}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80',
            }}
            style={styles.pastOrderImage}
          />
          <View style={styles.pastOrderDetails}>
            <View style={styles.pastOrderHeader}>
              <Text style={styles.pastOrderName}>Nike Dunk Low Panda</Text>
              <Text style={styles.pastOrderPrice}>$115</Text>
            </View>
            <Text style={styles.pastOrderMeta}>Delivered yesterday · US 9</Text>
            <View style={styles.verifiedRow}>
              <ShieldCheck size={13} color={colors.success} />
              <Text style={styles.verifiedText}>Verified Authentic</Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.black,
    color: colors.textOnDark,
    marginBottom: spacing.md,
  },
  liveOrderCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: spacing.cardRadius,
    borderWidth: 1.5,
    borderColor: 'rgba(124, 58, 237, 0.4)',
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  liveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(236, 72, 153, 0.2)',
    borderWidth: 1,
    borderColor: colors.primaryGradientEnd,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 6,
  },
  pulsingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primaryGradientEnd,
  },
  liveBadgeText: {
    color: colors.textOnDark,
    fontSize: 9,
    fontWeight: typography.fontWeight.black,
    letterSpacing: typography.letterSpacing.wider,
  },
  etaText: {
    color: colors.accent,
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.extraBold,
  },
  productRow: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#1E1435',
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  orderNumber: {
    color: colors.textOnDarkMuted,
    fontSize: 9,
    fontWeight: typography.fontWeight.bold,
  },
  productName: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.sm + 1,
    fontWeight: typography.fontWeight.bold,
    marginTop: 1,
  },
  productSize: {
    color: colors.accent,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    marginTop: 2,
  },
  timelineContainer: {
    paddingVertical: spacing.md,
  },
  timelineStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  timelineLine: {
    width: 2,
    height: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    marginLeft: 15,
    marginVertical: 2,
  },
  timelineLineActive: {
    backgroundColor: colors.accent,
  },
  stepIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIconActive: {
    backgroundColor: colors.accent,
  },
  stepIconCurrent: {
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    color: colors.textOnDarkMuted,
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.medium,
  },
  stepTitleActive: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.bold,
  },
  stepTitleCurrent: {
    color: colors.accent,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.black,
  },
  stepTime: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 10,
    marginTop: 1,
  },
  stepTimeHighlight: {
    color: '#FECDD3',
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    marginTop: 1,
  },
  riderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: spacing.cardRadius - 8,
    padding: spacing.sm + 2,
    gap: spacing.sm + 2,
  },
  riderAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(124, 58, 237, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  riderEmoji: {
    fontSize: 18,
  },
  riderInfo: {
    flex: 1,
  },
  riderName: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.bold,
  },
  riderRating: {
    color: colors.textOnDarkMuted,
    fontSize: 10,
    marginTop: 1,
  },
  callButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(163, 230, 53, 0.15)',
    borderWidth: 1,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.black,
    color: colors.textOnDark,
    marginBottom: spacing.sm,
  },
  pastOrderCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: spacing.cardRadius - 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: spacing.sm + 2,
    gap: spacing.md,
    alignItems: 'center',
  },
  pastOrderImage: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: '#1E1435',
  },
  pastOrderDetails: {
    flex: 1,
  },
  pastOrderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pastOrderName: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  pastOrderPrice: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.black,
  },
  pastOrderMeta: {
    color: colors.textOnDarkMuted,
    fontSize: typography.fontSize.xs,
    marginTop: 2,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  verifiedText: {
    color: colors.success,
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
  },
});

export default OrdersScreen;
