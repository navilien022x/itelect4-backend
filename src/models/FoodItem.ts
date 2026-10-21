import { model, Schema } from 'mongoose'

export interface FoodItemRecord {
  name: string
  description: string
  price: number
  category: string
  available: boolean
}

const foodItemSchema = new Schema<FoodItemRecord>(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    description: { type: String, required: true, trim: true, maxlength: 500 },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true, maxlength: 80 },
    available: { type: Boolean, default: true, required: true },
  },
  { timestamps: true },
)

export const FoodItemModel = model<FoodItemRecord>('FoodItem', foodItemSchema)
