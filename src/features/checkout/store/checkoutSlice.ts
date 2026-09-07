import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CheckoutState, DeliveryAddress, PaymentMethod, PlacedOrder } from '../types';

export const RAZORPAY_PAYMENT_METHOD: PaymentMethod = {
  id: 'pay-razorpay',
  type: 'razorpay',
  title: 'Razorpay (UPI / Cards / Netbanking)',
  isDefault: true,
};

const INITIAL_ADDRESSES: DeliveryAddress[] = [
  {
    id: 'addr-1',
    title: 'Home (Bandra West)',
    recipientName: 'Alex Mercer',
    street: 'Flat 402, Sea Breeze Apts, Hill Road',
    apartment: 'Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    zipCode: '400050',
    phone: '+91 98765 43210',
    deliveryNotes: 'Leave with 24/7 security guard at gate',
    isDefault: true,
    isFlashDropEligible: true,
  },
  {
    id: 'addr-2',
    title: 'Work / Studio (Indiranagar)',
    recipientName: 'Alex Mercer',
    street: '100ft Road, 4th Cross',
    apartment: 'Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    zipCode: '560038',
    phone: '+91 98765 43210',
    deliveryNotes: 'Reception floor 3 drop',
    isDefault: false,
    isFlashDropEligible: true,
  },
];

const INITIAL_PAYMENTS: PaymentMethod[] = [
  RAZORPAY_PAYMENT_METHOD,
  {
    id: 'pay-1',
    type: 'apple_pay',
    title: 'Apple Pay',
    isDefault: false,
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
  selectedPaymentId: 'pay-razorpay',
  isPlacingOrder: false,
  lastPlacedOrder: null,
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    ensureRazorpayMethod: state => {
      const exists = state.paymentMethods?.some(
        p => p.type === 'razorpay' || p.id === 'pay-razorpay',
      );
      if (!exists) {
        state.paymentMethods = [RAZORPAY_PAYMENT_METHOD, ...(state.paymentMethods || [])];
        state.selectedPaymentId = 'pay-razorpay';
      }
    },

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
  extraReducers: builder => {
    builder.addCase('persist/REHYDRATE', (state, action: any) => {
      const persisted = action?.payload?.checkout;
      if (persisted) {
        const methods = persisted.paymentMethods || [];
        const hasRazorpay = methods.some(
          (p: PaymentMethod) => p.type === 'razorpay' || p.id === 'pay-razorpay',
        );

        if (!hasRazorpay) {
          state.paymentMethods = [RAZORPAY_PAYMENT_METHOD, ...methods];
          state.selectedPaymentId = 'pay-razorpay';
        } else {
          state.paymentMethods = methods;
          state.selectedPaymentId = persisted.selectedPaymentId || 'pay-razorpay';
        }

        state.addresses =
          persisted.addresses?.length > 0 ? persisted.addresses : INITIAL_ADDRESSES;
        state.selectedAddressId = persisted.selectedAddressId || 'addr-1';
        state.isPlacingOrder = false;
        state.lastPlacedOrder = persisted.lastPlacedOrder || null;
      }
    });
  },
});

export const {
  ensureRazorpayMethod,
  addAddress,
  selectAddress,
  deleteAddress,
  addPaymentMethod,
  selectPaymentMethod,
  setPlacingOrder,
  setLastPlacedOrder,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
