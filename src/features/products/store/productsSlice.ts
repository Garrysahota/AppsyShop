/**
 * Products Slice — AppsyShop
 * Curated sneaker catalog, category filtering, search, and favorites management.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product, ProductCategory, ProductFilters, ProductsState } from '../types';

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'snk-1',
    name: 'Travis Scott x Air Jordan 1 Low OG',
    brand: 'Jordan',
    category: 'Drops',
    price: 380,
    originalPrice: 480,
    discountPercentage: 21,
    rating: 4.9,
    reviewsCount: 1248,
    imageUrl:
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=80',
    isHotDrop: true,
    isLimited: true,
    stockLeft: 2,
    sizes: [7, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    colors: ['#24143D', '#A3E635', '#FFFFFF'],
    description:
      'Reverse mocha aesthetic featuring inverted oversized Swoosh, premium nubuck overlays and Cactus Jack embroidery.',
  },
  {
    id: 'snk-2',
    name: 'Nike Dunk Low "Panda Retro"',
    brand: 'Nike',
    category: 'Nike',
    price: 115,
    originalPrice: 130,
    discountPercentage: 12,
    rating: 4.8,
    reviewsCount: 3820,
    imageUrl:
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80',
    isHotDrop: true,
    stockLeft: 7,
    sizes: [6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 11],
    colors: ['#000000', '#FFFFFF'],
    description:
      'Clean monochrome leather construction designed for everyday street flexing with all-day comfort cushioning.',
  },
  {
    id: 'snk-3',
    name: 'Air Jordan 4 Retro "Military Black"',
    brand: 'Jordan',
    category: 'Jordan',
    price: 210,
    originalPrice: 240,
    discountPercentage: 13,
    rating: 4.9,
    reviewsCount: 890,
    imageUrl:
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=600&q=80',
    isLimited: true,
    stockLeft: 4,
    sizes: [8, 8.5, 9, 9.5, 10, 10.5, 11],
    colors: ['#E2E8F0', '#1E293B'],
    description:
      'Classic 1989 silhouette equipped with mesh quarter panels, molded eyelets and visible Air-Sole unit.',
  },
  {
    id: 'snk-4',
    name: 'Yeezy Boost 350 V2 "Onyx"',
    brand: 'Yeezy',
    category: 'Yeezy',
    price: 230,
    originalPrice: 260,
    discountPercentage: 12,
    rating: 4.7,
    reviewsCount: 1540,
    imageUrl:
      'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=600&q=80',
    isHotDrop: false,
    stockLeft: 9,
    sizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 11, 12],
    colors: ['#18181B'],
    description:
      'Engineered Primeknit upper matched with full-length encapsulated Boost midsole for cloud-like bounce.',
  },
  {
    id: 'snk-5',
    name: 'New Balance 9060 "Sea Salt"',
    brand: 'New Balance',
    category: 'Running',
    price: 150,
    originalPrice: 175,
    discountPercentage: 14,
    rating: 4.8,
    reviewsCount: 620,
    imageUrl:
      'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&q=80',
    isHotDrop: false,
    stockLeft: 12,
    sizes: [7, 8, 8.5, 9, 9.5, 10, 10.5, 11],
    colors: ['#F1F5F9', '#CBD5E1'],
    description:
      'Futuristic chunky sole geometry with dual-density ABZORB and SBS cushioning technology.',
  },
  {
    id: 'snk-6',
    name: 'Adidas Samba OG "Core Black"',
    brand: 'Adidas',
    category: 'Retro',
    price: 100,
    originalPrice: 120,
    discountPercentage: 17,
    rating: 4.6,
    reviewsCount: 2900,
    imageUrl:
      'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=600&q=80',
    isHotDrop: true,
    stockLeft: 5,
    sizes: [6, 7, 8, 9, 10, 11],
    colors: ['#09090B', '#F4F4F5', '#A16207'],
    description:
      'Timeless terrace culture icon with soft leather upper, suede T-toe overlay and gum rubber outsole.',
  },
  {
    id: 'snk-7',
    name: 'ASICS GEL-Kayano 14 "Silver Metallic"',
    brand: 'ASICS',
    category: 'Running',
    price: 160,
    rating: 4.9,
    reviewsCount: 410,
    imageUrl:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    isHotDrop: false,
    stockLeft: 8,
    sizes: [7.5, 8, 8.5, 9, 9.5, 10, 10.5],
    colors: ['#E2E8F0', '#3B82F6'],
    description:
      'Y2K aesthetic runner with signature GEL technology cushioning and TRUSSTIC support system.',
  },
  {
    id: 'snk-8',
    name: 'Nike Air Max Plus "Sunset Pulse"',
    brand: 'Nike',
    category: 'Drops',
    price: 190,
    originalPrice: 220,
    discountPercentage: 14,
    rating: 4.8,
    reviewsCount: 780,
    imageUrl:
      'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=600&q=80',
    isHotDrop: true,
    isLimited: true,
    stockLeft: 3,
    sizes: [8, 8.5, 9, 9.5, 10, 11],
    colors: ['#7C3AED', '#EC4899', '#F59E0B'],
    description:
      'Prominent arch inspired by a whale tail, gradient palm tree TPU cage and Tuned Air units.',
  },
];

export const DEFAULT_FILTERS: ProductFilters = {
  sortBy: 'featured',
  selectedBrands: [],
  priceRange: 'all',
  selectedSizes: [],
  onlyHotDrops: false,
  onlyInStock: false,
  onlyDiscounted: false,
};

const initialState: ProductsState = {
  items: INITIAL_PRODUCTS,
  selectedCategory: 'All',
  searchQuery: '',
  favorites: ['snk-1'],
  filters: DEFAULT_FILTERS,
  isLoading: false,
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
});

export const {
  setSelectedCategory,
  setSearchQuery,
  toggleFavorite,
  setFilters,
  resetFilters,
} = productsSlice.actions;
export default productsSlice.reducer;
