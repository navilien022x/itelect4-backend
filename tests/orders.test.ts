import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import { Types } from 'mongoose'
import app from '../src/app'
import { OrderModel } from '../src/models/Order'

vi.mock('../src/middleware/database', () => ({
  connectToDatabase: (_req: unknown, _res: unknown, next: () => void) => next(),
}))

vi.mock('../src/models/Order', () => ({
  OrderModel: {
    find: vi.fn(() => ({
      sort: vi.fn().mockResolvedValue([]),
    })),
  },
}))

const jwtSecret = 'test-secret-with-more-than-32-characters'
const originalJwtSecret = process.env.JWT_SECRET

beforeEach(() => {
  process.env.JWT_SECRET = jwtSecret
  vi.clearAllMocks()
})

afterEach(() => {
  if (originalJwtSecret === undefined) {
    delete process.env.JWT_SECRET
  } else {
    process.env.JWT_SECRET = originalJwtSecret
  }
})

describe('GET /api/orders', () => {
  it('returns 401 when no token is provided', async () => {
    const response = await request(app).get('/api/orders')

    expect(response.status).toBe(401)
    expect(OrderModel.find).not.toHaveBeenCalled()
  })

  it('allows a valid token through requireAuth', async () => {
    const userId = new Types.ObjectId().toHexString()
    const token = jwt.sign({ userId }, jwtSecret)

    const response = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body).toEqual([])
    expect(OrderModel.find).toHaveBeenCalledWith({ userId })
  })
})
