export interface User {
  id: string
  name: string
  email: string
  role: 'student' | 'vendor_admin'
  isActive: boolean
}

export interface FoodItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  available: boolean
}

export interface Order {
  id: string
  userId: string
  foodItemIds: string[]
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

export type ApiUser = User
export type ApiFoodItem = FoodItem
export type ApiOrder = Omit<Order, 'createdAt'> & { createdAt: string }

export type AiReply = {
  summary: string
  recommendations: {
    name: string
    description: string
    category: 'quick' | 'balanced' | 'comfort'
  }[]
  tips: string[]
}
