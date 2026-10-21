import 'dotenv/config'
import mongoose from 'mongoose'
import { FoodItemModel } from './models/FoodItem'

const foodItems = [
  {
    _id: '665000000000000000000001',
    name: 'Chicken Rice Meal',
    description: 'Grilled chicken with rice and vegetables',
    price: 85,
    category: 'Meals',
    available: true,
  },
  {
    _id: '665000000000000000000002',
    name: 'Milk Tea',
    description: 'Classic milk tea with pearls',
    price: 75,
    category: 'Drinks',
    available: true,
  },
  {
    _id: '665000000000000000000003',
    name: 'Beef Tapa',
    description: 'Cured beef served with garlic rice',
    price: 120,
    category: 'Meals',
    available: true,
  },
  {
    _id: '665000000000000000000004',
    name: 'Iced Coffee',
    description: 'Cold brewed coffee with ice',
    price: 60,
    category: 'Drinks',
    available: true,
  },
  {
    _id: '665000000000000000000005',
    name: 'Adobo Bowl',
    description: 'Traditional Filipino chicken adobo',
    price: 95,
    category: 'Meals',
    available: true,
  },
]

async function seedFoodItems(): Promise<void> {
  const mongoUri = process.env.MONGODB_URI
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not configured.')
  }

  await mongoose.connect(mongoUri)
  await FoodItemModel.bulkWrite(
    foodItems.map(({ _id, ...foodItem }) => ({
      updateOne: {
        filter: { _id },
        update: { $set: foodItem },
        upsert: true,
      },
    })),
  )
  console.log(`Seeded ${foodItems.length} food items.`)
}

seedFoodItems()
  .catch((error: unknown) => {
    console.error('Failed to seed food items:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await mongoose.disconnect()
  })
