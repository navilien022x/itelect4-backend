import { Router } from 'express'
import type { RequestHandler } from 'express'
import { Types } from 'mongoose'
import { requireUserId } from '../middleware/auth'
import { OrderModel } from '../models/Order'
import type { OrderRecord } from '../models/Order'
import type { ApiOrder } from '../types'

const router = Router()

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isFoodItemIdArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((id: unknown) => typeof id === 'string' && id.trim().length > 0)
  )
}

function serializeOrder(order: OrderRecord & { _id: Types.ObjectId }): ApiOrder {
  return {
    id: order._id.toString(),
    userId: order.userId.toString(),
    foodItemIds: order.foodItemIds,
    totalAmount: order.totalAmount,
    status: order.status,
    createdAt: order.createdAt.toISOString(),
    ...(order.notes === undefined ? {} : { notes: order.notes }),
  }
}

const listOrders: RequestHandler = async (req, res) => {
  const orders = await OrderModel.find({ userId: requireUserId(req) }).sort({ createdAt: -1 })
  res.json(orders.map(serializeOrder))
}

const getOrder: RequestHandler = async (req, res) => {
  const order = await OrderModel.findOne({
    _id: req.params.id,
    userId: requireUserId(req),
  })
  if (!order) {
    res.status(404).json({ message: 'Order not found.' })
    return
  }
  res.json(serializeOrder(order))
}

const createOrder: RequestHandler = async (req, res) => {
  const body: unknown = req.body
  if (!isRecord(body) || !isFoodItemIdArray(body.foodItemIds) || typeof body.totalAmount !== 'number') {
    res.status(400).json({ message: 'Provide foodItemIds and totalAmount.' })
    return
  }

  if (body.notes !== undefined && typeof body.notes !== 'string') {
    res.status(400).json({ message: 'Provide valid food item IDs and optional text notes.' })
    return
  }

  const order = await OrderModel.create({
    userId: new Types.ObjectId(requireUserId(req)),
    foodItemIds: body.foodItemIds,
    totalAmount: body.totalAmount,
    notes: body.notes,
  })
  res.status(201).json(serializeOrder(order))
}

const updateOrder: RequestHandler = async (req, res) => {
  const body: unknown = req.body
  if (!isRecord(body)) {
    res.status(400).json({ message: 'A JSON request body is required.' })
    return
  }

  const update: {
    foodItemIds?: string[]
    totalAmount?: number
    status?: number
    notes?: string
  } = {}
  if (body.foodItemIds !== undefined) {
    if (!isFoodItemIdArray(body.foodItemIds)) {
      res.status(400).json({ message: 'foodItemIds must contain at least one non-empty food item ID.' })
      return
    }
    update.foodItemIds = body.foodItemIds
  }
  if (body.totalAmount !== undefined) {
    if (typeof body.totalAmount !== 'number' || !Number.isFinite(body.totalAmount)) {
      res.status(400).json({ message: 'totalAmount must be a finite number.' })
      return
    }
    update.totalAmount = body.totalAmount
  }
  if (body.status !== undefined) {
    if (body.status !== 0 && body.status !== 1 && body.status !== 2) {
      res.status(400).json({ message: 'status must be 0, 1, or 2.' })
      return
    }
    update.status = body.status
  }
  if (body.notes !== undefined) {
    if (typeof body.notes !== 'string') {
      res.status(400).json({ message: 'notes must be a string.' })
      return
    }
    update.notes = body.notes
  }
  if (Object.keys(update).length === 0) {
    res.status(400).json({ message: 'Provide at least one editable order field.' })
    return
  }

  const order = await OrderModel.findOneAndUpdate(
    { _id: req.params.id, userId: requireUserId(req) },
    { $set: update },
    { new: true, runValidators: true },
  )
  if (!order) {
    res.status(404).json({ message: 'Order not found.' })
    return
  }
  res.json(serializeOrder(order))
}

const deleteOrder: RequestHandler = async (req, res) => {
  const order = await OrderModel.findOneAndDelete({
    _id: req.params.id,
    userId: requireUserId(req),
  })
  if (!order) {
    res.status(404).json({ message: 'Order not found.' })
    return
  }
  res.status(204).end()
}

router.get('/', listOrders)
router.get('/:id', getOrder)
router.post('/', createOrder)
router.put('/:id', updateOrder)
router.delete('/:id', deleteOrder)

export default router
