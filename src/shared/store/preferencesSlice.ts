import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import locationService from '@shared/services/locationService';

export type CurrencyType = 'INR' | 'USD';

export interface PreferencesState {
  currency: CurrencyType;
  currencySymbol: string;
  autoDetectCurrency: boolean;
  detectedCountry: string;
  detectedCurrency: CurrencyType;
}

const initialState: PreferencesState = {
  currency: 'INR',
  currencySymbol: '₹',
  autoDetectCurrency: true,
  detectedCountry: 'India',
  detectedCurrency: 'INR',
};

export const initializeCurrencyPreference = createAsyncThunk(
  'preferences/initializeCurrency',
  async (_, { dispatch }) => {
    try {
      const { countryCode, countryName } = await locationService.detectUserCountry();
      const detectedCurrency: CurrencyType = countryCode === 'IN' ? 'INR' : 'USD';
      dispatch(setDetectedCountry({ country: countryName, currency: detectedCurrency }));
    } catch {}
  }
);

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setCurrency: (state, action: PayloadAction<CurrencyType>) => {
      state.currency = action.payload;
      state.currencySymbol = action.payload === 'INR' ? '₹' : '$';
    },
    setAutoDetectCurrency: (state, action: PayloadAction<boolean>) => {
      state.autoDetectCurrency = action.payload;
      if (action.payload) {
        state.currency = state.detectedCurrency;
        state.currencySymbol = state.detectedCurrency === 'INR' ? '₹' : '$';
      }
    },
    setDetectedCountry: (state, action: PayloadAction<{ country: string; currency: CurrencyType }>) => {
      state.detectedCountry = action.payload.country;
      state.detectedCurrency = action.payload.currency;
      if (state.autoDetectCurrency) {
        state.currency = action.payload.currency;
        state.currencySymbol = action.payload.currency === 'INR' ? '₹' : '$';
      }
    },
  },
});

export const { setCurrency, setAutoDetectCurrency, setDetectedCountry } = preferencesSlice.actions;
export default preferencesSlice.reducer;
