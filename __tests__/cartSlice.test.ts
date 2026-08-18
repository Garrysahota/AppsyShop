import cartReducer, {
  addToCart,
  removeFromCart,
  updateQuantity,
  applyCoupon,
  clearCart,
} from '../src/features/cart/store/cartSlice';
import { CartState } from '../src/features/cart/types';
import { Product } from '../src/features/products/types';

describe('cartSlice', () => {
  const mockProduct: Product = {
    id: 'snk-test',
    name: 'Test Sneaker',
    brand: 'Nike',
    category: 'Nike',
    price: 150,
    rating: 4.8,
    reviewsCount: 100,
    imageUrl: 'https://example.com/test.jpg',
    sizes: [9, 10],
    colors: ['#000000'],
    description: 'Test description',
  };

  const initialState: CartState = {
    items: [],
    appliedCoupon: null,
    discountPercentage: 0,
    deliveryFee: 0,
  };

  it('should add an item to the cart', () => {
    const newState = cartReducer(
      initialState,
      addToCart({ product: mockProduct, size: 9 }),
    );

    expect(newState.items.length).toBe(1);
    expect(newState.items[0].product.id).toBe('snk-test');
    expect(newState.items[0].selectedSize).toBe(9);
    expect(newState.items[0].quantity).toBe(1);
  });

  it('should increment quantity if same item and size added', () => {
    const stateWithOneItem: CartState = {
      ...initialState,
      items: [{ product: mockProduct, selectedSize: 9, selectedColor: '#000000', quantity: 1 }],
    };

    const newState = cartReducer(
      stateWithOneItem,
      addToCart({ product: mockProduct, size: 9, color: '#000000' }),
    );

    expect(newState.items.length).toBe(1);
    expect(newState.items[0].quantity).toBe(2);
  });

  it('should update item quantity', () => {
    const stateWithOneItem: CartState = {
      ...initialState,
      items: [{ product: mockProduct, selectedSize: 9, quantity: 1 }],
    };

    const newState = cartReducer(
      stateWithOneItem,
      updateQuantity({ productId: 'snk-test', size: 9, quantity: 3 }),
    );

    expect(newState.items[0].quantity).toBe(3);
  });

  it('should remove item when quantity set to 0', () => {
    const stateWithOneItem: CartState = {
      ...initialState,
      items: [{ product: mockProduct, selectedSize: 9, quantity: 1 }],
    };

    const newState = cartReducer(
      stateWithOneItem,
      updateQuantity({ productId: 'snk-test', size: 9, quantity: 0 }),
    );

    expect(newState.items.length).toBe(0);
  });

  it('should apply valid coupon code', () => {
    const newState = cartReducer(initialState, applyCoupon('VIPDROP10'));
    expect(newState.appliedCoupon).toBe('VIPDROP10');
    expect(newState.discountPercentage).toBe(10);
  });

  it('should clear cart', () => {
    const stateWithItems: CartState = {
      items: [{ product: mockProduct, selectedSize: 9, quantity: 2 }],
      appliedCoupon: 'VIPDROP10',
      discountPercentage: 10,
      deliveryFee: 0,
    };

    const newState = cartReducer(stateWithItems, clearCart());
    expect(newState.items.length).toBe(0);
    expect(newState.appliedCoupon).toBeNull();
  });
});
