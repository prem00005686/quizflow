import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'
import mcqRoutes from './routes/mcqRoutes.js'
import userRoutes from './routes/userRoutes.js'
import subscriptionRoutes from './routes/subscriptionRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json({ limit: '10kb' }))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
})
app.use('/api/', limiter)

// Strict rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts. Please try again in 15 minutes.',
  skip: (req) => req.method !== 'POST',
  standardHeaders: true,
  legacyHeaders: false
})
app.use('/api/auth/login', authLimiter)
app.use('/api/auth/register', authLimiter)

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() })
})

// Auth routes
app.use('/api/auth', authRoutes)

// MCQ routes
app.use('/api/mcqs', mcqRoutes)

// User routes
app.use('/api/users', userRoutes)

// Subscription routes
app.use('/api/subscriptions', subscriptionRoutes)

// TODO: Add admin routes

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
