import express from 'express'
import * as userController from '../controllers/userController.js'
import { verifyAuth } from '../middleware/auth.js'

const router = express.Router()

// Get user profile
router.get('/profile', verifyAuth, userController.getUserProfile)

// Update user profile
router.put('/profile', verifyAuth, userController.updateProfile)

// Get user stats
router.get('/stats', verifyAuth, userController.getUserStats)

// Get activity heatmap
router.get('/activity-heatmap', verifyAuth, userController.getActivityHeatmap)

// Get streak
router.get('/streak', verifyAuth, userController.getStreak)

export default router
