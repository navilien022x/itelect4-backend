import { Router } from 'express'
import type { RequestHandler } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { UserModel } from '../models/User'
import { getJwtSecret } from '../middleware/auth'

const router = Router()

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

const register: RequestHandler = async (req, res) => {
  const body: unknown = req.body
  if (!isRecord(body)) {
    res.status(400).json({ message: 'A JSON request body is required.' })
    return
  }

  const { name, email, password } = body
  if (
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    name.trim().length < 2 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    password.length < 8
  ) {
    res.status(400).json({ message: 'Provide a name, valid email, and password of at least 8 characters.' })
    return
  }

  const user = await UserModel.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    passwordHash: await bcrypt.hash(password, 12),
  })
  const token = jwt.sign({ userId: user._id.toString() }, getJwtSecret(), { expiresIn: '1d' })

  res.status(201).json({
    token,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    },
  })
}

const login: RequestHandler = async (req, res) => {
  const body: unknown = req.body
  if (!isRecord(body) || typeof body.email !== 'string' || typeof body.password !== 'string') {
    res.status(400).json({ message: 'Provide an email and password.' })
    return
  }

  const user = await UserModel.findOne({ email: body.email.trim().toLowerCase() }).select('+passwordHash')
  if (!user || !(await bcrypt.compare(body.password, user.passwordHash))) {
    res.status(401).json({ message: 'Invalid email or password.' })
    return
  }
  if (!user.isActive) {
    res.status(403).json({ message: 'This account is inactive.' })
    return
  }

  const token = jwt.sign({ userId: user._id.toString() }, getJwtSecret(), { expiresIn: '1d' })
  res.json({
    token,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    },
  })
}

router.post('/register', register)
router.post('/login', login)

export default router
