export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  discountedPrice?: number;
  images: string[];
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  tags: string[];
  features?: string[];
  specifications?: Record<string, any>;
  rating: number;
  reviewCount: number;
  stock: number; // This might be called 'stock' instead of 'inventory'
  isFeatured: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  // Optional fields with defaults
  sku?: string;
  lowStockThreshold?: number;
  type?: string;
  status?: string;
  metadata?: Record<string, any>;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

// For the ProductCard component, we need to map fields
export interface ProductCardProps {
  product: Product;
}

// Helper function to normalize product data for display
export const normalizeProduct = (product: any): Product => {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    shortDescription: product.shortDescription,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    discountedPrice: product.discountedPrice,
    images: product.images || [],
    categoryId: product.categoryId,
    category: product.category,
    tags: product.tags || [],
    features: product.features || [],
    specifications: product.specifications || {},
    rating: product.rating || 0,
    reviewCount: product.reviewCount || 0,
    stock: product.stock || 0,
    isFeatured: product.isFeatured || false,
    isActive: product.isActive,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    // Default values for optional fields
    sku: product.sku || `SKU-${product.id}`,
    lowStockThreshold: product.lowStockThreshold || 5,
    type: product.type || 'PRODUCT',
    status: product.status || 'ACTIVE',
    metadata: product.metadata || {},
    seoTitle: product.seoTitle,
    seoDescription: product.seoDescription,
    seoKeywords: product.seoKeywords || [],
  };
};

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
}