/**
 * Onboarding Redux slice — AppsyShop
 * Tracks whether the user has completed the onboarding flow.
 * Persisted via MMKV so the splash → onboarding flow only shows once.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OnboardingState {
  hasSeenOnboarding: boolean;
  lastSeenSlide: number;
}

const initialState: OnboardingState = {
  hasSeenOnboarding: false,
  lastSeenSlide: 0,
};

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    completeOnboarding: (state) => {
      state.hasSeenOnboarding = true;
    },
    setLastSeenSlide: (state, action: PayloadAction<number>) => {
      state.lastSeenSlide = action.payload;
    },
    resetOnboarding: (state) => {
      state.hasSeenOnboarding = false;
      state.lastSeenSlide = 0;
    },
  },
});

export const { completeOnboarding, setLastSeenSlide, resetOnboarding } =
  onboardingSlice.actions;

export default onboardingSlice.reducer;
