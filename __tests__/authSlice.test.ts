import authReducer, {
  clearAuthError,
  resetPasswordResetStatus,
  setCredentials,
} from '../src/features/auth/store/authSlice';
import { AuthState } from '../src/features/auth/types';

describe('authSlice', () => {
  const initialState: AuthState = {
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    resetEmailSent: false,
  };

  it('should return initial state when passed empty action', () => {
    expect(authReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('should handle setCredentials', () => {
    const mockUser = {
      uid: 'user_123',
      email: 'alex@example.com',
      displayName: 'Alex Mercer',
    };
    const mockToken = 'mock.jwt.token';

    const newState = authReducer(
      initialState,
      setCredentials({ user: mockUser, token: mockToken, refreshToken: 'ref_123' }),
    );

    expect(newState.isAuthenticated).toBe(true);
    expect(newState.user).toEqual(mockUser);
    expect(newState.token).toBe(mockToken);
    expect(newState.error).toBeNull();
  });

  it('should handle clearAuthError', () => {
    const stateWithError: AuthState = {
      ...initialState,
      error: 'Invalid password',
    };

    const newState = authReducer(stateWithError, clearAuthError());
    expect(newState.error).toBeNull();
  });

  it('should handle resetPasswordResetStatus', () => {
    const stateWithResetSent: AuthState = {
      ...initialState,
      resetEmailSent: true,
    };

    const newState = authReducer(stateWithResetSent, resetPasswordResetStatus());
    expect(newState.resetEmailSent).toBe(false);
  });
});
