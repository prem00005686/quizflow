import express from 'express'
import * as subscriptionController from '../controllers/subscriptionController.js'
import { verifyAuth } from '../middleware/auth.js'

const router = express.Router()

// Get available plans
router.get('/plans', subscriptionController.getPlans)

// Get user's current subscription
router.get('/user-plan', verifyAuth, subscriptionController.getUserPlan)

// Initiate checkout
router.post('/checkout', verifyAuth, subscriptionController.checkout)

// Cancel subscription
router.post('/cancel', verifyAuth, subscriptionController.cancelSubscription)

// Reactivate subscription
router.post('/reactivate', verifyAuth, subscriptionController.reactivateSubscription)

// Stripe webhook (for payment confirmation)
router.post('/webhook', subscriptionController.handleWebhook)

export default router
