import { useEffect, useState } from 'react'
import apiClient from '../utils/apiClient'

/**
 * useActivityData Hook
 * 
 * Fetches user activity data from the backend for heatmap display.
 * Handles loading, error states, and caching.
 * 
 * Returns: { data, loading, error }
 * - data: Array of { date, count } objects
 * - loading: Boolean indicating if data is being fetched
 * - error: Error object if fetch failed, null otherwise
 */
export function useActivityData(year = new Date().getFullYear()) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await apiClient.get('/api/users/activity-heatmap', {
          params: { year }
        })

        // Transform API response to heatmap format
        const activityData = response.data.map(item => ({
          date: item.date || item.activity_date,
          count: item.count || item.question_count || 0
        }))

        setData(activityData)
      } catch (err) {
        console.error('Failed to fetch activity data:', err)
        setError(err)
        // Return empty data on error (heatmap will show all gray)
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchActivityData()
  }, [year])

  return { data, loading, error }
}

/**
 * useCachedActivityData Hook
 * 
 * Extended version with local caching to reduce API calls.
 * Cache expires after specified time (default: 1 hour).
 * 
 * Returns: { data, loading, error, refetch }
 */
export function useCachedActivityData(
  year = new Date().getFullYear(),
  cacheExpireMs = 3600000 // 1 hour
) {
  const cacheKey = `activity_${year}`
  const [data, setData] = useState(() => {
    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      const { timestamp, data: cachedData } = JSON.parse(cached)
      if (Date.now() - timestamp < cacheExpireMs) {
        return cachedData
      }
      localStorage.removeItem(cacheKey)
    }
    return []
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchActivityData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await apiClient.get('/api/users/activity-heatmap', {
        params: { year }
      })

      const activityData = response.data.map(item => ({
        date: item.date || item.activity_date,
        count: item.count || item.question_count || 0
      }))

      setData(activityData)

      // Cache the data
      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          timestamp: Date.now(),
          data: activityData
        })
      )
    } catch (err) {
      console.error('Failed to fetch activity data:', err)
      setError(err)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActivityData()
  }, [year])

  const refetch = () => {
    localStorage.removeItem(cacheKey)
    fetchActivityData()
  }

  return { data, loading, error, refetch }
}

/**
 * Mock data generator for development/testing
 * Generates realistic activity patterns
 */
export function generateMockActivityData(year = new Date().getFullYear()) {
  const data = []
  const startDate = new Date(year, 0, 1)
  const endDate = new Date(year, 11, 31)

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0]
    
    // 70% chance of activity
    if (Math.random() < 0.7) {
      // Simulate activity patterns: weekends less, weekdays more
      const dayOfWeek = d.getDay()
      const baseMultiplier = dayOfWeek === 0 || dayOfWeek === 6 ? 0.5 : 1
      
      // Random count between 1 and 25
      const count = Math.floor(Math.random() * 25 * baseMultiplier) + 1
      
      data.push({ date: dateStr, count })
    }
  }

  return data
}
