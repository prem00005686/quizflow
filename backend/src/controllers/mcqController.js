import { supabase } from '../utils/supabase.js'
import { v4 as uuidv4 } from 'uuid'

const DEMO_QUESTION_SET = [
  {
    id: 'q1',
    text: 'Given a directed acyclic graph (DAG) representing task dependencies, which of the following algorithms is most appropriate for determining a valid execution order where every task is performed only after all its dependencies are met?',
    difficulty: 'medium',
    codeSnippet: `function scheduleTasks(tasks, dependencies):\n    // Initialization\n    inDegree = [0] * len(tasks)\n    graph = buildGraph(tasks, dependencies)\n\n    // ... ? ...`,
    options: [
      { id: 'A', text: "Dijkstra's Shortest Path Algorithm" },
      { id: 'B', text: "Kruskal's Minimum Spanning Tree" },
      { id: 'C', text: "Topological Sorting using Kahn's Algorithm" },
      { id: 'D', text: "Breadth-First Search (BFS) starting from any arbitrary node" }
    ]
  },
  {
    id: 'q2',
    text: 'Which data structure is most optimal for implementing a Least Recently Used (LRU) cache?',
    difficulty: 'easy',
    codeSnippet: null,
    options: [
      { id: 'A', text: 'Array' },
      { id: 'B', text: 'Hash Map combined with a Doubly Linked List' },
      { id: 'C', text: 'Binary Search Tree' },
      { id: 'D', text: 'Min-Heap' }
    ]
  },
  {
    id: 'q3',
    text: 'What is the time complexity of searching for an element in a balanced Binary Search Tree (BST)?',
    difficulty: 'easy',
    codeSnippet: null,
    options: [
      { id: 'A', text: 'O(1)' },
      { id: 'B', text: 'O(log n)' },
      { id: 'C', text: 'O(n)' },
      { id: 'D', text: 'O(n log n)' }
    ]
  }
]

function normalizeJsonArray(value) {
  if (Array.isArray(value)) {
    return value
  }

  if (typeof value === 'string') {
    try {
      return JSON.parse(value || '[]')
    } catch (error) {
      return []
    }
  }

  return []
}

export const getTopics = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .order('name')
    
    if (error) throw error
    
    res.json({ success: true, topics: data })
  } catch (error) {
    console.error('Get topics error:', error)
    res.status(500).json({ error: 'Failed to fetch topics' })
  }
}

export const getQuestions = async (req, res) => {
  try {
    const { topicId, count = 10 } = req.query
    const userId = req.userId
    
    if (!topicId) {
      return res.status(400).json({ error: 'Topic ID is required' })
    }

    if (topicId === 'topic_1') {
      return res.json({
        success: true,
        questions: DEMO_QUESTION_SET.slice(0, Math.min(parseInt(count), DEMO_QUESTION_SET.length)),
        subscription: 'free',
        maxQuestions: Math.min(parseInt(count), DEMO_QUESTION_SET.length),
        totalQuestionsAvailable: DEMO_QUESTION_SET.length
      })
    }

    // Check user subscription status
    let userSubscription = 'free'
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('subscription_status')
        .eq('id', userId)
        .single()
      
      if (userData) {
        userSubscription = userData.subscription_status || 'free'
      }
    } catch (e) {
      // Default to free if user not found
      userSubscription = 'free'
    }

    // Limit questions based on subscription
    const maxQuestions = userSubscription === 'free' ? 5 : Math.min(parseInt(count), 50)
    
    // Fetch questions from the topic
    const { data, error } = await supabase
      .from('mcqs')
      .select('id, question_text, difficulty, options')
      .eq('topic_id', topicId)
      .limit(maxQuestions)
    
    if (error) throw error
    
    if (!data || data.length === 0) {
      return res.json({ 
        success: true, 
        questions: [],
        subscription: userSubscription,
        maxQuestions: maxQuestions 
      })
    }
    
    // Randomize questions
    const randomized = data.sort(() => Math.random() - 0.5)
    
    // Randomize options within each question
    const questionsWithRandomizedOptions = randomized.map(q => {
      const options = normalizeJsonArray(q.options)
      const randomizedOptions = options.sort(() => Math.random() - 0.5)
      return {
        id: q.id,
        text: q.question_text,
        question_text: q.question_text,
        difficulty: q.difficulty,
        codeSnippet: null,
        options: randomizedOptions.map(({ id, text }) => ({ id, text })) // Don't send is_correct
      }
    })
    
    res.json({ 
      success: true, 
      questions: questionsWithRandomizedOptions,
      subscription: userSubscription,
      maxQuestions: maxQuestions,
      totalQuestionsAvailable: data.length
    })
  } catch (error) {
    console.error('Get questions error:', error)
    res.status(500).json({ error: 'Failed to fetch questions' })
  }
}

export const submitTest = async (req, res) => {
  try {
    const userId = req.userId
    const { topicId, answers, selectedAnswers, timeTaken } = req.body
    const answerMap = answers || selectedAnswers || {}
    
    if (!topicId || !answerMap || Object.keys(answerMap).length === 0) {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    
    // Get correct answers
    const questionIds = Object.keys(answerMap)
    let questions = []
    let qError = null

    if (questionIds.some((id) => /^q\d+$/i.test(id)) || topicId === 'topic_1' || userId === 'demo-user-001') {
      questions = DEMO_QUESTION_SET.filter((question) => questionIds.includes(question.id))
    } else {
      const response = await supabase
        .from('mcqs')
        .select('id, options')
        .in('id', questionIds)

      questions = response.data || []
      qError = response.error
    }

    if (qError) throw qError
    
    // Calculate score
    let score = 0
    const questionDetails = {}
    
    questions.forEach(q => {
      const options = normalizeJsonArray(q.options)
      const correctOption = options.find(o => o.is_correct)
      const userAnswer = answerMap[q.id]

      const fallbackCorrectAnswer = {
        q1: 'C',
        q2: 'B',
        q3: 'B'
      }[q.id]

      const resolvedCorrectAnswer = correctOption?.id || fallbackCorrectAnswer
      
      questionDetails[q.id] = {
        correct: resolvedCorrectAnswer,
        userAnswer,
        isCorrect: resolvedCorrectAnswer === userAnswer
      }
      
      if (resolvedCorrectAnswer === userAnswer) {
        score++
      }
    })
    
    // Store submission
    const submissionId = uuidv4()
    const totalQuestions = questions.length
    const percentage = Math.round((score / totalQuestions) * 100)
    const timeTakenSeconds = Number.isFinite(Number(timeTaken)) ? Math.max(0, Math.round(Number(timeTaken))) : null
    
    const { data: submission, error: submitError } = await supabase
      .from('test_submissions')
      .insert([
        {
          id: submissionId,
          user_id: userId,
          topic_id: topicId,
          score,
          total_questions: totalQuestions,
          time_taken_seconds: timeTakenSeconds,
          answers: questionDetails,
          submitted_at: new Date().toISOString()
        }
      ])
      .select()
    
    if (submitError) throw submitError
    
    // Award XP and update streak
    const xpEarned = score * 10 + (timeTaken ? Math.max(0, 100 - timeTaken / 10) : 0)
    const finalXp = Math.min(Math.round(xpEarned), 10000) // Cap at 10k XP per test
    
    // Get current XP
    const { data: userData } = await supabase
      .from('users')
      .select('total_xp, level, streak_count, last_activity_date')
      .eq('id', userId)
      .single()
    
    const newTotalXp = (userData?.total_xp || 0) + finalXp
    const newLevel = Math.floor(newTotalXp / 1000) + 1 // 1 level per 1000 XP
    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const previousActivityDate = userData?.last_activity_date
    const newStreak = previousActivityDate === today
      ? (userData?.streak_count || 0)
      : previousActivityDate === yesterday
        ? (userData?.streak_count || 0) + 1
        : 1
    
    // Update user with new XP and level
    await supabase
      .from('users')
      .update({
        total_xp: newTotalXp,
        level: newLevel,
        streak_count: newStreak,
        last_activity_date: today
      })
      .eq('id', userId)
    
    // Log activity
    const { data: existingActivity } = await supabase
      .from('user_activity')
      .select('questions_attempted, questions_correct, xp_earned')
      .eq('user_id', userId)
      .eq('date', today)
      .maybeSingle()

    const activityPayload = existingActivity
      ? {
          questions_attempted: (existingActivity.questions_attempted || 0) + totalQuestions,
          questions_correct: (existingActivity.questions_correct || 0) + score,
          xp_earned: (existingActivity.xp_earned || 0) + Math.round(xpEarned)
        }
      : {
          user_id: userId,
          date: today,
          questions_attempted: totalQuestions,
          questions_correct: score,
          xp_earned: Math.round(xpEarned)
        }

    if (existingActivity) {
      await supabase
        .from('user_activity')
        .update(activityPayload)
        .eq('user_id', userId)
        .eq('date', today)
    } else {
      await supabase
        .from('user_activity')
        .insert([activityPayload])
    }
    
    res.json({
      success: true,
      submission: {
        id: submissionId,
        score,
        correct: score,
        totalQuestions,
        total: totalQuestions,
        percentage,
        xpEarned: finalXp,
        timeTaken: timeTakenSeconds
      },
      questionDetails
    })
  } catch (error) {
    console.error('Submit test error:', error)
    res.status(500).json({ error: 'Failed to submit test' })
  }
}

export const getResults = async (req, res) => {
  try {
    const userId = req.userId
    const { testId } = req.params
    
    const { data, error } = await supabase
      .from('test_submissions')
      .select('*')
      .eq('id', testId)
      .eq('user_id', userId)
      .single()
    
    if (error) {
      return res.status(404).json({ error: 'Test result not found' })
    }
    
    res.json({ success: true, result: data })
  } catch (error) {
    console.error('Get results error:', error)
    res.status(500).json({ error: 'Failed to fetch results' })
  }
}

export const getUserTestHistory = async (req, res) => {
  try {
    const userId = req.userId
    const { limit = 10, offset = 0 } = req.query

    if (userId === 'demo-user-001') {
      return res.json({
        success: true,
        submissions: [
          {
            id: 'demo-test-001',
            user_id: userId,
            topic_id: 'topic_1',
            score: 2,
            total_questions: 3,
            time_taken_seconds: 112,
            submitted_at: new Date().toISOString()
          }
        ].slice(parseInt(offset), parseInt(offset) + parseInt(limit))
      })
    }
    
    const { data, error } = await supabase
      .from('test_submissions')
      .select('*')
      .eq('user_id', userId)
      .order('submitted_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1)
    
    if (error) throw error
    
    res.json({ success: true, submissions: data })
  } catch (error) {
    console.error('Get history error:', error)
    res.status(500).json({ error: 'Failed to fetch test history' })
  }
}
