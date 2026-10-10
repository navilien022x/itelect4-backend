import type { Request, RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import { Types } from 'mongoose'

declare global {
  namespace Express {
    interface Request {
      userId?: string
    }
  }
}

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET is not configured.')
  }
  return secret
}

export function requireUserId(req: Request): string {
  if (!req.userId) {
    throw new Error('Authenticated user ID is missing from the request.')
  }
  return req.userId
}

export const authenticate: RequestHandler = (req, res, next) => {
  const authorization = req.get('authorization')
  const match = authorization?.match(/^Bearer\s+(\S+)$/i)

  if (!match) {
    res.status(401).json({ message: 'A Bearer token is required.' })
    return
  }

  jwt.verify(match[1], getJwtSecret(), (error, decoded) => {
    if (
      error ||
      typeof decoded !== 'object' ||
      decoded === null ||
      typeof decoded.userId !== 'string' ||
      !Types.ObjectId.isValid(decoded.userId)
    ) {
      res.status(401).json({ message: 'The Bearer token is invalid or expired.' })
      return
    }

    req.userId = decoded.userId
    next()
  })
}
