/**
 * Auth Slice — AppsyShop
 * Redux Toolkit slice for managing authentication, user session, and auth tokens.
 */

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import authService from '../services/authService';
import { AuthResponse, AuthState, LoginCredentials, RegisterCredentials, UserInfo } from '../types';

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  resetEmailSent: false,
};

/**
 * Async Thunk: Sign In with Email and Password
 */
export const loginUser = createAsyncThunk<
  AuthResponse,
  LoginCredentials,
  { rejectValue: string }
>('auth/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    const response = await authService.loginWithEmail(credentials);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Login failed. Please check your credentials.');
  }
});

/**
 * Async Thunk: Register with Full Name, Email and Password
 */
export const registerUser = createAsyncThunk<
  AuthResponse,
  RegisterCredentials,
  { rejectValue: string }
>('auth/registerUser', async (credentials, { rejectWithValue }) => {
  try {
    const response = await authService.registerWithEmail(credentials);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Registration failed. Please try again.');
  }
});

/**
 * Async Thunk: Social Login (Google / Apple)
 */
export const loginSocialUser = createAsyncThunk<
  AuthResponse,
  'google' | 'apple',
  { rejectValue: string }
>('auth/loginSocialUser', async (provider, { rejectWithValue }) => {
  try {
    const response = await authService.loginWithSocial(provider);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message || `${provider} sign-in failed.`);
  }
});

/**
 * Async Thunk: Send Password Reset Email
 */
export const sendPasswordReset = createAsyncThunk<
  { success: boolean; message: string },
  string,
  { rejectValue: string }
>('auth/sendPasswordReset', async (email, { rejectWithValue }) => {
  try {
    const response = await authService.sendPasswordResetEmail(email);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to send password reset email.');
  }
});

/**
 * Async Thunk: Logout
 */
export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  await authService.logout();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: state => {
      state.error = null;
    },
    resetPasswordResetStatus: state => {
      state.resetEmailSent = false;
    },
    setCredentials: (
      state,
      action: PayloadAction<{ user: UserInfo; token: string; refreshToken?: string }>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken || null;
      state.isAuthenticated = true;
      state.error = null;
    },
  },
  extraReducers: builder => {
    // ─── Login ──────────────────────────────────────────────
    builder
      .addCase(loginUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken || null;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'An unexpected error occurred during login.';
        state.isAuthenticated = false;
      });

    // ─── Register ───────────────────────────────────────────
    builder
      .addCase(registerUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken || null;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'An unexpected error occurred during registration.';
        state.isAuthenticated = false;
      });

    // ─── Social Login ───────────────────────────────────────
    builder
      .addCase(loginSocialUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginSocialUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken || null;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginSocialUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Social sign-in failed.';
      });

    // ─── Password Reset ─────────────────────────────────────
    builder
      .addCase(sendPasswordReset.pending, state => {
        state.isLoading = true;
        state.error = null;
        state.resetEmailSent = false;
      })
      .addCase(sendPasswordReset.fulfilled, state => {
        state.isLoading = false;
        state.resetEmailSent = true;
        state.error = null;
      })
      .addCase(sendPasswordReset.rejected, (state, action) => {
        state.isLoading = false;
        state.resetEmailSent = false;
        state.error = action.payload || 'Failed to send password reset email.';
      });

    // ─── Logout ─────────────────────────────────────────────
    builder.addCase(logoutUser.fulfilled, state => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.resetEmailSent = false;
    });
  },
});

export const { clearAuthError, resetPasswordResetStatus, setCredentials } = authSlice.actions;
export default authSlice.reducer;
