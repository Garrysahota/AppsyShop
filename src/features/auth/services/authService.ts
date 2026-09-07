import {
  createUserWithEmailAndPassword,
  getAuth,
  getIdToken,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from '@react-native-firebase/auth';
import { doc, getFirestore, serverTimestamp, setDoc } from '@react-native-firebase/firestore';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { AuthResponse, LoginCredentials, RegisterCredentials, UserInfo } from '../types';

const GOOGLE_WEB_CLIENT_ID = '83401155353-puea2d6tld9qjirn6mb9kf69081pbbme.apps.googleusercontent.com';

try {
  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    offlineAccess: false,
  });
} catch (e) {
  console.warn('[GoogleSignin] configure error:', e);
}

const mapFirebaseAuthError = (error: any): string => {
  const code = error?.code || '';
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Invalid email or password. Please check your credentials.';
    case 'auth/email-already-in-use':
      return 'This email address is already in use. Please sign in instead.';
    case 'auth/invalid-email':
      return 'The email address is badly formatted.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use at least 6 characters.';
    case 'auth/user-disabled':
      return 'This user account has been disabled. Please contact support.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again in a few minutes.';
    default:
      return error?.message || 'Authentication failed. Please try again.';
  }
};

const formatFirebaseUser = (firebaseUser: User): UserInfo => ({
  uid: firebaseUser.uid,
  email: firebaseUser.email || '',
  displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Sneakerhead',
  photoURL:
    firebaseUser.photoURL ||
    `https://api.dicebear.com/7.x/bottts/png?seed=${firebaseUser.email || firebaseUser.uid}`,
  phoneNumber: firebaseUser.phoneNumber,
  createdAt: firebaseUser.metadata.creationTime,
  emailVerified: firebaseUser.emailVerified,
});

const syncUserProfileToFirestore = async (
  firebaseUser: User,
  additionalData: Partial<UserInfo> = {},
): Promise<void> => {
  try {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Firestore sync timeout')), 3000),
    );

    const syncPromise = (async () => {
      const db = getFirestore();
      const userRef = doc(db, 'users', firebaseUser.uid);
      await setDoc(
        userRef,
        {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: additionalData.displayName || firebaseUser.displayName,
          photoURL: additionalData.photoURL || firebaseUser.photoURL,
          lastLoginAt: serverTimestamp(),
          createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
        },
        { merge: true },
      );
    })();

    await Promise.race([syncPromise, timeoutPromise]);
  } catch (err) {
    console.log('[Firestore] Non-critical user sync notice:', err);
  }
};

class AuthService {
  
  async loginWithEmail(credentials: LoginCredentials): Promise<AuthResponse> {
    const email = credentials.email.trim();
    const password = credentials.password;

    if (!email || !password) {
      throw new Error('Please provide both email and password.');
    }

    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const token = await getIdToken(firebaseUser);

      syncUserProfileToFirestore(firebaseUser).catch(() => {});

      return {
        user: formatFirebaseUser(firebaseUser),
        token,
      };
    } catch (error: any) {
      throw new Error(mapFirebaseAuthError(error));
    }
  }

  async registerWithEmail(credentials: RegisterCredentials): Promise<AuthResponse> {
    const email = credentials.email.trim();
    const fullName = credentials.fullName.trim();
    const password = credentials.password;

    if (!fullName) {
      throw new Error('Please enter your full name.');
    }
    if (!email) {
      throw new Error('Please enter a valid email address.');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      const photoURL = `https://api.dicebear.com/7.x/bottts/png?seed=${email}`;

      await updateProfile(firebaseUser, {
        displayName: fullName,
        photoURL,
      });

      const token = await getIdToken(firebaseUser);

      syncUserProfileToFirestore(firebaseUser, {
        displayName: fullName,
        photoURL,
      }).catch(() => {});

      return {
        user: {
          ...formatFirebaseUser(firebaseUser),
          displayName: fullName,
          photoURL,
        },
        token,
      };
    } catch (error: any) {
      throw new Error(mapFirebaseAuthError(error));
    }
  }

  async sendPasswordResetEmail(email: string): Promise<{ success: boolean; message: string }> {
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      throw new Error('Please enter a valid email address.');
    }

    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, cleanEmail);
      return {
        success: true,
        message: `Password reset link has been sent to ${cleanEmail}. Check your inbox.`,
      };
    } catch (error: any) {
      throw new Error(mapFirebaseAuthError(error));
    }
  }

  async loginWithSocial(provider: 'google' | 'apple'): Promise<AuthResponse> {
    if (provider === 'google') {
      try {
        console.log('[Google Auth] Starting Google Sign-In...');
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        
        const signInResult = await GoogleSignin.signIn();
        console.log('[Google Auth] Sign-in result received:', JSON.stringify(signInResult));

        if ((signInResult as any)?.type === 'cancelled') {
          throw new Error('Google Sign-In was cancelled.');
        }

        let idToken: string | null = null;
        if (signInResult && typeof signInResult === 'object') {
          if ('data' in signInResult && signInResult.data) {
            idToken = (signInResult.data as any).idToken;
          } else if ('idToken' in signInResult) {
            idToken = (signInResult as any).idToken;
          }
        }

        if (!idToken) {
          console.log('[Google Auth] Fetching tokens via getTokens()...');
          const tokens = await GoogleSignin.getTokens();
          idToken = tokens.idToken;
        }

        if (!idToken) {
          throw new Error('Google Sign-In failed to retrieve identity token.');
        }

        console.log('[Google Auth] Authenticating with Firebase...');
        const googleCredential = GoogleAuthProvider.credential(idToken);
        const auth = getAuth();
        const userCredential = await signInWithCredential(auth, googleCredential);
        const firebaseUser = userCredential.user;
        const token = await getIdToken(firebaseUser);

        console.log('[Google Auth] Firebase login successful for:', firebaseUser.email);

        syncUserProfileToFirestore(firebaseUser).catch(() => {});

        return {
          user: formatFirebaseUser(firebaseUser),
          token,
        };
      } catch (error: any) {
        console.error('[Google Auth Error]:', error);
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          throw new Error('Google Sign-In was cancelled.');
        } else if (error.code === statusCodes.IN_PROGRESS) {
          throw new Error('Google Sign-In is already in progress.');
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          throw new Error('Google Play Services is not available or outdated on this device.');
        } else if (String(error).includes('DEVELOPER_ERROR') || String(error?.code) === '10') {
          throw new Error('Google Sign-In SHA-1 Mismatch (DEVELOPER_ERROR): Please register your APK Release SHA-1 fingerprint in Firebase Console.');
        }
        throw new Error(mapFirebaseAuthError(error));
      }
    } else {
      
      const uid = 'usr_apple_' + Math.random().toString(36).substring(2, 10);
      const user: UserInfo = {
        uid,
        email: 'apple.user@icloud.com',
        displayName: 'Alex Mercer (Apple)',
        photoURL: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
        createdAt: new Date().toISOString(),
        emailVerified: true,
      };

      return {
        user,
        token: 'token_' + uid,
      };
    }
  }

  async logout(): Promise<void> {
    try {
      const auth = getAuth();
      await signOut(auth);
      try {
        await GoogleSignin.signOut();
      } catch {
        
      }
    } catch (error: any) {
      console.warn('[AuthService] Sign out error:', error);
    }
  }

  getCurrentUser(): UserInfo | null {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    return currentUser ? formatFirebaseUser(currentUser) : null;
  }
}

export const authService = new AuthService();
export default authService;
