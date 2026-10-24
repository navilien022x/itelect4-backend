import type { ErrorRequestHandler } from 'express'
import mongoose from 'mongoose'

export const errorHandler: ErrorRequestHandler = (error, _req, res, next) => {
  if (res.headersSent) {
    next(error)
    return
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'type' in error &&
    error.type === 'entity.parse.failed'
  ) {
    res.status(400).json({ message: 'Request body must be valid JSON.' })
    return
  }

  if (error instanceof mongoose.Error.ValidationError || error instanceof mongoose.Error.CastError) {
    res.status(400).json({ message: error.message })
    return
  }

  if (typeof error === 'object' && error !== null && 'code' in error && error.code === 11000) {
    res.status(409).json({ message: 'An account with that email already exists.' })
    return
  }

  console.error(error)
  res.status(500).json({ message: 'An unexpected server error occurred.' })
}
