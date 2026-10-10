import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import authRoutes from './routes/auth'
import orderRoutes from './routes/orders'
import { authenticate } from './middleware/auth'
import { errorHandler } from './middleware/errors'

const app = express()

app.use(cors())
app.use(express.json({ limit: '1mb' }))
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, db: mongoose.connection.readyState === 1 })
})
app.get('/', (_req, res) => {
  res.json({
    message: 'Campus Food API is running.',
    endpoints: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
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
app.use('/api/orders', authenticate, orderRoutes)
app.use(errorHandler)

export default app
