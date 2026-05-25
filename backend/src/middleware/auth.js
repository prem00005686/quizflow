import { verifyToken } from '../utils/auth.js'
import { supabase } from '../utils/supabase.js'

export const verifyAuth = (req, res, next) => {
  const authHeader = req.headers.authorization
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No valid token provided' })
  }
  
  const token = authHeader.substring(7) // Remove 'Bearer ' prefix
  
  try {
    const decoded = verifyToken(token)
    if (!decoded || !decoded.userId || decoded.type !== 'access') {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }
    
    req.userId = decoded.userId
    next()
  } catch (error) {
    console.error('Token verification error:', error.message)
    res.status(401).json({ error: 'Token verification failed' })
  }
}

export const checkSession = async (req, res, next) => {
  try {
    const userId = req.userId
    const deviceFingerprint = req.headers['x-device-fingerprint']

    if (userId === 'demo-user-001') {
      req.sessionId = 'demo-session-001'
      return next()
    }
    
    if (!userId || !deviceFingerprint) {
      return res.status(401).json({ error: 'Device fingerprint required' })
    }
    
    // Check if session exists and is valid
    const { data: sessions, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('device_fingerprint', deviceFingerprint)
      .gt('expires_at', new Date().toISOString())
      .limit(1)
    
    if (error) {
      console.error('Session check error:', error)
      return res.status(500).json({ error: 'Session verification failed' })
    }
    
    if (!sessions || sessions.length === 0) {
      return res.status(401).json({ error: 'Session expired or invalid. Please login again.' })
    }
    
    const session = sessions[0]
    const currentIp = req.ip || req.connection.remoteAddress
    
    // Log IP change for security audit (don't block yet)
    if (currentIp && session.ip_address && currentIp !== session.ip_address) {
      console.warn(`Security: IP change for user ${userId}: ${session.ip_address} -> ${currentIp}`)
      // TODO: Track suspicious activity for admin review
    }
    
    // Update last activity timestamp
    await supabase
      .from('sessions')
      .update({ last_activity_at: new Date().toISOString() })
      .eq('id', session.id)
      .single()
    
    req.sessionId = session.id
    next()
  } catch (error) {
    console.error('Session check error:', error)
    res.status(500).json({ error: 'Session verification failed' })
  }
}
