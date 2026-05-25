import { create } from 'zustand'
import axios from 'axios'

/**
 * Subscription Store
 * Manages user's subscription state, plan details, and billing information
 */
export const useSubscriptionStore = create((set, get) => ({
  // State
  plans: [],
  userPlan: null,
  isLoading: false,
  error: null,
  billingCycle: 'monthly', // 'monthly' or 'yearly'

  // Fetch available plans
  fetchPlans: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/subscriptions/plans`
      )
      set({ plans: response.data, isLoading: false })
    } catch (error) {
      console.error('Failed to fetch plans:', error)
      set({ 
        error: error.message,
        isLoading: false,
        // Set default plans if API fails
        plans: [
          {
            id: 'free',
            name: 'Free Trial',
            price: 0,
            priceMonthly: 0,
            priceYearly: 0,
            description: 'Start with our free trial',
            features: [
              '5 practice questions per topic',
              'Explore all topics',
              'See how tests work',
              'No credit card needed'
            ],
            limitations: [
              'Limited questions per topic',
              'Basic features only',
              'No performance reports'
            ]
          },
          {
            id: 'premium',
            name: 'Premium',
            price: 1500,
            priceMonthly: 1500,
            priceYearly: 15000,
            description: 'Full access to all questions',
            features: [
              'Access to 6000+ practice questions',
              'All topics covered',
              'Unlimited timed tests',
              'Performance reports',
              'Topic-wise statistics',
              'Lifetime updates',
              'Offline access (coming soon)',
              'Practice anytime, anywhere'
            ],
            limitations: []
          }
        ]
      })
    }
  },

  // Fetch user's current plan
  fetchUserPlan: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/subscriptions/user-plan`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        }
      )
      set({ userPlan: response.data, isLoading: false })
    } catch (error) {
      console.error('Failed to fetch user plan:', error)
      // Default to free plan
      set({
        userPlan: {
          planId: 'free',
          planName: 'Free',
          status: 'active',
          currentPeriodStart: new Date(),
          currentPeriodEnd: null,
          cancelAtPeriodEnd: false
        },
        isLoading: false
      })
    }
  },

  // Initiate checkout
  checkout: async (planId, billingCycle = 'monthly') => {
    set({ isLoading: true, error: null })
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/subscriptions/checkout`,
        { planId, billingCycle },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        }
      )
      
      // Redirect to Stripe checkout
      if (response.data.checkoutUrl) {
        window.location.href = response.data.checkoutUrl
      }
      
      set({ isLoading: false })
    } catch (error) {
      console.error('Checkout failed:', error)
      set({
        error: error.response?.data?.message || 'Checkout failed',
        isLoading: false
      })
    }
  },

  // Cancel subscription
  cancelSubscription: async () => {
    set({ isLoading: true, error: null })
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/subscriptions/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        }
      )
      
      // Update user plan
      set({
        userPlan: {
          ...get().userPlan,
          cancelAtPeriodEnd: true
        },
        isLoading: false
      })
    } catch (error) {
      console.error('Cancel subscription failed:', error)
      set({
        error: error.response?.data?.message || 'Failed to cancel subscription',
        isLoading: false
      })
    }
  },

  // Reactivate subscription
  reactivateSubscription: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/subscriptions/reactivate`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        }
      )
      
      set({ userPlan: response.data, isLoading: false })
    } catch (error) {
      console.error('Reactivate subscription failed:', error)
      set({
        error: error.response?.data?.message || 'Failed to reactivate subscription',
        isLoading: false
      })
    }
  },

  // Update billing cycle
  setBillingCycle: (cycle) => {
    set({ billingCycle: cycle })
  },

  // Clear error
  clearError: () => set({ error: null })
}))
