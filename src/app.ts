import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth'
import orderRoutes from './routes/orders'
import { authenticate } from './middleware/auth'
import { errorHandler } from './middleware/errors'

const app = express()

app.use(cors())
app.use(express.json({ limit: '1mb' }))
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})
app.use('/api/auth', authRoutes)
app.use('/api/orders', authenticate, orderRoutes)
app.use(errorHandler)

export default app
