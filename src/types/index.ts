export interface User {
  id: number
  name: string
  email: string
  role: 'student' | 'vendor_admin'
  isActive: boolean
}

export interface FoodItem {
  id: number
  name: string
  description: string
  price: number
  category: string
  available: boolean
}

export interface Order {
  id: number
  userId: number
  foodItemIds: number[]
  totalAmount: number
  status: OrderStatus
  createdAt: Date
  notes?: string
}

export type OrderStatus = 0 | 1 | 2

export const OrderStatus = {
  Placed: 0,
  Preparing: 1,
  ReadyForPickup: 2,
} as const

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export type ApiUser = Omit<User, 'id'> & { id: string }
export type ApiOrder = Omit<Order, 'id' | 'userId' | 'foodItemIds' | 'createdAt'> & {
  id: string
  userId: string
  foodItemIds: string[]
  createdAt: string
}
