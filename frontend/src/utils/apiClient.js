import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add interceptor to include auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  const fingerprint = localStorage.getItem('device_fingerprint')
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  if (fingerprint) {
    config.headers['x-device-fingerprint'] = fingerprint
  }
  
  return config
}, (error) => {
  return Promise.reject(error)
})

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Check if this request should skip redirect
      const skipRedirect = error.config?.skipAuthRedirect
      
      if (!skipRedirect) {
        // Clear auth and redirect to login
        localStorage.removeItem('auth_token')
        localStorage.removeItem('device_fingerprint')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient
