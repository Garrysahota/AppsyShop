import { Product, ProductCategory } from '../types';

const FREE_API_ENDPOINTS = [
  'https://dummyjson.com/products/category/mens-shoes',
  'https://dummyjson.com/products/category/womens-shoes',
];

const CURATED_FLAGSHIP_DROPS: Product[] = [
  {
    id: 'snk-1',
    name: 'Travis Scott x Air Jordan 1 Low OG "Mocha"',
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
];

class ProductService {
  
  async fetchLiveProducts(): Promise<Product[]> {
    try {
      const fetchPromises = FREE_API_ENDPOINTS.map(url =>
        fetch(url, { headers: { Accept: 'application/json' } })
          .then(res => (res.ok ? res.json() : { products: [] }))
          .catch(() => ({ products: [] })),
      );

      const results = await Promise.all(fetchPromises);
      const rawApiProducts = results.flatMap(r => r.products || []);

      if (rawApiProducts.length === 0) {
        return CURATED_FLAGSHIP_DROPS;
      }

      const normalizedApiProducts: Product[] = rawApiProducts.map((item: any, index: number) => {
        
        let category: ProductCategory = 'Running';
        const titleLower = (item.title || '').toLowerCase();
        if (titleLower.includes('nike') || titleLower.includes('dunk') || titleLower.includes('air force')) {
          category = 'Nike';
        } else if (titleLower.includes('jordan')) {
          category = 'Jordan';
        } else if (titleLower.includes('yeezy') || titleLower.includes('boost')) {
          category = 'Yeezy';
        } else if (titleLower.includes('retro') || titleLower.includes('classic') || titleLower.includes('samba')) {
          category = 'Retro';
        } else if (index % 3 === 0) {
          category = 'Drops';
        }

        const brand =
          item.brand ||
          (category === 'Nike'
            ? 'Nike'
            : category === 'Jordan'
            ? 'Jordan'
            : category === 'Yeezy'
            ? 'Yeezy'
            : 'Puma');

        const originalPrice = item.price ? Math.round(item.price * 1.25) : 150;
        const discountPercentage = item.discountPercentage
          ? Math.round(item.discountPercentage)
          : Math.round(((originalPrice - item.price) / originalPrice) * 100);

        const fallbackImages = [
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=600&q=80',
        ];

        return {
          id: `api-prod-${item.id}`,
          name: item.title,
          brand,
          category,
          price: item.price || 120,
          originalPrice,
          discountPercentage,
          rating: Number(item.rating?.toFixed(1)) || 4.7,
          reviewsCount: (item.reviews?.length || 0) * 45 + 120 + (item.id % 200),
          imageUrl: item.thumbnail || item.images?.[0] || fallbackImages[index % fallbackImages.length],
          isHotDrop: index % 2 === 0,
          isLimited: item.stock < 10,
          stockLeft: item.stock || 8,
          sizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
          colors: ['#24143D', '#FFFFFF', '#09090B'],
          description: item.description || 'Premium street-ready footwear engineered for style and impact support.',
        };
      });

      return [...CURATED_FLAGSHIP_DROPS, ...normalizedApiProducts];
    } catch (error) {
      console.warn('[ProductService] Live API fetch fallback to curated catalog:', error);
      return CURATED_FLAGSHIP_DROPS;
    }
  }
}

export const productService = new ProductService();
export default productService;
