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
import { useNavigation } from '@react-navigation/native';
import {
  Bell,
  ChevronRight,
  CreditCard,
  Crown,
  Heart,
  LogOut,
  MapPin,
  Ruler,
  Shield,
  Zap,
} from 'lucide-react-native';
import { colors, spacing, typography } from '@theme';
import useAppDispatch from '@shared/hooks/useAppDispatch';
import useAppSelector from '@shared/hooks/useAppSelector';
import { logoutUser } from '@features/auth/store/authSlice';

export const ProfileScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  const favoritesCount = useAppSelector(state => state.products.favorites.length);

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
        <Text style={styles.title}>Account 👤</Text>

        {/* User Card */}
        <LinearGradient
          colors={['#7C3AED', '#4C1D95']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.profileCard}>
          <View style={styles.avatarRow}>
            <Image
              source={{
                uri:
                  user?.photoURL ||
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
              }}
              style={styles.avatar}
            />

            <View style={styles.userInfo}>
              <View style={styles.vipBadge}>
                <Crown size={11} color="#000" />
                <Text style={styles.vipBadgeText}>VIP DIAMOND TIER</Text>
              </View>
              <Text style={styles.userName}>{user?.displayName || 'Alex Mercer'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'alex@example.com'}</Text>
            </View>
          </View>

          {/* Quick Stats Bar */}
          <View style={styles.statsBar}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>14</Text>
              <Text style={styles.statLabel}>DROPS COPPED</Text>
            </View>
            <View style={styles.statDivider} />
            <TouchableOpacity
              style={styles.statItem}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Wishlist')}>
              <Text style={styles.statValue}>{favoritesCount}</Text>
              <Text style={[styles.statLabel, { color: colors.accent }]}>WISHLIST ❤️</Text>
            </TouchableOpacity>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>$180</Text>
              <Text style={styles.statLabel}>REWARDS</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Settings List */}
        <Text style={styles.sectionHeader}>Preferences & Delivery</Text>

        <View style={styles.menuGroup}>
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.75}
            onPress={() => navigation.navigate('Wishlist')}>
            <View style={[styles.menuIconBox, { backgroundColor: 'rgba(244, 63, 94, 0.2)' }]}>
              <Heart size={18} color="#F43F5E" fill="rgba(244, 63, 94, 0.3)" />
            </View>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemTitle}>Saved Wishlist & Grails</Text>
              <Text style={styles.menuItemSubtitle}>{favoritesCount} sneakers saved for drops</Text>
            </View>
            <ChevronRight size={18} color="rgba(255, 255, 255, 0.3)" />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.75}>
            <View style={[styles.menuIconBox, { backgroundColor: 'rgba(124, 58, 237, 0.2)' }]}>
              <MapPin size={18} color={colors.primaryGradientStart} />
            </View>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemTitle}>Saved Addresses</Text>
              <Text style={styles.menuItemSubtitle}>Manhattan, NY (Default · 10 min drop)</Text>
            </View>
            <ChevronRight size={18} color="rgba(255, 255, 255, 0.3)" />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.75}>
            <View style={[styles.menuIconBox, { backgroundColor: 'rgba(236, 72, 153, 0.2)' }]}>
              <CreditCard size={18} color={colors.primaryGradientEnd} />
            </View>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemTitle}>Payment Methods</Text>
              <Text style={styles.menuItemSubtitle}>Apple Pay · Visa ending 4092</Text>
            </View>
            <ChevronRight size={18} color="rgba(255, 255, 255, 0.3)" />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.75}>
            <View style={[styles.menuIconBox, { backgroundColor: 'rgba(163, 230, 53, 0.2)' }]}>
              <Ruler size={18} color={colors.accent} />
            </View>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemTitle}>Sneaker Size Preference</Text>
              <Text style={styles.menuItemSubtitle}>US 9.5 (Men's)</Text>
            </View>
            <ChevronRight size={18} color="rgba(255, 255, 255, 0.3)" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionHeader}>Security & Alerts</Text>

        <View style={styles.menuGroup}>
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.75}
            onPress={() => navigation.navigate('Notifications')}>
            <View style={[styles.menuIconBox, { backgroundColor: 'rgba(59, 130, 246, 0.2)' }]}>
              <Bell size={18} color="#60A5FA" />
            </View>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemTitle}>Drop Notifications</Text>
              <Text style={styles.menuItemSubtitle}>Instant alerts for VIP limited runs</Text>
            </View>
            <ChevronRight size={18} color="rgba(255, 255, 255, 0.3)" />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.75}>
            <View style={[styles.menuIconBox, { backgroundColor: 'rgba(34, 197, 94, 0.2)' }]}>
              <Shield size={18} color={colors.success} />
            </View>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemTitle}>Authenticity & Warranty</Text>
              <Text style={styles.menuItemSubtitle}>100% verified sneaker guarantee</Text>
            </View>
            <ChevronRight size={18} color="rgba(255, 255, 255, 0.3)" />
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={styles.signOutButton}
          activeOpacity={0.8}
          onPress={() => dispatch(logoutUser())}>
          <LogOut size={18} color={colors.error} />
          <Text style={styles.signOutText}>Sign Out of AppsyShop</Text>
        </TouchableOpacity>
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
  profileCard: {
    borderRadius: spacing.cardRadiusLg - 4,
    padding: spacing.md + 2,
    marginBottom: spacing.lg,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: '#1E1435',
  },
  userInfo: {
    flex: 1,
  },
  vipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 4,
    marginBottom: 4,
  },
  vipBadgeText: {
    color: '#000',
    fontSize: 9,
    fontWeight: typography.fontWeight.black,
    letterSpacing: typography.letterSpacing.wider,
  },
  userName: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.black,
  },
  userEmail: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: typography.fontSize.xs,
    marginTop: 1,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: spacing.cardRadius - 6,
    paddingVertical: spacing.sm + 2,
    marginTop: spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.black,
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 8,
    fontWeight: typography.fontWeight.bold,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  sectionHeader: {
    color: colors.textOnDarkMuted,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.extraBold,
    letterSpacing: typography.letterSpacing.wider,
    textTransform: 'uppercase',
    marginBottom: spacing.xs + 2,
  },
  menuGroup: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: spacing.cardRadius - 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: spacing.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.sm + 1,
    fontWeight: typography.fontWeight.bold,
  },
  menuItemSubtitle: {
    color: colors.textOnDarkMuted,
    fontSize: typography.fontSize.xs,
    marginTop: 2,
  },
  menuDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginLeft: 56,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(244, 63, 94, 0.12)',
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: spacing.cardRadius - 4,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  signOutText: {
    color: '#FECDD3',
    fontSize: typography.fontSize.sm + 1,
    fontWeight: typography.fontWeight.bold,
  },
});

export default ProfileScreen;
