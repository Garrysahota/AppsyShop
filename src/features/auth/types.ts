export interface UserInfo {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL?: string | null;
  phoneNumber?: string | null;
  createdAt?: string;
  emailVerified?: boolean;
}

export interface AuthState {
  user: UserInfo | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  resetEmailSent: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: UserInfo;
  token: string;
  refreshToken?: string;
}
