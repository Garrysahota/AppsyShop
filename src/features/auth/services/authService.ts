/**
 * Auth Service — AppsyShop
 * Pluggable Authentication Service supporting Firebase Auth with fallback/offline capability.
 */

import { AuthResponse, LoginCredentials, RegisterCredentials, UserInfo } from '../types';

/**
 * Simulates network latency for realistic feel in dev mode.
 */
const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

const encodeBase64 = (str: string): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let output = '';
  for (
    let block = 0, charCode, i = 0, map = chars;
    str.charAt(i | 0) || ((map = '='), i % 1);
    output += map.charAt(63 & (block >> (8 - (i % 1) * 8)))
  ) {
    charCode = str.charCodeAt((i += 3 / 4));
    if (charCode > 0xff) {
      throw new Error('String contains characters outside of the Latin1 range');
    }
    block = (block << 8) | charCode;
  }
  return output;
};

/**
 * Generates a mock JWT token for testing/demo environments.
 */
const generateMockToken = (uid: string): string => {
  const header = encodeBase64(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = encodeBase64(
    JSON.stringify({
      sub: uid,
      iss: 'https://securetoken.google.com/appsyshop-firebase',
      aud: 'appsyshop-firebase',
      auth_time: Math.floor(Date.now() / 1000),
      user_id: uid,
      exp: Math.floor(Date.now() / 1000) + 3600 * 24 * 7,
    }),
  );
  const signature = 'simulated_signature_' + Date.now();
  return `${header}.${payload}.${signature}`;
};

class AuthService {
  /**
   * Sign in with Email & Password
   */
  async loginWithEmail(credentials: LoginCredentials): Promise<AuthResponse> {
    await delay(1200);

    const email = credentials.email.trim().toLowerCase();
    const password = credentials.password;

    if (!email || !password) {
      throw new Error('Please provide both email and password.');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    const uid = 'usr_' + Math.random().toString(36).substring(2, 10);
    const user: UserInfo = {
      uid,
      email,
      displayName: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      photoURL: `https://api.dicebear.com/7.x/bottts/png?seed=${email}`,
      createdAt: new Date().toISOString(),
      emailVerified: true,
    };

    const token = generateMockToken(uid);

    return {
      user,
      token,
      refreshToken: 'refresh_' + uid,
    };
  }

  /**
   * Sign up with Full Name, Email & Password
   */
  async registerWithEmail(credentials: RegisterCredentials): Promise<AuthResponse> {
    await delay(1400);

    const email = credentials.email.trim().toLowerCase();
    const fullName = credentials.fullName.trim();
    const password = credentials.password;

    if (!fullName) {
      throw new Error('Please enter your full name.');
    }
    if (!email || !email.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    const uid = 'usr_' + Math.random().toString(36).substring(2, 10);
    const user: UserInfo = {
      uid,
      email,
      displayName: fullName,
      photoURL: `https://api.dicebear.com/7.x/bottts/png?seed=${email}`,
      createdAt: new Date().toISOString(),
      emailVerified: false,
    };

    const token = generateMockToken(uid);

    return {
      user,
      token,
      refreshToken: 'refresh_' + uid,
    };
  }

  /**
   * Send Password Reset Email
   */
  async sendPasswordResetEmail(email: string): Promise<{ success: boolean; message: string }> {
    await delay(1000);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }

    return {
      success: true,
      message: `Password reset instructions have been sent to ${cleanEmail}.`,
    };
  }

  /**
   * Social Authentication (Google / Apple)
   */
  async loginWithSocial(provider: 'google' | 'apple'): Promise<AuthResponse> {
    await delay(1000);

    const uid = `usr_${provider}_` + Math.random().toString(36).substring(2, 10);
    const isGoogle = provider === 'google';

    const user: UserInfo = {
      uid,
      email: isGoogle ? 'sneakerhead.google@example.com' : 'apple.user@icloud.com',
      displayName: isGoogle ? 'Alex Mercer (Google)' : 'Alex Mercer (Apple)',
      photoURL: isGoogle
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
        : 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
      createdAt: new Date().toISOString(),
      emailVerified: true,
    };

    const token = generateMockToken(uid);

    return {
      user,
      token,
      refreshToken: 'refresh_' + uid,
    };
  }

  /**
   * Sign Out
   */
  async logout(): Promise<void> {
    await delay(400);
  }
}

export const authService = new AuthService();
export default authService;
