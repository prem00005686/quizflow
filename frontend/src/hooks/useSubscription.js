import { useEffect } from 'react'
import { useSubscriptionStore } from '../store/subscriptionStore'

/**
 * Hook to check subscription status and feature access
 * Provides methods to check if features are available based on user's plan
 */
export function useSubscription() {
  const { userPlan, fetchUserPlan } = useSubscriptionStore()

  useEffect(() => {
    fetchUserPlan()
  }, [])

  /**
   * Check if user has access to a specific feature
   */
  const hasFeature = (feature) => {
    const isPremium = userPlan?.planId === 'premium'
    
    const features = {
      unlimitedQuestions: isPremium,
      performanceReports: isPremium,
      topicStats: isPremium,
      offlineAccess: false, // Coming soon
      unlimitedTests: isPremium,
      allTopics: true, // Free users can see all topics but limited questions
      advancedFilters: isPremium,
      customLearningPaths: isPremium,
      aiTutoring: false, // Coming soon
    }
    
    return features[feature] ?? false
  }

  /**
   * Check if user has reached question limit (for free users)
   */
  const getQuestionLimit = () => {
    return userPlan?.planId === 'free' ? 5 : null
  }

  /**
   * Get remaining questions for free users
   */
  const getRemainingQuestions = (answered) => {
    if (userPlan?.planId !== 'free') return null
    const limit = 5
    return Math.max(0, limit - (answered || 0))
  }

  /**
   * Check if user is on premium plan
   */
  const isPremium = () => userPlan?.planId === 'premium'

  /**
   * Check if user is on free plan
   */
  const isFree = () => userPlan?.planId === 'free' || !userPlan?.planId

  /**
   * Get subscription status message
   */
  const getStatusMessage = () => {
    if (!userPlan) return 'Loading...'
    
    switch (userPlan.planId) {
      case 'premium':
        return 'Premium Access'
      case 'free':
        return 'Free Trial'
      default:
        return 'Free Trial'
    }
  }

  return {
    userPlan,
    hasFeature,
    getQuestionLimit,
    getRemainingQuestions,
    isPremium,
    isFree,
    getStatusMessage,
    fetchUserPlan
  }
}
