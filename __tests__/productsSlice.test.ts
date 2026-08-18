import productsReducer, {
  setSelectedCategory,
  setSearchQuery,
  toggleFavorite,
  setFilters,
  resetFilters,
  DEFAULT_FILTERS,
} from '../src/features/products/store/productsSlice';
import { ProductsState } from '../src/features/products/types';

describe('productsSlice', () => {
  const initialTestState: ProductsState = {
    items: [],
    selectedCategory: 'All',
    searchQuery: '',
    favorites: ['snk-1'],
    filters: DEFAULT_FILTERS,
    isLoading: false,
    error: null,
  };

  it('should change selected category', () => {
    const newState = productsReducer(initialTestState, setSelectedCategory('Drops'));
    expect(newState.selectedCategory).toBe('Drops');
  });

  it('should toggle favorite product', () => {
    // Remove existing favorite
    const stateAfterRemove = productsReducer(initialTestState, toggleFavorite('snk-1'));
    expect(stateAfterRemove.favorites).not.toContain('snk-1');

    // Add new favorite
    const stateAfterAdd = productsReducer(stateAfterRemove, toggleFavorite('snk-2'));
    expect(stateAfterAdd.favorites).toContain('snk-2');
  });

  it('should apply custom filters', () => {
    const customFilters = {
      ...DEFAULT_FILTERS,
      selectedBrands: ['Jordan', 'Nike'],
      priceRange: '150_250' as const,
      sortBy: 'price_asc' as const,
    };

    const newState = productsReducer(initialTestState, setFilters(customFilters));
    expect(newState.filters.selectedBrands).toEqual(['Jordan', 'Nike']);
    expect(newState.filters.priceRange).toBe('150_250');
    expect(newState.filters.sortBy).toBe('price_asc');
  });

  it('should reset filters to default', () => {
    const modifiedState: ProductsState = {
      ...initialTestState,
      filters: {
        ...DEFAULT_FILTERS,
        selectedBrands: ['Yeezy'],
        onlyHotDrops: true,
      },
    };

    const newState = productsReducer(modifiedState, resetFilters());
    expect(newState.filters).toEqual(DEFAULT_FILTERS);
  });
});
