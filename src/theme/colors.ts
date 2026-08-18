/**
 * Violet Pulse — AppsyShop Design Token Palette
 * Zepto/Blinkit-inspired quick-commerce aesthetic
 * Rule: Never hardcode hex values in components — always import from here.
 */

const colors = {
  // ─── Primary Gradient ────────────────────────────────────────────────────
  primary: '#7C3AED',
  primaryGradientStart: '#7C3AED',
  primaryGradientEnd: '#EC4899',

  // ─── Surfaces ────────────────────────────────────────────────────────────
  secondary: '#1A1625',
  surface: '#FFFFFF',
  surfaceGlass: 'rgba(255,255,255,0.12)',
  surfaceGlassLight: 'rgba(255,255,255,0.6)',

  // ─── Background Gradient ─────────────────────────────────────────────────
  backgroundStart: '#F5F3FF',
  backgroundEnd: '#FFFFFF',

  // ─── Accent (Lime — discounts, badges, active states) ────────────────────
  accent: '#A3E635',
  accentMuted: 'rgba(163,230,53,0.18)',

  // ─── Text ────────────────────────────────────────────────────────────────
  textPrimary: '#1A1625',
  textSecondary: '#6B7280',
  textOnDark: '#FFFFFF',
  textOnDarkMuted: 'rgba(255,255,255,0.65)',

  // ─── Semantic ────────────────────────────────────────────────────────────
  success: '#22C55E',
  error: '#F43F5E',
  warning: '#F59E0B',
  info: '#3B82F6',

  // ─── Border / Divider ────────────────────────────────────────────────────
  border: '#EDE9FE',
  borderDark: 'rgba(255,255,255,0.15)',

  // ─── Transparent / Overlay ───────────────────────────────────────────────
  overlay: 'rgba(26,22,37,0.55)',
  transparent: 'transparent',
} as const;

export type ColorKey = keyof typeof colors;
export default colors;
