/**
 * Jest Global Setup & Mocks
 */

jest.mock('@react-native-community/geolocation', () => ({
  addListener: jest.fn(),
  getCurrentPosition: jest.fn(success =>
    success({
      coords: {
        latitude: 40.7128,
        longitude: -74.006,
      },
    }),
  ),
  removeListeners: jest.fn(),
  requestAuthorization: jest.fn(),
  setConfiguration: jest.fn(),
  setRNConfiguration: jest.fn(),
  startObserving: jest.fn(),
  stopObserving: jest.fn(),
}));

jest.mock('react-native-nitro-modules', () => ({
  NitroModules: {},
}));

jest.mock('react-native-mmkv', () => ({
  createMMKV: jest.fn(() => ({
    set: jest.fn(),
    getString: jest.fn(() => null),
    getNumber: jest.fn(() => null),
    getBoolean: jest.fn(() => null),
    remove: jest.fn(),
    clearAll: jest.fn(),
  })),
}));

jest.mock('@react-native-firebase/app', () => ({
  getApp: jest.fn(),
}));

jest.mock('@react-native-firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    currentUser: null,
  })),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithCredential: jest.fn(),
  signOut: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  updateProfile: jest.fn(),
  getIdToken: jest.fn(() => Promise.resolve('mock-token')),
  GoogleAuthProvider: {
    credential: jest.fn(() => ({})),
  },
}));

jest.mock('@react-native-firebase/firestore', () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(() => Promise.resolve()),
  serverTimestamp: jest.fn(() => new Date()),
}));

jest.mock('@react-native-firebase/messaging', () => ({
  getMessaging: jest.fn(),
  getToken: jest.fn(() => Promise.resolve('mock-fcm-token')),
  requestPermission: jest.fn(() => Promise.resolve(1)),
  onMessage: jest.fn(() => () => {}),
  AuthorizationStatus: {
    AUTHORIZED: 1,
    PROVISIONAL: 2,
  },
}));

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn(() => Promise.resolve(true)),
    signIn: jest.fn(() => Promise.resolve({ data: { idToken: 'mock-google-id-token' } })),
    getTokens: jest.fn(() => Promise.resolve({ idToken: 'mock-google-id-token' })),
    signOut: jest.fn(() => Promise.resolve()),
  },
  statusCodes: {
    SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED',
    IN_PROGRESS: 'IN_PROGRESS',
    PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE',
  },
}));
