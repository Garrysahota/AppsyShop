const colors = {

  primary: '#8A2387',
  primaryGradientStart: '#8A2387',
  primaryGradientEnd: '#E94057',

  secondary: '#1A1625',
  surface: '#FFFFFF',
  surfaceGlass: 'rgba(255,255,255,0.12)',
  surfaceGlassLight: 'rgba(255,255,255,0.6)',

  backgroundStart: '#F5F3FF',
  backgroundEnd: '#FFFFFF',

  accent: '#A3E635',
  accentMuted: 'rgba(163,230,53,0.18)',

  textPrimary: '#1A1625',
  textSecondary: '#6B7280',
  textOnDark: '#FFFFFF',
  textOnDarkMuted: 'rgba(255,255,255,0.65)',

  success: '#22C55E',
  error: '#F43F5E',
  warning: '#F59E0B',
  info: '#3B82F6',

  border: '#EDE9FE',
  borderDark: 'rgba(255,255,255,0.15)',

  overlay: 'rgba(26,22,37,0.55)',
  transparent: 'transparent',


} as const;

export type ColorKey = keyof typeof colors;
export default colors;
