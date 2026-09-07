import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@theme';
import { typography } from '@theme';
import { spacing } from '@theme';
import useAppSelector from '@shared/hooks/useAppSelector';
import type { AuthStackParamList } from '@app/navigation/types';

const { width, height } = Dimensions.get('window');

type SplashScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Splash'>;
};

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const hasSeenOnboarding = useAppSelector(
    (state) => state.onboarding.hasSeenOnboarding,
  );

  const logoScale = useRef(new Animated.Value(0.2)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const dotOpacity = useRef(new Animated.Value(0)).current;
  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 80,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      
      Animated.timing(dotOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    const dotPulse = Animated.loop(
      Animated.sequence([
        Animated.timing(dot1Anim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(dot2Anim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(dot3Anim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.parallel([
          Animated.timing(dot1Anim, { toValue: 0, duration: 200, useNativeDriver: true }),
          Animated.timing(dot2Anim, { toValue: 0, duration: 200, useNativeDriver: true }),
          Animated.timing(dot3Anim, { toValue: 0, duration: 200, useNativeDriver: true }),
        ]),
      ]),
    );
    dotPulse.start();

    const timer = setTimeout(() => {
      dotPulse.stop();
      if (hasSeenOnboarding) {
        navigation.replace('Login');
      } else {
        navigation.replace('Onboarding');
      }
    }, 2500);

    return () => {
      clearTimeout(timer);
      dotPulse.stop();
    };
    
  }, []);

  const makeDotStyle = (anim: Animated.Value) => ({
    transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [0, -8] }) }],
    opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0.35, 1] }),
  });

  return (
    <LinearGradient
      colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={styles.container}>

      {}
      <View style={[styles.circle, styles.circleTopRight]} />
      <View style={[styles.circle, styles.circleBottomLeft]} />
      <View style={[styles.circleSm, styles.circleTopLeft]} />

      {}
      <Animated.View
        style={[
          styles.logoBlock,
          { opacity: logoOpacity, transform: [{ scale: logoScale }] },
        ]}>

        {}
        <View style={styles.logoMark}>
          <View style={styles.logoMarkInner}>
            <Text style={styles.logoMarkText}>A</Text>
          </View>
        </View>

        {}
        <View style={styles.wordmarkRow}>
          <Text style={styles.wordmarkAppsy}>APPSY</Text>
          <View style={styles.wordmarkShopContainer}>
            <Text style={styles.wordmarkShop}>SHOP</Text>
          </View>
        </View>

        {}
        <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
          Step Into Style
        </Animated.Text>
      </Animated.View>

      {}
      <Animated.View
        style={[
          styles.dotsRow,
          { opacity: dotOpacity, bottom: insets.bottom + spacing.xxl },
        ]}>
        <Animated.View style={[styles.dot, makeDotStyle(dot1Anim)]} />
        <Animated.View style={[styles.dot, makeDotStyle(dot2Anim)]} />
        <Animated.View style={[styles.dot, makeDotStyle(dot3Anim)]} />
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  circle: {
    position: 'absolute',
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: width * 0.375,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  circleTopRight: {
    top: -width * 0.25,
    right: -width * 0.25,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  circleBottomLeft: {
    bottom: -width * 0.3,
    left: -width * 0.3,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  circleSm: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  circleTopLeft: {
    top: height * 0.08,
    left: -width * 0.1,
    backgroundColor: 'transparent',
  },

  logoBlock: {
    alignItems: 'center',
  },
  logoMark: {
    width: 88,
    height: 88,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  logoMarkInner: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoMarkText: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.black,
    color: colors.textOnDark,
    letterSpacing: typography.letterSpacing.tight,
  },
  wordmarkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  wordmarkAppsy: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.black,
    color: colors.textOnDark,
    letterSpacing: typography.letterSpacing.wider,
  },
  wordmarkShopContainer: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: 6,
  },
  wordmarkShop: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.black,
    color: colors.textPrimary,
    letterSpacing: typography.letterSpacing.wider,
  },
  tagline: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.textOnDarkMuted,
    letterSpacing: typography.letterSpacing.wide,
    marginTop: spacing.xs,
  },

  dotsRow: {
    position: 'absolute',
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textOnDark,
  },
});

export default SplashScreen;
