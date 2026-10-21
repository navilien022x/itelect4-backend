import { Router } from 'express'
import type { RequestHandler } from 'express'
import { FoodItemModel } from '../models/FoodItem'
import type { FoodItemRecord } from '../models/FoodItem'
import type { ApiFoodItem } from '../types'

const router = Router()

function serializeFoodItem(
  foodItem: FoodItemRecord & { _id: { toString(): string } },
): ApiFoodItem {
  return {
    id: foodItem._id.toString(),
    name: foodItem.name,
    description: foodItem.description,
    price: foodItem.price,
    category: foodItem.category,
    available: foodItem.available,
  }
}

const listFoodItems: RequestHandler = async (_req, res) => {
  const foodItems = await FoodItemModel.find().sort({ category: 1, name: 1 })
  res.json(foodItems.map(serializeFoodItem))
}

const getFoodItem: RequestHandler = async (req, res) => {
  const foodItem = await FoodItemModel.findById(req.params.id)
  if (!foodItem) {
    res.status(404).json({ message: 'Food item not found.' })
    return
  }
  res.json(serializeFoodItem(foodItem))
}

router.get('/', listFoodItems)
router.get('/:id', getFoodItem)

export default router
