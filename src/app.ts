import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import authRoutes from './routes/auth'
import foodItemRoutes from './routes/foodItems'
import orderRoutes from './routes/orders'
import { authenticate } from './middleware/auth'
import { connectToDatabase } from './middleware/database'
import { errorHandler } from './middleware/errors'

const app = express()

const corsOrigins = (process.env.CORS_ORIGIN ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(cors({ origin: corsOrigins }))
app.use(express.json({ limit: '1mb' }))
app.use(connectToDatabase)
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, db: mongoose.connection.readyState === 1 })
})
app.get('/', (_req, res) => {
  res.json({
    message: 'Campus Food API is running.',
    endpoints: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      foodItems: {
        list: 'GET /api/food-items',
        get: 'GET /api/food-items/:id',
      },
      orders: {
        list: 'GET /api/orders',
        get: 'GET /api/orders/:id',
        create: 'POST /api/orders',
        update: 'PUT /api/orders/:id',
        delete: 'DELETE /api/orders/:id',
      },
    },
  })
})
app.use('/api/auth', authRoutes)
app.use('/api/food-items', foodItemRoutes)
app.use('/api/orders', authenticate, orderRoutes)
app.use(errorHandler)

export default app
