import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from './store/authStore'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import DashboardPage from './pages/DashboardPage'
import TestPage from './pages/TestPage'
import ResultsPage from './pages/ResultsPage'
import SubscriptionsPage from './pages/SubscriptionsPage'
import SubscriptionManagementPage from './pages/SubscriptionManagementPage'
import './App.css'

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuthStore()
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />
}

function App() {
  const { initAuth } = useAuthStore()

  useEffect(() => {
    // Clear any old/invalid tokens from development
    const token = localStorage.getItem('auth_token')
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]))
        // If token has invalid userId format, clear it
        if (decoded.userId && decoded.userId.includes('-') && !decoded.userId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('device_fingerprint')
        }
      } catch (e) {
        // If we can't parse token, clear it
        localStorage.removeItem('auth_token')
        localStorage.removeItem('device_fingerprint')
      }
    }
    
    initAuth()
  }, [])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/test"
          element={
            <PrivateRoute>
              <TestPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/results"
          element={
            <PrivateRoute>
              <ResultsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/subscriptions"
          element={
            <PrivateRoute>
              <SubscriptionsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/subscription-management"
          element={
            <PrivateRoute>
              <SubscriptionManagementPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
