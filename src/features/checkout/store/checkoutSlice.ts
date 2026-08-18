/**
 * Checkout Slice — AppsyShop
 * Manages delivery addresses, payment methods, and order placement.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CheckoutState, DeliveryAddress, PaymentMethod, PlacedOrder } from '../types';

const INITIAL_ADDRESSES: DeliveryAddress[] = [
  {
    id: 'addr-1',
    title: 'Home (Manhattan)',
    recipientName: 'Alex Mercer',
    street: '350 5th Ave',
    apartment: 'Apt 14B',
    city: 'New York',
    state: 'NY',
    zipCode: '10118',
    phone: '+1 (555) 234-5678',
    deliveryNotes: 'Call upon arrival, leave with 24/7 doorman',
    isDefault: true,
    isFlashDropEligible: true,
  },
  {
    id: 'addr-2',
    title: 'Work / Studio',
    recipientName: 'Alex Mercer',
    street: '55 Water St',
    apartment: 'Floor 8',
    city: 'Brooklyn',
    state: 'NY',
    zipCode: '11201',
    phone: '+1 (555) 234-5678',
    deliveryNotes: 'Front desk reception drop',
    isDefault: false,
    isFlashDropEligible: true,
  },
];

const INITIAL_PAYMENTS: PaymentMethod[] = [
  {
    id: 'pay-1',
    type: 'apple_pay',
    title: 'Apple Pay',
    isDefault: true,
  },
  {
    id: 'pay-2',
    type: 'card',
    title: 'Visa ending in 4092',
    cardLast4: '4092',
    cardBrand: 'visa',
    expiryDate: '08/28',
    isDefault: false,
  },
  {
    id: 'pay-3',
    type: 'card',
    title: 'Mastercard ending in 8831',
    cardLast4: '8831',
    cardBrand: 'mastercard',
    expiryDate: '11/27',
    isDefault: false,
  },
];

const initialState: CheckoutState = {
  addresses: INITIAL_ADDRESSES,
  selectedAddressId: 'addr-1',
  paymentMethods: INITIAL_PAYMENTS,
  selectedPaymentId: 'pay-1',
  isPlacingOrder: false,
  lastPlacedOrder: null,
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    addAddress: (state, action: PayloadAction<Omit<DeliveryAddress, 'id'>>) => {
      const newId = `addr-${Date.now()}`;
      const newAddress: DeliveryAddress = {
        ...action.payload,
        id: newId,
      };
      if (newAddress.isDefault) {
        state.addresses.forEach(a => {
          a.isDefault = false;
        });
      }
      state.addresses.push(newAddress);
      state.selectedAddressId = newId;
    },

    selectAddress: (state, action: PayloadAction<string>) => {
      state.selectedAddressId = action.payload;
    },

    deleteAddress: (state, action: PayloadAction<string>) => {
      state.addresses = state.addresses.filter(a => a.id !== action.payload);
      if (state.selectedAddressId === action.payload && state.addresses.length > 0) {
        state.selectedAddressId = state.addresses[0].id;
      }
    },

    addPaymentMethod: (state, action: PayloadAction<Omit<PaymentMethod, 'id'>>) => {
      const newId = `pay-${Date.now()}`;
      const newPayment: PaymentMethod = {
        ...action.payload,
        id: newId,
      };
      if (newPayment.isDefault) {
        state.paymentMethods.forEach(p => {
          p.isDefault = false;
        });
      }
      state.paymentMethods.push(newPayment);
      state.selectedPaymentId = newId;
    },

    selectPaymentMethod: (state, action: PayloadAction<string>) => {
      state.selectedPaymentId = action.payload;
    },

    setPlacingOrder: (state, action: PayloadAction<boolean>) => {
      state.isPlacingOrder = action.payload;
    },

    setLastPlacedOrder: (state, action: PayloadAction<PlacedOrder>) => {
      state.lastPlacedOrder = action.payload;
    },
  },
});

export const {
  addAddress,
  selectAddress,
  deleteAddress,
  addPaymentMethod,
  selectPaymentMethod,
  setPlacingOrder,
  setLastPlacedOrder,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
