import checkoutReducer, {
  addAddress,
  selectAddress,
  deleteAddress,
  addPaymentMethod,
  selectPaymentMethod,
  setLastPlacedOrder,
} from '../src/features/checkout/store/checkoutSlice';
import { CheckoutState } from '../src/features/checkout/types';

describe('checkoutSlice', () => {
  const initialTestState: CheckoutState = {
    addresses: [
      {
        id: 'addr-1',
        title: 'Home',
        recipientName: 'Alex Mercer',
        street: '350 5th Ave',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        phone: '+1 (555) 000-0000',
        isDefault: true,
        isFlashDropEligible: true,
      },
    ],
    selectedAddressId: 'addr-1',
    paymentMethods: [
      {
        id: 'pay-1',
        type: 'apple_pay',
        title: 'Apple Pay',
        isDefault: true,
      },
    ],
    selectedPaymentId: 'pay-1',
    isPlacingOrder: false,
    lastPlacedOrder: null,
  };

  it('should add a new address and select it', () => {
    const newState = checkoutReducer(
      initialTestState,
      addAddress({
        title: 'Office',
        recipientName: 'Alex Mercer',
        street: '55 Water St',
        city: 'Brooklyn',
        state: 'NY',
        zipCode: '11201',
        phone: '+1 (555) 000-0000',
        isDefault: false,
        isFlashDropEligible: true,
      }),
    );

    expect(newState.addresses.length).toBe(2);
    expect(newState.addresses[1].title).toBe('Office');
    expect(newState.selectedAddressId).toBe(newState.addresses[1].id);
  });

  it('should select an existing address', () => {
    const stateWithTwo = {
      ...initialTestState,
      addresses: [
        ...initialTestState.addresses,
        {
          id: 'addr-2',
          title: 'Office',
          recipientName: 'Alex Mercer',
          street: '55 Water St',
          city: 'Brooklyn',
          state: 'NY',
          zipCode: '11201',
          phone: '+1 (555) 000-0000',
          isDefault: false,
          isFlashDropEligible: true,
        },
      ],
    };

    const newState = checkoutReducer(stateWithTwo, selectAddress('addr-2'));
    expect(newState.selectedAddressId).toBe('addr-2');
  });

  it('should add a new payment method', () => {
    const newState = checkoutReducer(
      initialTestState,
      addPaymentMethod({
        type: 'card',
        title: 'Visa ending in 1234',
        cardLast4: '1234',
        cardBrand: 'visa',
        isDefault: false,
      }),
    );

    expect(newState.paymentMethods.length).toBe(2);
    expect(newState.paymentMethods[1].cardLast4).toBe('1234');
    expect(newState.selectedPaymentId).toBe(newState.paymentMethods[1].id);
  });

  it('should set last placed order', () => {
    const orderData = {
      orderId: '#SNK-9999',
      placedAt: '2026-08-18T20:00:00Z',
      deliveryAddress: initialTestState.addresses[0],
      paymentMethod: initialTestState.paymentMethods[0],
      itemsCount: 1,
      totalAmount: 380,
      estimatedMinutes: 8,
      status: 'confirmed' as const,
    };

    const newState = checkoutReducer(initialTestState, setLastPlacedOrder(orderData));
    expect(newState.lastPlacedOrder).toEqual(orderData);
  });
});
