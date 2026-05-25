import { supabase } from '../utils/supabase.js'

function isDemoUser(userId) {
  return userId === 'demo-user-001'
}

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.userId

    if (isDemoUser(userId)) {
      return res.json({
        success: true,
        user: {
          id: userId,
          email: 'demo@example.com',
          display_name: 'Demo User',
          avatar_url: null,
          subscription_status: 'premium',
          total_xp: 500,
          level: 5,
          streak_count: 8,
          last_activity_date: new Date().toISOString().split('T')[0],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      })
    }
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    res.json({ success: true, user: data })
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({ error: 'Failed to fetch profile' })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId
    const { displayName, avatarUrl } = req.body
    
    const updates = {}
    if (displayName) updates.display_name = displayName
    if (avatarUrl) updates.avatar_url = avatarUrl
    
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
    
    if (error) throw error
    
    res.json({ success: true, user: data[0] })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({ error: 'Failed to update profile' })
  }
}

export const getUserStats = async (req, res) => {
  try {
    const userId = req.userId

    if (isDemoUser(userId)) {
      return res.json({
        success: true,
        stats: {
          total_xp: 500,
          level: 5,
          streak_count: 8,
          totalCorrect: 18,
          totalAttempted: 24,
          accuracy: 75,
          totalTests: 6
        }
      })
    }
    
    const { data, error } = await supabase
      .from('users')
      .select('total_xp, level, streak_count')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    
    // Get test statistics
    const { data: submissions, error: submitError } = await supabase
      .from('test_submissions')
      .select('score, total_questions')
      .eq('user_id', userId)
    
    if (submitError) throw submitError
    
    let totalCorrect = 0
    let totalAttempted = 0
    
    if (submissions) {
      submissions.forEach(s => {
        totalCorrect += s.score
        totalAttempted += s.total_questions
      })
    }
    
    const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0
    
    res.json({
      success: true,
      stats: {
        ...data,
        totalCorrect,
        totalAttempted,
        accuracy,
        totalTests: submissions?.length || 0
      }
    })
  } catch (error) {
    console.error('Get stats error:', error)
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
}

export const getActivityHeatmap = async (req, res) => {
  try {
    const userId = req.userId
    const { year = new Date().getFullYear() } = req.query
    
    // For demo user, return mock activity data
    if (isDemoUser(userId)) {
      const mockActivityData = generateMockActivityData(year)
      return res.json(mockActivityData)
    }
    
    // Get all activity for the year
    const { data, error } = await supabase
      .from('user_activity')
      .select('date, questions_attempted, questions_correct, xp_earned')
      .eq('user_id', userId)
      .gte('date', `${year}-01-01`)
      .lte('date', `${year}-12-31`)
      .order('date')
    
    if (error) throw error
    
    // Format data for heatmap - daily count of questions attempted
    const heatmapData = []
    const dateMap = new Map()
    
    if (data) {
      data.forEach(activity => {
        const date = activity.date
        if (!dateMap.has(date)) {
          dateMap.set(date, 0)
        }
        // Sum questions attempted per day
        dateMap.set(date, dateMap.get(date) + (activity.questions_attempted || 0))
      })
      
      // Convert map to array format expected by frontend
      dateMap.forEach((count, date) => {
        heatmapData.push({
          date,
          count,
          activity_date: date,
          question_count: count
        })
      })
    }
    
    res.json(heatmapData)
  } catch (error) {
    console.error('Get heatmap error:', error)
    res.status(500).json({ error: 'Failed to fetch heatmap' })
  }
}

// Helper function to generate realistic mock activity data
function generateMockActivityData(year) {
  const mockData = []
  const today = new Date()
  const startDate = new Date(year, 0, 1)
  
  // Generate 30 days of recent activity
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    // Skip if before start of year
    if (date < startDate) continue
    
    // Skip weekends 60% of the time (realistic pattern)
    if ([0, 6].includes(date.getDay()) && Math.random() < 0.6) continue
    
    // Skip some weekdays (not always practicing)
    if (Math.random() < 0.3) continue
    
    const dateStr = date.toISOString().split('T')[0]
    // Random questions attempted (5-25)
    const count = Math.floor(Math.random() * 20) + 5
    
    mockData.push({
      date: dateStr,
      count,
      activity_date: dateStr,
      question_count: count
    })
  }
  
  return mockData
}

export const getStreak = async (req, res) => {
  try {
    const userId = req.userId

    if (isDemoUser(userId)) {
      return res.json({
        success: true,
        streak: {
          count: 8,
          active: true,
          lastActivityDate: new Date().toISOString().split('T')[0]
        }
      })
    }
    
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('streak_count, last_activity_date')
      .eq('id', userId)
      .single()
    
    if (userError) throw userError
    
    // Check if streak should be maintained (active today or yesterday)
    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    
    const isStreakActive = user.last_activity_date === today || user.last_activity_date === yesterday
    
    res.json({
      success: true,
      streak: {
        count: user.streak_count,
        active: isStreakActive,
        lastActivityDate: user.last_activity_date
      }
    })
  } catch (error) {
    console.error('Get streak error:', error)
    res.status(500).json({ error: 'Failed to fetch streak' })
  }
}
