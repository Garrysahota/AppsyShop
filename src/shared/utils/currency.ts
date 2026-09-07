import { store } from '../../store/store';

export const USD_TO_INR_RATE = 84;

export const formatINR = (usdPrice: number): string => {
  let currency = 'INR';
  try {
    const state = store.getState();
    currency = state.preferences?.currency || 'INR';
  } catch {}

  if (currency === 'INR') {
    const inr = Math.round(usdPrice * USD_TO_INR_RATE);
    return `₹${inr.toLocaleString('en-IN')}`;
  } else {
    // USD standard formats: e.g. $380
    return `$${usdPrice.toLocaleString()}`;
  }
};

export const formatDualPrice = (usdPrice: number): string => {
  return formatINR(usdPrice);
};

export const formatShoeSize = (size: number): string => {
  return `UK ${size}`;
};
