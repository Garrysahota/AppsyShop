import React from 'react';
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Flame,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Zap,
} from 'lucide-react-native';
import { colors, spacing, typography } from '@theme';
import type { RootStackParamList } from '@app/navigation/types';
import { formatINR } from '@shared/utils/currency';

type OrderSuccessRouteProp = RouteProp<RootStackParamList, 'OrderSuccess'>;

export const OrderSuccessScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<OrderSuccessRouteProp>();

  const orderId = route.params?.orderId || '#SNK-8821';
  const total = route.params?.total || 380;
  const itemsCount = route.params?.itemsCount || 1;
  const razorpayPaymentId = route.params?.razorpayPaymentId;

  const handleTrackDrop = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Main',
          state: {
            routes: [{ name: 'Orders' }],
            index: 3,
          },
        },
      ],
    });
  };

  const handleContinueShopping = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0D0819', '#161026', '#22123B']}
        style={StyleSheet.absoluteFill}
      />

      <View
        style={[
          styles.content,
          {
            paddingTop: Math.max(insets.top, 24) + spacing.xl,
            paddingBottom: Math.max(insets.bottom, 20) + spacing.md,
          },
        ]}>
        
        {}
        <View style={styles.iconCircle}>
          <LinearGradient
            colors={['#EC4899', '#7C3AED']}
            style={styles.gradientCircle}>
            <Zap size={48} color={colors.textOnDark} />
          </LinearGradient>
          <View style={styles.sparkleBadge}>
            <Sparkles size={16} color="#000" />
          </View>
        </View>

        {}
        <Text style={styles.title}>DROP CONFIRMED! ⚡</Text>
        <Text style={styles.subtitle}>
          Your order has been sent to our local warehouse team for immediate packing.
        </Text>

        {}
        <View style={styles.orderCard}>
          <View style={styles.orderCardHeader}>
            <View>
              <Text style={styles.orderLabel}>ORDER NUMBER</Text>
              <Text style={styles.orderValue}>{orderId}</Text>
            </View>
            <View style={styles.paidBadge}>
              <CheckCircle2 size={12} color={colors.success} />
              <Text style={styles.paidText}>PAID {formatINR(total)}</Text>
            </View>
          </View>

          {}
          {Boolean(razorpayPaymentId) && (
            <View style={styles.razorpayVerifiedRow}>
              <View style={styles.rzpBadgeLogo}>
                <Text style={styles.rzpBadgeLogoText}>R</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rzpVerifiedLabel}>RAZORPAY TRANSACTION VERIFIED</Text>
                <Text style={styles.rzpPaymentIdText}>{razorpayPaymentId}</Text>
              </View>
              <View style={styles.demoTag}>
                <Text style={styles.demoTagText}>DEMO</Text>
              </View>
            </View>
          )}

          <View style={styles.divider} />

          {}
          <View style={styles.etaRow}>
            <View style={styles.etaIconBox}>
              <Clock size={20} color={colors.accent} />
            </View>
            <View style={styles.etaInfo}>
              <Text style={styles.etaTitle}>Estimated Arrival: 8 Mins</Text>
              <Text style={styles.etaSub}>
                Rider dispatching in &lt; 2 minutes
              </Text>
            </View>
          </View>

          {}
          <View style={styles.nfcNotice}>
            <ShieldCheck size={14} color={colors.accent} />
            <Text style={styles.nfcText}>
              Includes tamper-proof physical NFC authenticity tag
            </Text>
          </View>
        </View>

        <View style={styles.spacer} />

        {}
        <TouchableOpacity
          style={styles.trackButton}
          activeOpacity={0.85}
          onPress={handleTrackDrop}>
          <LinearGradient
            colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.trackGradient}>
            <Text style={styles.trackButtonText}>Track Drop Live 🚀</Text>
            <ArrowRight size={18} color={colors.textOnDark} />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeButton}
          activeOpacity={0.8}
          onPress={handleContinueShopping}>
          <Text style={styles.homeButtonText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
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
    alignItems: 'center',
  },
  iconCircle: {
    width: 104,
    height: 104,
    borderRadius: 52,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: spacing.lg,
  },
  gradientCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkleBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.fontSize['2xl'] + 2,
    fontWeight: typography.fontWeight.black,
    color: colors.textOnDark,
    textAlign: 'center',
    letterSpacing: typography.letterSpacing.tight,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textOnDarkMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: spacing.xs,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xl,
  },
  orderCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: spacing.cardRadiusLg - 4,
    borderWidth: 1.5,
    borderColor: 'rgba(124, 58, 237, 0.35)',
    padding: spacing.md + 2,
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderLabel: {
    color: colors.textOnDarkMuted,
    fontSize: 9,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 0.5,
  },
  orderValue: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.black,
    marginTop: 2,
  },
  paidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderWidth: 1,
    borderColor: colors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  paidText: {
    color: colors.success,
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
  },
  razorpayVerifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(11, 103, 212, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(11, 103, 212, 0.35)',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    gap: 10,
  },
  rzpBadgeLogo: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#0B67D4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rzpBadgeLogoText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  rzpVerifiedLabel: {
    color: '#60A5FA',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  rzpPaymentIdText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginTop: 1,
  },
  demoTag: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  demoTagText: {
    color: '#FBBF24',
    fontSize: 8,
    fontWeight: '900',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: spacing.md,
  },
  etaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  etaIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(163, 230, 53, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  etaInfo: {
    flex: 1,
  },
  etaTitle: {
    color: colors.accent,
    fontSize: typography.fontSize.sm + 1,
    fontWeight: typography.fontWeight.bold,
  },
  etaSub: {
    color: colors.textOnDarkMuted,
    fontSize: typography.fontSize.xs,
    marginTop: 2,
  },
  nfcNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: spacing.sm,
    borderRadius: 8,
    gap: spacing.xs + 2,
    marginTop: spacing.md,
  },
  nfcText: {
    color: colors.textOnDarkMuted,
    fontSize: 10,
    flex: 1,
  },
  spacer: {
    flex: 1,
  },
  trackButton: {
    width: '100%',
    borderRadius: spacing.cardRadius,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  trackGradient: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  trackButtonText: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.extraBold,
  },
  homeButton: {
    paddingVertical: spacing.md,
  },
  homeButtonText: {
    color: colors.textOnDarkMuted,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
});

export default OrderSuccessScreen;
