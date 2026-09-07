import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product, ProductCategory, ProductFilters, ProductsState } from '../types';
import productService from '../services/productService';
import locationService from '@shared/services/locationService';

export const DEFAULT_FILTERS: ProductFilters = {
  sortBy: 'featured',
  selectedBrands: [],
  priceRange: 'all',
  selectedSizes: [],
  onlyHotDrops: false,
  onlyInStock: false,
  onlyDiscounted: false,
};

export const fetchProducts = createAsyncThunk<Product[]>(
  'products/fetchProducts',
  async () => {
    const products = await productService.fetchLiveProducts();
    return products;
  },
);

export const fetchUserLocation = createAsyncThunk<string>(
  'products/fetchUserLocation',
  async () => {
    const locationData = await locationService.getCurrentLocation();
    return locationData.formattedLocation;
  },
);

const initialState: ProductsState = {
  items: [],
  selectedCategory: 'All',
  searchQuery: '',
  favorites: ['snk-1'],
  filters: DEFAULT_FILTERS,
  location: locationService.getLastSavedLocation(),
  isLocationLoading: false,
  isLoading: true, 
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<ProductCategory>) => {
      state.selectedCategory = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setLocation: (state, action: PayloadAction<string>) => {
      state.location = action.payload;
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      const index = state.favorites.indexOf(productId);
      if (index >= 0) {
        state.favorites.splice(index, 1);
      } else {
        state.favorites.push(productId);
      }
    },
    setFilters: (state, action: PayloadAction<ProductFilters>) => {
      state.filters = action.payload;
    },
    resetFilters: state => {
      state.filters = DEFAULT_FILTERS;
    },
  },
  extraReducers: builder => {
    
    builder
      .addCase(fetchProducts.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch products';
      });

    builder
      .addCase(fetchUserLocation.pending, state => {
        state.isLocationLoading = true;
      })
      .addCase(fetchUserLocation.fulfilled, (state, action) => {
        state.isLocationLoading = false;
        state.location = action.payload;
      })
      .addCase(fetchUserLocation.rejected, state => {
        state.isLocationLoading = false;
        state.location = locationService.getLastSavedLocation();
      });
  },
});

export const {
  setSelectedCategory,
  setSearchQuery,
  setLocation,
  toggleFavorite,
  setFilters,
  resetFilters,
} = productsSlice.actions;

export default productsSlice.reducer;
