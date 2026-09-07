export interface DeliveryAddress {
  id: string;
  title: string; 
  recipientName: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  deliveryNotes?: string;
  isDefault: boolean;
  isFlashDropEligible: boolean; 
}

export type PaymentMethodType = 'razorpay' | 'apple_pay' | 'google_pay' | 'card' | 'cash';

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  title: string;
  cardLast4?: string;
  cardBrand?: 'visa' | 'mastercard' | 'amex';
  expiryDate?: string;
  isDefault: boolean;
}

export interface RazorpayPaymentSuccess {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  method: 'upi' | 'card' | 'netbanking' | 'wallet';
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
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
}

export interface CheckoutState {
  addresses: DeliveryAddress[];
  selectedAddressId: string;
  paymentMethods: PaymentMethod[];
  selectedPaymentId: string;
  isPlacingOrder: boolean;
  lastPlacedOrder: PlacedOrder | null;
}
