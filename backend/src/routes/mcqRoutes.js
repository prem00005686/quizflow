import express from 'express'
import * as mcqController from '../controllers/mcqController.js'
import { verifyAuth, checkSession } from '../middleware/auth.js'

const router = express.Router()

// Get topics
router.get('/topics', verifyAuth, mcqController.getTopics)

// Get questions for a test (randomized)
router.get('/questions', verifyAuth, mcqController.getQuestions)

// Submit test answers
router.post('/submit', verifyAuth, checkSession, mcqController.submitTest)

// Get test results
router.get('/results/:testId', verifyAuth, mcqController.getResults)

// Get user's test history
router.get('/history', verifyAuth, mcqController.getUserTestHistory)

export default router
