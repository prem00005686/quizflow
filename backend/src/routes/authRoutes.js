import express from 'express'
import * as authController from '../controllers/authController.js'
import { verifyAuth } from '../middleware/auth.js'

const router = express.Router()

router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/logout', authController.logout)
router.post('/refresh', authController.refreshToken)
router.post('/demo-login', authController.demoLogin)
router.get('/me', verifyAuth, authController.getCurrentUser)

export default router
