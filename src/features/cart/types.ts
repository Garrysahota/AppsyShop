import { Product } from '@features/products/types';

export interface CartItem {
  product: Product;
  selectedSize: number;
  selectedColor?: string;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  appliedCoupon: string | null;
  discountPercentage: number;
  deliveryFee: number;
}
