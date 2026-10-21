import type { RequestHandler } from 'express'
import dns from 'node:dns'
import mongoose from 'mongoose'

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
    const dnsServers = process.env.DNS_SERVERS
      ?.split(',')
      .map((server) => server.trim())
      .filter(Boolean)
    if (dnsServers && dnsServers.length > 0) {
      dns.setServers(dnsServers)
    }

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
