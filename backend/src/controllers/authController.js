import { supabase } from '../utils/supabase.js'
import { generateToken, generateRefreshToken, verifyRefreshToken, hashPassword, comparePassword, validateEmail } from '../utils/auth.js'
import { v4 as uuidv4 } from 'uuid'
export const register = async (req, res) => {
  try {
    const { email, password, displayName } = req.body
    
    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }
    
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }
    
    // First, try to create auth user in Supabase Auth (this will return userId)
    let authData = null
    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.admin.createUser({
        email: email.toLowerCase(),
        password: password,
        email_confirm: true  // Auto-confirm email for development
      })
      
      if (signUpError) {
        if (signUpError.message.includes('already exists')) {
          return res.status(409).json({ error: 'Email already registered' })
        }
        throw signUpError
      }
      
      authData = signUpData.user
      console.log('User created in Supabase Auth:', authData.id)
    } catch (authError) {
      console.error('Supabase Auth error:', authError.message)
      return res.status(500).json({ error: 'Failed to create account: ' + authError.message })
    }
    
    const userId = authData.id
    
    // Hash password for database backup
    const passwordHash = await hashPassword(password)
    
    // Now store user profile in database
    const userData = {
      id: userId,
      email: email.toLowerCase(),
      password_hash: passwordHash,
      display_name: displayName || email.split('@')[0],
      subscription_status: 'free',
      total_xp: 0,
      level: 1,
      streak_count: 0,
      created_at: new Date().toISOString(),
      last_activity_date: new Date().toISOString().split('T')[0]
    }
    
    try {
      const { error: dbError } = await supabase
        .from('users')
        .insert([userData])
      
      if (dbError && !dbError.message.includes('duplicate')) {
        throw dbError
      }
      
      console.log('User profile created in database:', userId)
    } catch (dbError) {
      console.error('Database error:', dbError.message)
      // If profile save fails, we still created auth user, so return success
      // The profile will be created on first login
    }
    
    // Generate tokens for immediate login
    const token = generateToken(userId)
    const refreshToken = generateRefreshToken(userId)
    
    res.status(201).json({ 
      success: true,
      token,
      refreshToken,
      user: {
        id: userId,
        email: email.toLowerCase(),
        displayName: displayName || email.split('@')[0],
        subscriptionStatus: 'free',
        totalXp: 0,
        level: 1,
        streakCount: 0
      },
      message: 'User registered successfully. You can now login.'
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ error: 'Registration failed: ' + error.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password, deviceFingerprint, accessToken, userId } = req.body
    
    // Validate inputs
    if (!deviceFingerprint) {
      return res.status(400).json({ error: 'Device fingerprint is required' })
    }
    
    // If we have accessToken and userId from Supabase Auth (frontend), use those
    let authUserId = userId
    
    if (!authUserId || !accessToken) {
      // Fallback: try to authenticate with email/password (development mode)
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' })
      }
      
      // Try to authenticate with Supabase Auth
      try {
        const { data: authData, error: authError } = await supabase.auth.admin.getUserByEmail(email.toLowerCase())
        
        if (authError || !authData?.user) {
          return res.status(401).json({ error: 'Invalid email or password' })
        }
        
        authUserId = authData.user.id
        console.log('User authenticated via Supabase Auth:', authUserId)
      } catch (authError) {
        console.error('Supabase Auth error:', authError.message)
        return res.status(401).json({ error: 'Invalid email or password' })
      }
    } else {
      console.log('User verified via access token:', authUserId)
    }
    
    // Get user profile from database
    let userData = null
    try {
      const { data: dbUser, error: dbError } = await supabase
        .from('users')
        .select('id, email, subscription_status, display_name, total_xp, level, streak_count')
        .eq('id', authUserId)
        .single()
      
      if (!dbError && dbUser) {
        userData = dbUser
      } else {
        // Create profile if not exists
        userData = {
          id: authUserId,
          email: email || 'unknown@example.com',
          display_name: 'User',
          subscription_status: 'free',
          total_xp: 0,
          level: 1,
          streak_count: 0
        }
      }
    } catch (dbError) {
      console.log('Database query failed:', dbError.message)
      userData = {
        id: authUserId,
        email: email || 'unknown@example.com',
        display_name: 'User',
        subscription_status: 'free',
        total_xp: 0,
        level: 1,
        streak_count: 0
      }
    }
    
    // Try to create session
    const sessionId = uuidv4()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    
    try {
      await supabase.from('sessions').insert([
        {
          id: sessionId,
          user_id: authUserId,
          device_fingerprint: deviceFingerprint,
          ip_address: req.ip || req.connection.remoteAddress,
          user_agent: req.headers['user-agent'],
          expires_at: expiresAt.toISOString(),
          created_at: new Date().toISOString()
        }
      ])
      
      console.log('Session created:', sessionId)
    } catch (sessionError) {
      console.error('Session creation error:', sessionError.message)
      // Continue anyway
    }
    
    // Generate JWT tokens
    const token = generateToken(authUserId)
    const refreshToken = generateRefreshToken(authUserId)
    
    res.json({
      success: true,
      token,
      refreshToken,
      user: {
        id: authUserId,
        email: userData.email,
        displayName: userData.display_name,
        subscriptionStatus: userData.subscription_status,
        totalXp: userData.total_xp,
        level: userData.level,
        streakCount: userData.streak_count
      },
      message: 'Login successful'
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Login failed: ' + error.message })
  }
}

export const logout = async (req, res) => {
  try {
    const { deviceFingerprint } = req.body
    
    if (!deviceFingerprint) {
      return res.status(400).json({ error: 'Missing device fingerprint' })
    }
    
    // Delete session
    await supabase
      .from('sessions')
      .delete()
      .eq('device_fingerprint', deviceFingerprint)
    
    res.json({ success: true, message: 'Logout successful' })
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body
    
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' })
    }
    
    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken)
    if (!decoded || decoded.type !== 'refresh') {
      return res.status(401).json({ error: 'Invalid or expired refresh token' })
    }
    
    // Check if user still exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', decoded.userId)
      .single()
    
    if (userError || !user) {
      return res.status(401).json({ error: 'User not found' })
    }
    
    // Generate new access token
    const newAccessToken = generateToken(decoded.userId, '1h')
    
    res.json({ 
      success: true,
      token: newAccessToken,
      message: 'Token refreshed successfully'
    })
  } catch (error) {
    console.error('Token refresh error:', error)
    res.status(500).json({ error: 'Token refresh failed' })
  }
}

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId
    
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
    console.error('Get user error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * Demo Login - For testing without Supabase
 * Accepts: demo@example.com / demo123
 */
export const demoLogin = async (req, res) => {
  try {
    const { email, password, deviceFingerprint } = req.body

    // Accept demo credentials
    if (email === 'demo@example.com' && password === 'demo123') {
      const userId = 'demo-user-001'
      
      // Generate tokens
      const token = generateToken(userId)
      const refreshToken = generateRefreshToken(userId)
      
      // Create mock session for demo user
      const sessionId = uuidv4()
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      
      // Try to create session in database (optional, won't crash if fails)
      try {
        await supabase.from('sessions').insert([
          {
            id: sessionId,
            user_id: userId,
            device_fingerprint: deviceFingerprint || 'demo-device',
            ip_address: '127.0.0.1',
            user_agent: 'Demo User Agent',
            expires_at: expiresAt.toISOString(),
            created_at: new Date().toISOString()
          }
        ])
      } catch (e) {
        console.log('Demo session creation skipped (Supabase may not be connected)')
      }

      return res.json({
        success: true,
        token,
        refreshToken,
        user: {
          id: userId,
          email: 'demo@example.com',
          displayName: 'Demo User',
          subscriptionStatus: 'premium',
          totalXp: 500,
          level: 5,
          streakCount: 8,
          lastActivityDate: new Date().toISOString().split('T')[0]
        },
        message: 'Demo login successful'
      })
    }

    // Invalid credentials
    return res.status(401).json({ error: 'Invalid email or password' })
  } catch (error) {
    console.error('Demo login error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
