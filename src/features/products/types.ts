export type ProductCategory =
  | 'All'
  | 'Drops'
  | 'Nike'
  | 'Jordan'
  | 'Yeezy'
  | 'Running'
  | 'Retro';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  isHotDrop?: boolean;
  isLimited?: boolean;
  stockLeft?: number;
  sizes: number[];
  colors: string[];
  description: string;
}

export type SortOption =
  | 'featured'
  | 'price_asc'
  | 'price_desc'
  | 'rating'
  | 'newest';

export type PriceRangeTier =
  | 'all'
  | 'under_150'
  | '150_250'
  | '250_350'
  | 'above_350';

export interface ProductFilters {
  sortBy: SortOption;
  selectedBrands: string[];
  priceRange: PriceRangeTier;
  selectedSizes: number[];
  onlyHotDrops: boolean;
  onlyInStock: boolean;
  onlyDiscounted: boolean;
}

export interface ProductsState {
  items: Product[];
  selectedCategory: ProductCategory;
  searchQuery: string;
  favorites: string[]; 
  filters: ProductFilters;
  location: string;
  isLocationLoading: boolean;
  isLoading: boolean;
  error: string | null;
}
