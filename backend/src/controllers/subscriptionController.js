import { supabase } from '../utils/supabase.js'

// Mock plans - in production, would fetch from database or Stripe
const PLANS = {
  free: {
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
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 1500,
    priceMonthly: 1500,
    priceYearly: 15000,
    stripePriceMonthlyId: 'price_premium_monthly',
    stripePriceYearlyId: 'price_premium_yearly',
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
}

/**
 * Get available subscription plans
 */
export const getPlans = async (req, res) => {
  try {
    const plans = Object.values(PLANS)
    res.json(plans)
  } catch (error) {
    console.error('Get plans error:', error)
    res.status(500).json({ error: 'Failed to fetch plans' })
  }
}

/**
 * Get user's current subscription
 */
export const getUserPlan = async (req, res) => {
  try {
    const userId = req.userId

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(userId)) {
      return res.status(401).json({ error: 'Invalid user ID format' })
    }

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    // If no subscription found, return free plan
    if (!data) {
      return res.json({
        planId: 'free',
        planName: 'Free',
        status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false
      })
    }

    res.json({
      planId: data.plan_id,
      planName: PLANS[data.plan_id]?.name || 'Free',
      status: data.status,
      currentPeriodStart: data.current_period_start,
      currentPeriodEnd: data.current_period_end,
      cancelAtPeriodEnd: data.cancel_at_period_end || false
    })
  } catch (error) {
    console.error('Get user plan error:', error)
    res.status(500).json({ error: 'Failed to fetch subscription' })
  }
}

/**
 * Initiate checkout (Stripe)
 * In production, this would redirect to Stripe checkout
 */
export const checkout = async (req, res) => {
  try {
    const userId = req.userId
    const { planId, billingCycle } = req.body

    // Validate plan
    if (!PLANS[planId]) {
      return res.status(400).json({ error: 'Invalid plan' })
    }

    // For free plan, skip Stripe
    if (planId === 'free') {
      // Create/update subscription in database
      const { data, error } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: userId,
          plan_id: 'free',
          status: 'active',
          current_period_start: new Date(),
          current_period_end: null,
          cancel_at_period_end: false
        })
        .select()

      if (error) throw error

      return res.json({
        success: true,
        message: 'Free plan activated',
        subscription: data[0]
      })
    }

    // For paid plans, generate Stripe checkout URL
    // In production, integrate with Stripe API
    const stripeSessionId = `session_${Date.now()}_${userId}`

    // Mock Stripe checkout URL
    const checkoutUrl = `https://checkout.stripe.com/pay/${stripeSessionId}`

    // Store session in database for webhook verification
    const { data, error } = await supabase
      .from('stripe_sessions')
      .insert({
        session_id: stripeSessionId,
        user_id: userId,
        plan_id: planId,
        billing_cycle: billingCycle,
        status: 'pending'
      })
      .select()

    if (error) throw error

    res.json({
      success: true,
      checkoutUrl,
      sessionId: stripeSessionId
    })
  } catch (error) {
    console.error('Checkout error:', error)
    res.status(500).json({ error: 'Checkout failed' })
  }
}

/**
 * Cancel subscription
 */
export const cancelSubscription = async (req, res) => {
  try {
    const userId = req.userId

    // Get current subscription
    const { data: subscription, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError
    }

    if (!subscription) {
      return res.status(404).json({ error: 'No active subscription' })
    }

    // Mark for cancellation
    const { data, error } = await supabase
      .from('subscriptions')
      .update({
        cancel_at_period_end: true,
        updated_at: new Date()
      })
      .eq('id', subscription.id)
      .select()

    if (error) throw error

    res.json({
      success: true,
      message: 'Subscription will be canceled at the end of the billing period',
      subscription: data[0]
    })
  } catch (error) {
    console.error('Cancel subscription error:', error)
    res.status(500).json({ error: 'Failed to cancel subscription' })
  }
}

/**
 * Reactivate canceled subscription
 */
export const reactivateSubscription = async (req, res) => {
  try {
    const userId = req.userId

    // Get current subscription
    const { data: subscription, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError
    }

    if (!subscription) {
      return res.status(404).json({ error: 'No subscription found' })
    }

    // Remove cancellation
    const { data, error } = await supabase
      .from('subscriptions')
      .update({
        cancel_at_period_end: false,
        updated_at: new Date()
      })
      .eq('id', subscription.id)
      .select()

    if (error) throw error

    res.json({
      success: true,
      message: 'Subscription reactivated',
      subscription: data[0]
    })
  } catch (error) {
    console.error('Reactivate subscription error:', error)
    res.status(500).json({ error: 'Failed to reactivate subscription' })
  }
}

/**
 * Handle Stripe webhook
 * Called when payment succeeds or subscription is created
 */
export const handleWebhook = async (req, res) => {
  try {
    const event = req.body

    // In production, verify webhook signature
    // const sig = req.headers['stripe-signature']
    // const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret)

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutComplete(event.data.object)
        break
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object)
        break
      case 'customer.subscription.deleted':
        await handleSubscriptionCanceled(event.data.object)
        break
    }

    res.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    res.status(400).json({ error: 'Webhook error' })
  }
}

/**
 * Helper: Handle completed checkout
 */
async function handleCheckoutComplete(session) {
  try {
    // Get session details from database
    const { data: sessionData, error: fetchError } = await supabase
      .from('stripe_sessions')
      .select('*')
      .eq('session_id', session.id)
      .single()

    if (fetchError) throw fetchError

    // Create subscription
    const { error } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: sessionData.user_id,
        plan_id: sessionData.plan_id,
        status: 'active',
        stripe_subscription_id: session.subscription,
        current_period_start: new Date(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      })

    if (error) throw error

    // Mark session as completed
    await supabase
      .from('stripe_sessions')
      .update({ status: 'completed' })
      .eq('session_id', session.id)
  } catch (error) {
    console.error('Handle checkout complete error:', error)
  }
}

/**
 * Helper: Handle subscription created
 */
async function handleSubscriptionCreated(subscription) {
  try {
    // Update subscription status
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: 'active',
        updated_at: new Date()
      })
      .eq('stripe_subscription_id', subscription.id)

    if (error) throw error
  } catch (error) {
    console.error('Handle subscription created error:', error)
  }
}

/**
 * Helper: Handle subscription canceled
 */
async function handleSubscriptionCanceled(subscription) {
  try {
    // Update subscription status
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: 'canceled',
        cancel_at_period_end: true,
        updated_at: new Date()
      })
      .eq('stripe_subscription_id', subscription.id)

    if (error) throw error
  } catch (error) {
    console.error('Handle subscription canceled error:', error)
  }
}
