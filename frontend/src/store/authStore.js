import { create } from 'zustand'
import { supabase, getCurrentSession, signInWithEmail, signUpWithEmail, signOut, getDeviceFingerprint } from '../utils/supabaseAuth'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,
  session: null,
  deviceFingerprint: null,
  
  initAuth: async () => {
    try {
      const session = await getCurrentSession()
      const fingerprint = await getDeviceFingerprint()
      
      if (session?.user) {
        set({ 
          user: session.user, 
          isAuthenticated: true,
          session,
          deviceFingerprint: fingerprint
        })
        
        localStorage.setItem('auth_token', session.access_token)
        localStorage.setItem('device_fingerprint', fingerprint)
      }
      
      set({ loading: false })
    } catch (error) {
      console.error('Auth init error:', error)
      set({ loading: false })
    }
  },
  
  register: async (email, password, displayName) => {
    try {
      set({ loading: true })
      
      // Call backend register endpoint directly (works with or without Supabase)
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        email,
        password,
        displayName
      })
      
      if (response.data.success) {
        set({ loading: false })
        return { success: true }
      } else {
        throw new Error(response.data.error || 'Registration failed')
      }
    } catch (error) {
      console.error('Registration error:', error)
      set({ loading: false })
      return { success: false, error: error.response?.data?.error || error.message }
    }
  },
  
  login: async (email, password) => {
    try {
      set({ loading: true })
      
      const { data, error } = await signInWithEmail(email, password)
      if (error) throw error
      
      if (data.session) {
        const fingerprint = await getDeviceFingerprint()
        
        try {
          await axios.post(`${API_URL}/api/auth/login`, {
            userId: data.user.id,
            email: data.user.email,
            deviceFingerprint: fingerprint,
            accessToken: data.session.access_token
          })
        } catch (e) {
          console.warn('Backend login failed:', e)
        }
        
        localStorage.setItem('auth_token', data.session.access_token)
        localStorage.setItem('device_fingerprint', fingerprint)
        
        set({ 
          user: data.user,
          isAuthenticated: true,
          session: data.session,
          deviceFingerprint: fingerprint,
          loading: false
        })
        
        return { success: true }
      }
    } catch (error) {
      console.error('Login error:', error)
      set({ loading: false })
      return { success: false, error: error.message }
    }
  },
  
  logout: async () => {
    try {
      set({ loading: true })
      
      const fingerprint = localStorage.getItem('device_fingerprint')
      
      if (fingerprint) {
        try {
          await axios.post(`${API_URL}/api/auth/logout`, {
            deviceFingerprint: fingerprint
          })
        } catch (e) {
          console.warn('Backend logout failed:', e)
        }
      }
      
      await signOut()
      
      set({ 
        user: null, 
        isAuthenticated: false,
        session: null,
        deviceFingerprint: null,
        loading: false
      })
      
      localStorage.removeItem('auth_token')
      localStorage.removeItem('device_fingerprint')
      
      return { success: true }
    } catch (error) {
      console.error('Logout error:', error)
      set({ loading: false })
      return { success: false, error: error.message }
    }
  },

  /**
   * Demo Login - For testing without Supabase
   * Email: demo@example.com
   * Password: demo123
   */
  demoLogin: async () => {
    try {
      set({ loading: true })
      
      const response = await axios.post(`${API_URL}/api/auth/demo-login`, {
        email: 'demo@example.com',
        password: 'demo123',
        deviceFingerprint: 'demo-device'
      })

      const { token, user } = response.data

      localStorage.setItem('auth_token', token)
      localStorage.setItem('device_fingerprint', 'demo-device')

      set({
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          user_metadata: {
            display_name: user.displayName
          }
        },
        isAuthenticated: true,
        session: { access_token: token },
        deviceFingerprint: 'demo-device',
        loading: false
      })

      return { success: true }
    } catch (error) {
      console.error('Demo login error:', error)
      set({ loading: false })
      return { success: false, error: error.response?.data?.error || error.message }
    }
  },
  
  setUser: (user) => set({ user, isAuthenticated: !!user })
}))
