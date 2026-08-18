/**
 * Spacing tokens — AppsyShop
 * Base unit: 4px. All layout spacing derived from this scale.
 * Cards: 20–24px radius (bigger than typical 12px — app-native feel)
 */

const spacing = {
  '0': 0,
  '1': 4,
  '2': 8,
  '3': 12,
  '4': 16,
  '5': 20,
  '6': 24,
  '8': 32,
  '10': 40,
  '12': 48,
  '16': 64,
  '20': 80,

  // Semantic aliases
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,

  // Card / component specific
  cardPadding: 20,
  cardRadius: 20,
  cardRadiusLg: 28,
  screenPadding: 20,
  bottomNavHeight: 72,
} as const;

export type SpacingKey = keyof typeof spacing;
export default spacing;
