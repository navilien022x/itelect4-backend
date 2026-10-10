import { model, Schema, Types } from 'mongoose'
import type { OrderStatus } from '../types'

export interface OrderRecord {
  userId: Types.ObjectId
  foodItemIds: string[]
  totalAmount: number
  status: OrderStatus
  createdAt: Date
  notes?: string
}

const orderSchema = new Schema<OrderRecord>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    foodItemIds: {
      type: [{ type: String, trim: true, minlength: 1 }],
      required: true,
      validate: {
        validator: (ids: string[]) => ids.length > 0,
        message: 'An order must include at least one food item.',
      },
    },
    totalAmount: { type: Number, required: true, min: 0 },
    status: { type: Number, enum: [0, 1, 2], default: 0, required: true },
    notes: { type: String, trim: true, maxlength: 200 },
  },
  { timestamps: true },
)

export const OrderModel = model<OrderRecord>('Order', orderSchema)
