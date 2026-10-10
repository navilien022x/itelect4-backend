import 'dotenv/config'
import mongoose from 'mongoose'
import app from './app'

async function startServer(): Promise<void> {
  const mongoUri = process.env.MONGODB_URI
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not configured.')
  }
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured.')
  }

  await mongoose.connect(mongoUri)
  const port = Number(process.env.PORT ?? 5000)
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535.')
  }
  app.listen(port, () => {
    console.log(`Campus Food API listening on port ${port}.`)
  })
}

startServer().catch((error: unknown) => {
  console.error('Failed to start Campus Food API:', error)
  process.exitCode = 1
})
