/**
 * OnboardingScreen — AppsyShop
 * "Live Tracking" style — 3 slides: Discover · Track · Checkout
 *
 * Slide 2 features the hero "Live Tracking" animation:
 *   pulsing concentric rings, location pin, animated route line, LIVE badge.
 *
 * States handled:
 *   - Loading: N/A (static content)
 *   - Empty: N/A
 *   - Error: N/A
 *   - Happy path: 3-slide onboarding with animated transitions
 */

import React, { useRef, useState, useCallback } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,

} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, typography } from '@theme';
import useAppDispatch from '@shared/hooks/useAppDispatch';
import { completeOnboarding } from '@features/onboarding/store/onboardingSlice';
import type { AuthStackParamList } from '@app/navigation/types';

const { width, height } = Dimensions.get('window');

// ─── Slide Config ────────────────────────────────────────────────────────────
type SlideType = 'discover' | 'tracking' | 'checkout';

interface Slide {
  id: string;
  type: SlideType;
  badge: string;
  badgeIsLive?: boolean;
  title: string;
  subtitle: string;
  gradientColors: string[];
}

const SLIDES: Slide[] = [
  {
    id: '1',
    type: 'discover',
    badge: '🔥  NEW ARRIVALS',
    title: 'Discover Your\nNext Favourite Kick',
    subtitle:
      'Browse 1,000+ premium sneakers.\nFilter by brand, size and style.',
    gradientColors: ['#2D1B69', '#7C3AED', '#9F53F7'],
  },
  {
    id: '2',
    type: 'tracking',
    badge: '● LIVE',
    badgeIsLive: true,
    title: 'Track Every Drop,\nLive',
    subtitle:
      'Real-time updates from warehouse\nto your doorstep. Every single step.',
    gradientColors: ['#0F0A1E', '#1A1625', '#2D1B4E'],
  },
  {
    id: '3',
    type: 'checkout',
    badge: '🔒  SECURED',
    title: 'Checkout\nin Seconds',
    subtitle:
      'Stripe-powered secure payments.\nCards, UPI & more. Zero hassle.',
    gradientColors: ['#6D28D9', '#7C3AED', '#EC4899'],
  },
];

// ─── Pulsing Ring (for Live Tracking slide) ───────────────────────────────────
interface PulsingRingProps {
  size: number;
  delay: number;
  color: string;
}

const PulsingRing: React.FC<PulsingRingProps> = ({ size, delay, color }) => {
  const anim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, {
          toValue: 1,
          duration: 1600,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [anim, delay]);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 1.5,
        borderColor: color,
        opacity: anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.8, 0.4, 0] }),
        transform: [
          {
            scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }),
          },
        ],
      }}
    />
  );
};

// ─── Illustration: Discover ───────────────────────────────────────────────────
const DiscoverIllustration: React.FC = () => {
  const floatAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -14, duration: 1800, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 1800, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [floatAnim]);

  return (
    <View style={illustrationStyles.container}>
      {/* Glow backdrop */}
      <View style={illustrationStyles.glowCircle} />

      {/* Glassmorphic card */}
      <Animated.View
        style={[
          illustrationStyles.glasCard,
          { transform: [{ translateY: floatAnim }] },
        ]}>
        {/* Shoe icon */}
        <Text style={illustrationStyles.shoeEmoji}>👟</Text>

        {/* Top badge */}
        <View style={illustrationStyles.badgeChip}>
          <Text style={illustrationStyles.badgeChipText}>JUST DROPPED</Text>
        </View>

        {/* Bottom info */}
        <View style={illustrationStyles.cardInfo}>
          <View>
            <Text style={illustrationStyles.cardBrand}>Nike Air Max 2026</Text>
            <Text style={illustrationStyles.cardPrice}>₹12,999</Text>
          </View>
          <View style={illustrationStyles.ratingChip}>
            <Text style={illustrationStyles.ratingText}>⭐ 4.9</Text>
          </View>
        </View>
      </Animated.View>

      {/* Floating mini tags */}
      <View style={[illustrationStyles.floatingTag, illustrationStyles.tagTopLeft]}>
        <Text style={illustrationStyles.floatingTagText}>Air Zoom ✦</Text>
      </View>
      <View style={[illustrationStyles.floatingTag, illustrationStyles.tagBottomRight]}>
        <Text style={illustrationStyles.floatingTagText}>Size 9 US</Text>
      </View>
    </View>
  );
};

// ─── Illustration: Live Tracking ──────────────────────────────────────────────
const TrackingIllustration: React.FC = () => {
  const livePulse = useRef(new Animated.Value(1)).current;
  const routeProgress = useRef(new Animated.Value(0)).current;
  const packageBounce = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    // Live badge pulse
    const livePulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(livePulse, { toValue: 0.6, duration: 700, useNativeDriver: true }),
        Animated.timing(livePulse, { toValue: 1, duration: 700, useNativeDriver: true }),
      ]),
    );
    livePulseLoop.start();

    // Route line draw animation
    Animated.timing(routeProgress, { toValue: 1, duration: 1800, useNativeDriver: false }).start();

    // Package bounce
    const bounceLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(packageBounce, { toValue: -6, duration: 600, useNativeDriver: true }),
        Animated.timing(packageBounce, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]),
    );
    bounceLoop.start();

    return () => {
      livePulseLoop.stop();
      bounceLoop.stop();
    };
  }, [livePulse, routeProgress, packageBounce]);

  return (
    <View style={trackingStyles.container}>
      {/* LIVE badge */}
      <View style={trackingStyles.liveBadge}>
        <Animated.View
          style={[trackingStyles.liveDot, { opacity: livePulse }]}
        />
        <Text style={trackingStyles.liveText}>LIVE</Text>
      </View>

      {/* Location Pin with pulsing rings */}
      <View style={trackingStyles.pinArea}>
        {/* Pulsing rings — 3 layers */}
        <PulsingRing size={160} delay={0} color={colors.accent} />
        <PulsingRing size={110} delay={500} color={colors.primaryGradientEnd} />
        <PulsingRing size={64} delay={1000} color={colors.primary} />

        {/* Pin */}
        <View style={trackingStyles.pin}>
          <LinearGradient
            colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
            style={trackingStyles.pinHead}>
            <Text style={trackingStyles.pinIcon}>📍</Text>
          </LinearGradient>
          <View style={trackingStyles.pinTail} />
        </View>
      </View>

      {/* Route dashes */}
      <View style={trackingStyles.routeContainer}>
        {[...Array(6)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              trackingStyles.routeDash,
              {
                opacity: routeProgress.interpolate({
                  inputRange: [i / 6, (i + 1) / 6],
                  outputRange: [0, 1],
                  extrapolate: 'clamp',
                }),
              },
            ]}
          />
        ))}
      </View>

      {/* Package at bottom */}
      <Animated.View
        style={[
          trackingStyles.packageContainer,
          { transform: [{ translateY: packageBounce }] },
        ]}>
        <View style={trackingStyles.packageBox}>
          <Text style={trackingStyles.packageEmoji}>📦</Text>
        </View>
        <View style={trackingStyles.etaChip}>
          <Text style={trackingStyles.etaText}>ETA: 2 hrs</Text>
        </View>
      </Animated.View>

      {/* Location labels */}
      <View style={trackingStyles.labelRow}>
        <View style={trackingStyles.locationLabel}>
          <View style={[trackingStyles.labelDot, { backgroundColor: colors.accent }]} />
          <Text style={trackingStyles.labelText}>Warehouse</Text>
        </View>
        <View style={trackingStyles.locationLabel}>
          <View style={[trackingStyles.labelDot, { backgroundColor: colors.primaryGradientEnd }]} />
          <Text style={trackingStyles.labelText}>Your Door</Text>
        </View>
      </View>
    </View>
  );
};

// ─── Illustration: Checkout ───────────────────────────────────────────────────
const CheckoutIllustration: React.FC = () => {
  const cardAnim = useRef(new Animated.Value(0)).current;
  const checkAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.sequence([
      Animated.spring(cardAnim, { toValue: 1, tension: 70, friction: 8, useNativeDriver: true }),
      Animated.timing(checkAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, [cardAnim, checkAnim]);

  return (
    <View style={checkoutStyles.container}>
      {/* Glassmorphic card */}
      <Animated.View
        style={[
          checkoutStyles.card,
          {
            opacity: cardAnim,
            transform: [
              { translateY: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) },
              { scale: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) },
            ],
          },
        ]}>
        {/* Card top row */}
        <View style={checkoutStyles.cardTopRow}>
          <View style={checkoutStyles.cardChip} />
          <Text style={checkoutStyles.cardContactless}>◎</Text>
        </View>
        {/* Card number */}
        <Text style={checkoutStyles.cardNumber}>•••• •••• •••• 4242</Text>
        {/* Card bottom */}
        <View style={checkoutStyles.cardBottomRow}>
          <View>
            <Text style={checkoutStyles.cardLabel}>CARD HOLDER</Text>
            <Text style={checkoutStyles.cardName}>APPSY SHOPPER</Text>
          </View>
          <View>
            <Text style={checkoutStyles.cardLabel}>EXPIRES</Text>
            <Text style={checkoutStyles.cardExpiry}>12/28</Text>
          </View>
        </View>
      </Animated.View>

      {/* Security shield */}
      <Animated.View style={[checkoutStyles.shieldRow, { opacity: checkAnim }]}>
        <View style={checkoutStyles.shieldBadge}>
          <Text style={checkoutStyles.shieldEmoji}>🔒</Text>
          <Text style={checkoutStyles.shieldText}>256-bit encrypted · Stripe</Text>
        </View>
      </Animated.View>

      {/* Payment method pills */}
      <Animated.View style={[checkoutStyles.pillsRow, { opacity: checkAnim }]}>
        {['💳 Card', '📱 UPI', 'G Pay', '🍎 Pay'].map((label) => (
          <View key={label} style={checkoutStyles.payPill}>
            <Text style={checkoutStyles.payPillText}>{label}</Text>
          </View>
        ))}
      </Animated.View>
    </View>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
type OnboardingScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Onboarding'>;
};

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<Slide>>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const onViewableItemsChanged = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ({ viewableItems }: { viewableItems: any[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setActiveIndex(viewableItems[0].index as number);
      }
    },
    [],
  );

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const handleNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = () => {
    handleGetStarted();
  };

  const handleGetStarted = () => {
    dispatch(completeOnboarding());
    // TODO: navigate to Login when auth feature is built
    // navigation.replace('Login');
    // For now — reset to show the flow was completed (navigates to Login placeholder)
    navigation.replace('Login');
  };

  const renderIllustration = (type: SlideType) => {
    switch (type) {
      case 'discover': return <DiscoverIllustration />;
      case 'tracking': return <TrackingIllustration />;
      case 'checkout': return <CheckoutIllustration />;
    }
  };

  const renderSlide = ({ item }: { item: Slide }) => (
    <View style={[styles.slide, { width }]}>
      <LinearGradient
        colors={item.gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {/* Illustration area */}
      <View style={styles.illustrationArea}>
        {renderIllustration(item.type)}
      </View>
    </View>
  );

  const isLastSlide = activeIndex === SLIDES.length - 1;
  const currentSlide = SLIDES[activeIndex];

  return (
    <View style={styles.container}>
      {/* ── Slide FlatList (gradient backgrounds + illustrations) ── */}
      <Animated.FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig.current}
        style={styles.flatList}
      />

      {/* ── Skip button ── */}
      {!isLastSlide && (
        <TouchableOpacity
          style={[styles.skipButton, { top: insets.top + spacing.md }]}
          onPress={handleSkip}
          activeOpacity={0.7}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      {/* ── Bottom Content Card ── */}
      <View style={[styles.bottomCard, { paddingBottom: insets.bottom + spacing.lg }]}>
        {/* Badge */}
        <View
          style={[
            styles.badge,
            currentSlide.badgeIsLive && styles.badgeLive,
          ]}>
          <Text style={[styles.badgeText, currentSlide.badgeIsLive && styles.badgeTextLive]}>
            {currentSlide.badge}
          </Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>{currentSlide.title}</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>{currentSlide.subtitle}</Text>

        {/* ── Dots + CTA Row ── */}
        <View style={styles.ctaRow}>
          {/* Progress dots */}
          <View style={styles.dotsContainer}>
            {SLIDES.map((_, i) => {
              const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
              const dotWidth = scrollX.interpolate({
                inputRange,
                outputRange: [8, 26, 8],
                extrapolate: 'clamp',
              });
              const dotOpacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.35, 1, 0.35],
                extrapolate: 'clamp',
              });
              return (
                <Animated.View
                  key={i}
                  style={[styles.dot, { width: dotWidth, opacity: dotOpacity }]}
                />
              );
            })}
          </View>

          {/* Next / Get Started button */}
          <TouchableOpacity onPress={handleNext} activeOpacity={0.85}>
            <LinearGradient
              colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaButton}>
              <Text style={styles.ctaText}>
                {isLastSlide ? 'Get Started' : 'Next  →'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
  },
  flatList: {
    flex: 1,
  },
  slide: {
    height: height,
  },
  illustrationArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '15%',
    paddingBottom: '45%', // leave room for the bottom card overlay
  },

  // ── Skip ────────────────────────────────────────────────────────────────
  skipButton: {
    position: 'absolute',
    right: spacing.screenPadding,
    zIndex: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  skipText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textOnDark,
    letterSpacing: typography.letterSpacing.wide,
  },

  // ── Bottom Card ─────────────────────────────────────────────────────────
  bottomCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.secondary,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.lg,
    ...Platform.select({
      android: { elevation: 20 },
      ios: { shadowColor: '#000', shadowOpacity: 0.4, shadowRadius: 20, shadowOffset: { width: 0, height: -8 } },
    }),
  },

  // ── Badge ───────────────────────────────────────────────────────────────
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accentMuted,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  badgeLive: {
    backgroundColor: 'rgba(34,197,94,0.15)',
    borderColor: colors.success,
  },
  badgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.accent,
    letterSpacing: typography.letterSpacing.wider,
  },
  badgeTextLive: {
    color: colors.success,
  },

  // ── Text ────────────────────────────────────────────────────────────────
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.black,
    color: colors.textOnDark,
    lineHeight: typography.fontSize['3xl'] * typography.lineHeight.tight,
    letterSpacing: typography.letterSpacing.tight,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.regular,
    color: colors.textOnDarkMuted,
    lineHeight: typography.fontSize.md * typography.lineHeight.relaxed,
    marginBottom: spacing.xl,
  },

  // ── CTA Row ─────────────────────────────────────────────────────────────
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  ctaButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 50,
    minWidth: 150,
    alignItems: 'center',
  },
  ctaText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textOnDark,
    letterSpacing: typography.letterSpacing.wide,
  },
});

// ─── Illustration Styles ──────────────────────────────────────────────────────

const illustrationStyles = StyleSheet.create({
  container: {
    width: width * 0.82,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glowCircle: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(124,58,237,0.3)',
  },
  glasCard: {
    width: width * 0.72,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: spacing.cardRadiusLg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    padding: spacing.cardPadding,
    alignItems: 'center',
  },
  shoeEmoji: {
    fontSize: 96,
    marginVertical: spacing.md,
  },
  badgeChip: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  badgeChipText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.black,
    color: colors.textPrimary,
    letterSpacing: typography.letterSpacing.widest,
  },
  cardInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: spacing.md,
  },
  cardBrand: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textOnDark,
  },
  cardPrice: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.black,
    color: colors.accent,
    marginTop: 2,
  },
  ratingChip: {
    backgroundColor: 'rgba(163,230,53,0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 10,
  },
  ratingText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.accent,
  },
  floatingTag: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  tagTopLeft: {
    top: -10,
    left: 0,
  },
  tagBottomRight: {
    bottom: -10,
    right: 0,
  },
  floatingTagText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textOnDark,
  },
});

const trackingStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(34,197,94,0.2)',
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: colors.success,
    marginBottom: spacing.sm,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  liveText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.black,
    color: colors.success,
    letterSpacing: typography.letterSpacing.widest,
  },
  pinArea: {
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pin: {
    alignItems: 'center',
    zIndex: 10,
  },
  pinHead: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      android: { elevation: 8 },
      ios: { shadowColor: colors.primary, shadowOpacity: 0.7, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },
    }),
  },
  pinIcon: {
    fontSize: 26,
  },
  pinTail: {
    width: 3,
    height: 16,
    backgroundColor: colors.primaryGradientEnd,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    marginTop: -4,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginVertical: spacing.sm,
  },
  routeDash: {
    width: 16,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(163,230,53,0.7)',
  },
  packageContainer: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  packageBox: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  packageEmoji: {
    fontSize: 28,
  },
  etaChip: {
    backgroundColor: 'rgba(163,230,53,0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  etaText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.accent,
  },
  labelRow: {
    flexDirection: 'row',
    gap: spacing.xl,
    marginTop: spacing.sm,
  },
  locationLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  labelDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  labelText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.textOnDarkMuted,
  },
});

const checkoutStyles = StyleSheet.create({
  container: {
    width: width * 0.82,
    alignItems: 'center',
    gap: spacing.lg,
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(124,58,237,0.35)',
    borderRadius: spacing.cardRadiusLg,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    padding: spacing.lg,
    gap: spacing.md,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardChip: {
    width: 40,
    height: 30,
    borderRadius: 6,
    backgroundColor: 'rgba(163,230,53,0.6)',
    borderWidth: 1,
    borderColor: colors.accent,
  },
  cardContactless: {
    fontSize: 22,
    color: colors.textOnDarkMuted,
  },
  cardNumber: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textOnDark,
    letterSpacing: typography.letterSpacing.wider,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.textOnDarkMuted,
    letterSpacing: typography.letterSpacing.widest,
  },
  cardName: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textOnDark,
    marginTop: 2,
  },
  cardExpiry: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textOnDark,
    marginTop: 2,
  },
  shieldRow: {
    alignItems: 'center',
  },
  shieldBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(34,197,94,0.12)',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.35)',
  },
  shieldEmoji: {
    fontSize: 16,
  },
  shieldText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.success,
    letterSpacing: typography.letterSpacing.wide,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  payPill: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  payPillText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textOnDark,
  },
});

export default OnboardingScreen;
