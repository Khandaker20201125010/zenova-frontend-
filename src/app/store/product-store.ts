// store/product-store.ts
import { create } from "zustand"
import { Product } from "../lib/types"

interface ProductStore {
  // State
  products: Product[]
  featuredProducts: Product[]
  recentProducts: Product[]
  favorites: Product[]
  viewedProducts: Product[]
  selectedProduct: Product | null
  
  // Actions
  setProducts: (products: Product[]) => void
  setFeaturedProducts: (products: Product[]) => void
  setRecentProducts: (products: Product[]) => void
  setFavorites: (products: Product[]) => void
  addToFavorites: (product: Product) => void
  removeFromFavorites: (productId: string) => void
  addToViewed: (product: Product) => void
  setSelectedProduct: (product: Product | null) => void
  clearViewed: () => void
  clearFavorites: () => void
  
  // Computed
  isFavorite: (productId: string) => boolean
  getProduct: (productId: string) => Product | undefined
  getRelatedProducts: (productId: string, limit?: number) => Product[]
  getProductsByCategory: (categoryId: string) => Product[]
  getProductsByTag: (tag: string) => Product[]
}

export const useProductStore = create<ProductStore>((set, get) => ({
  // Initial state
  products: [],
  featuredProducts: [],
  recentProducts: [],
  favorites: [],
  viewedProducts: [],
  selectedProduct: null,
  
  // Actions
  setProducts: (products) => {
    set({ products })
  },
  
  setFeaturedProducts: (products) => {
    set({ featuredProducts: products })
  },
  
  setRecentProducts: (products) => {
    set({ recentProducts: products })
  },
  
  setFavorites: (products) => {
    set({ favorites: products })
  },
  
  addToFavorites: (product) => {
    set((state) => {
      if (state.favorites.some((p) => p.id === product.id)) {
        return state
      }
      return { favorites: [...state.favorites, product] }
    })
  },
  
  removeFromFavorites: (productId) => {
    set((state) => ({
      favorites: state.favorites.filter((p) => p.id !== productId),
    }))
  },
  
  addToViewed: (product) => {
    set((state) => {
      // Remove if already in list
      const filtered = state.viewedProducts.filter((p) => p.id !== product.id)
      // Add to beginning
      return { viewedProducts: [product, ...filtered].slice(0, 20) }
    })
  },
  
  setSelectedProduct: (product) => {
    set({ selectedProduct: product })
  },
  
  clearViewed: () => {
    set({ viewedProducts: [] })
  },
  
  clearFavorites: () => {
    set({ favorites: [] })
  },
  
  // Computed
  isFavorite: (productId) => {
    return get().favorites.some((p) => p.id === productId)
  },
  
  getProduct: (productId) => {
    return get().products.find((p) => p.id === productId)
  },
  
  getRelatedProducts: (productId, limit = 4) => {
    const product = get().getProduct(productId)
    if (!product) return []
    
    // Match by categoryId instead of category string
    const categoryId = product.categoryId
    
    return get().products
      .filter((p) => p.id !== productId && p.categoryId === categoryId)
      .slice(0, limit)
  },
  
  getProductsByCategory: (categoryId) => {
    // Now filtering by categoryId instead of category string
    return get().products.filter((p) => p.categoryId === categoryId)
  },
  
  getProductsByTag: (tag) => {
    return get().products.filter((p) => p.tags?.includes(tag) || false)
  },
}))