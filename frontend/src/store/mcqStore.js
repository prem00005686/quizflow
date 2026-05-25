import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'

export const useMcqStore = create((set, get) => ({
  // Test state
  testId: null,
  currentTestData: null,
  topicId: null,
  questions: [],
  currentQuestionIndex: 0,
  selectedAnswers: {}, // { questionId: answerId }
  timeRemaining: 0,
  totalTime: 0,
  testStarted: false,
  testSubmitted: false,
  
  // Results
  results: null,
  
  // Initialize test
  startTest: (topicId, questions, timeLimit) => {
    const testId = uuidv4()
    set({
      testId,
      topicId,
      questions,
      currentQuestionIndex: 0,
      selectedAnswers: {},
      timeRemaining: timeLimit,
      totalTime: timeLimit,
      testStarted: true,
      testSubmitted: false,
      results: null
    })
  },
  
  // Select answer for current question
  selectAnswer: (answerId) => {
    set((state) => {
      const questionId = state.questions[state.currentQuestionIndex]?.id
      return {
        selectedAnswers: {
          ...state.selectedAnswers,
          [questionId]: answerId
        }
      }
    })
  },
  
  // Move to next question
  nextQuestion: () => {
    set((state) => ({
      currentQuestionIndex: Math.min(
        state.currentQuestionIndex + 1,
        state.questions.length - 1
      )
    }))
  },
  
  // Move to previous question
  previousQuestion: () => {
    set((state) => ({
      currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0)
    }))
  },
  
  // Jump to specific question
  goToQuestion: (index) => {
    set((state) => ({
      currentQuestionIndex: Math.min(Math.max(index, 0), state.questions.length - 1)
    }))
  },
  
  // Update timer
  decrementTimer: () => {
    set((state) => ({
      timeRemaining: Math.max(state.timeRemaining - 1, 0)
    }))
  },
  
  // Submit test
  submitTest: (results) => {
    set({
      testSubmitted: true,
      results
    })
  },
  
  // End test without calculating
  endTest: () => {
    set({
      testSubmitted: true
    })
  },
  
  // Reset test
  resetTest: () => {
    set({
      testId: null,
      currentTestData: null,
      topicId: null,
      questions: [],
      currentQuestionIndex: 0,
      selectedAnswers: {},
      timeRemaining: 0,
      totalTime: 0,
      testStarted: false,
      testSubmitted: false,
      results: null
    })
  },
  
  // Get current question
  getCurrentQuestion: () => {
    const state = get()
    return state.questions[state.currentQuestionIndex] || null
  },
  
  // Get current answer for question
  getCurrentAnswer: () => {
    const state = get()
    const question = state.questions[state.currentQuestionIndex]
    return question ? state.selectedAnswers[question.id] : null
  }
}))
