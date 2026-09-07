export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
  extraBold: '800' as const,
  black: '900' as const,
};

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 40,
  '6xl': 48,
};

export const lineHeight = {
  tight: 1.15,
  snug: 1.25,
  normal: 1.45,
  relaxed: 1.6,
};

export const letterSpacing = {
  tight: -0.8,
  normal: 0,
  wide: 0.5,
  wider: 1.2,
  widest: 2.5,
};

const typography = {
  fontWeight,
  fontSize,
  lineHeight,
  letterSpacing,
} as const;

export default typography;
