import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET not configured in .env')
}

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || JWT_SECRET + '_refresh'

export const generateToken = (userId, expiresIn = '1h') => {
  if (!userId) throw new Error('userId is required')
  return jwt.sign({ userId, type: 'access' }, JWT_SECRET, { expiresIn })
}

export const generateRefreshToken = (userId, expiresIn = '7d') => {
  if (!userId) throw new Error('userId is required')
  return jwt.sign({ userId, type: 'refresh' }, JWT_REFRESH_SECRET, { expiresIn })
}

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET)
  } catch (error) {
    return null
  }
}

export const hashPassword = async (password) => {
  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters')
  }
  return await bcrypt.hash(password, 10)
}

export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash)
}

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const generateFingerprint = (req) => {
  // Stronger browser fingerprinting
  const userAgent = req.headers['user-agent'] || ''
  const acceptLanguage = req.headers['accept-language'] || ''
  const acceptEncoding = req.headers['accept-encoding'] || ''
  const timestamp = Math.floor(Date.now() / (1000 * 60 * 60)) // Hash by hour
  
  return Buffer.from(`${userAgent}|${acceptLanguage}|${acceptEncoding}|${timestamp}`)
    .toString('base64')
    .substring(0, 64)
}
