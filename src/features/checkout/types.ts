/**
 * Checkout Types — AppsyShop
 */

export interface DeliveryAddress {
  id: string;
  title: string; // e.g. "Home", "Office", "Studio"
  recipientName: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  deliveryNotes?: string;
  isDefault: boolean;
  isFlashDropEligible: boolean; // 10-min drop zone
}

export type PaymentMethodType = 'apple_pay' | 'google_pay' | 'card' | 'cash';

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  title: string;
  cardLast4?: string;
  cardBrand?: 'visa' | 'mastercard' | 'amex';
  expiryDate?: string;
  isDefault: boolean;
}

export interface PlacedOrder {
  orderId: string;
  placedAt: string;
  deliveryAddress: DeliveryAddress;
  paymentMethod: PaymentMethod;
  itemsCount: number;
  totalAmount: number;
  estimatedMinutes: number;
  status: 'confirmed' | 'packed' | 'in_transit' | 'delivered';
}

export interface CheckoutState {
  addresses: DeliveryAddress[];
  selectedAddressId: string;
  paymentMethods: PaymentMethod[];
  selectedPaymentId: string;
  isPlacingOrder: boolean;
  lastPlacedOrder: PlacedOrder | null;
}
