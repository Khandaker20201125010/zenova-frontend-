// store/cart-store.ts
import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image: string
  sku?: string
  variant?: string
  maxQuantity?: number
}

interface CartStore {
  // State
  items: CartItem[]
  isOpen: boolean
  
  // Actions
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  
  // Computed
  getTotal: () => number
  getSubtotal: () => number
  getTax: () => number
  getShipping: () => number
  getDiscount: () => number
  getItemCount: () => number
  getItem: (id: string) => CartItem | undefined
  isInCart: (productId: string) => boolean
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      isOpen: false,
      
      // Actions
      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id)
          
          if (existingItem) {
            // Update quantity if item already exists
            const newQuantity = existingItem.quantity + item.quantity
            const maxQuantity = existingItem.maxQuantity || 10
            
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: Math.min(newQuantity, maxQuantity) }
                  : i
              ),
            }
          }
          
          // Add new item
          return { items: [...state.items, item] }
        })
      },
      
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }))
      },
      
      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        }))
      },
      
      clearCart: () => {
        set({ items: [] })
      },
      
      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }))
      },
      
      openCart: () => {
        set({ isOpen: true })
      },
      
      closeCart: () => {
        set({ isOpen: false })
      },
      
      // Computed
      getTotal: () => {
        const cart = get()
        return cart.getSubtotal() + cart.getTax() + cart.getShipping() - cart.getDiscount()
      },
      
      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },
      
      getTax: () => {
        const subtotal = get().getSubtotal()
        return subtotal * 0.08 // 8% tax
      },
      
      getShipping: () => {
        const subtotal = get().getSubtotal()
        return subtotal > 50 ? 0 : 5.99 // Free shipping over $50
      },
      
      getDiscount: () => {
        const subtotal = get().getSubtotal()
        // Apply 10% discount if subtotal > $100
        return subtotal > 100 ? subtotal * 0.1 : 0
      },
      
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },
      
      getItem: (id) => {
        return get().items.find((item) => item.id === id)
      },
      
      isInCart: (productId) => {
        return get().items.some((item) => item.productId === productId)
      },
    }),
    {
      name: "cart-storage",
      // Custom storage to handle Next.js SSR
      storage: {
        getItem: (name) => {
          if (typeof window === "undefined") return null
          const item = localStorage.getItem(name)
          return item ? JSON.parse(item) : null
        },
        setItem: (name, value) => {
          if (typeof window === "undefined") return
          localStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: (name) => {
          if (typeof window === "undefined") return
          localStorage.removeItem(name)
        },
      },
    }
  )
)