import type { RequestHandler } from 'express'
import mongoose from 'mongoose'
import { configureDnsServers } from '../utils/dns'

let connectionPromise: Promise<typeof mongoose> | undefined

export const connectToDatabase: RequestHandler = async (_req, _res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
    return
  }

  const mongoUri = process.env.MONGODB_URI
  if (!mongoUri) {
    next(new Error('MONGODB_URI is not configured.'))
    return
  }

  if (!connectionPromise) {
    configureDnsServers()
    connectionPromise = mongoose.connect(mongoUri).catch((error: unknown) => {
      connectionPromise = undefined
      throw error
    })
  }

  try {
    await connectionPromise
    next()
  } catch (error) {
    connectionPromise = undefined
    next(error)
  }
}
