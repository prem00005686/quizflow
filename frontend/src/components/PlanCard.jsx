import { motion } from 'framer-motion'

/**
 * PlanCard Component
 * Displays individual subscription plan with features and pricing
 */
export default function PlanCard({
  plan,
  isCurrentPlan = false,
  billingCycle = 'monthly',
  onSelect = () => {},
  isLoading = false
}) {
  const getPrice = () => {
    if (plan.price === 0) return 'Free'
    if (billingCycle === 'yearly') {
      return `₹${plan.priceYearly}/year`
    }
    return `₹${plan.priceMonthly}/month`
  }

  const getPricePerMonth = () => {
    if (billingCycle === 'yearly') {
      return Math.round(plan.priceYearly / 12)
    }
    return plan.priceMonthly
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { scale: 1.02, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className={`relative rounded-2xl overflow-hidden transition-all ${
        isCurrentPlan
          ? 'ring-2 ring-primary shadow-2xl'
          : 'shadow-lg'
      } ${
        plan.id === 'premium'
          ? 'md:scale-105 bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/5 dark:to-secondary/5'
          : 'bg-white dark:bg-gray-800'
      }`}
    >
      {/* Badge for featured plan */}
      {plan.id === 'premium' && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-primary to-secondary text-white px-4 py-1 text-sm font-bold rounded-bl-lg">
          Most Popular
        </div>
      )}

      {/* Card content */}
      <div className="p-8 h-full flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {plan.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {plan.description}
          </p>
        </div>

        {/* Pricing */}
        <div className="mb-6">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-primary">
              {plan.price === 0 ? '₹0' : (billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly)}
            </span>
            {plan.price > 0 && (
              <span className="text-gray-600 dark:text-gray-400">
                {billingCycle === 'yearly' ? '/year' : '/month'}
              </span>
            )}
          </div>
          
          {plan.price > 0 && billingCycle === 'yearly' && (
            <p className="text-sm text-success mt-2">
              ₹{Math.round(plan.priceYearly / 12)}/month when paid yearly<br/>
              <span className="text-xs">Save ₹{(plan.priceMonthly * 12) - plan.priceYearly} annually</span>
            </p>
          )}
          
          {plan.price === 0 && (
            <p className="text-sm text-success mt-2">
              Always free. No credit card needed.
            </p>
          )}
        </div>

        {/* CTA Button */}
        <button
          onClick={() => onSelect(plan.id)}
          disabled={isLoading || isCurrentPlan}
          className={`w-full py-3 rounded-lg font-semibold mb-6 transition-all ${
            isCurrentPlan
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-default'
              : plan.id === 'premium'
              ? 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:scale-105'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-primary/10 dark:hover:bg-primary/20'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            'Processing...'
          ) : isCurrentPlan ? (
            '✓ Your Current Plan'
          ) : plan.id === 'free' ? (
            'Start Free Trial'
          ) : (
            `Upgrade Now - ₹${billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly}`
          )}
        </button>

        {/* Current status badge */}
        {isCurrentPlan && (
          <div className="mb-6 p-3 bg-success/10 rounded-lg text-center">
            <p className="text-sm font-semibold text-success">✓ Your Current Plan</p>
          </div>
        )}

        {/* Features list */}
        <div className="space-y-3 flex-1">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
            What's included
          </p>
          <ul className="space-y-2">
            {plan.features.map((feature, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-700 dark:text-gray-300">
                <span className="text-success mt-0.5">✓</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          {/* Limitations */}
          {plan.limitations && plan.limitations.length > 0 && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-2">
                Not included
              </p>
              <ul className="space-y-2">
                {plan.limitations.map((limitation, i) => (
                  <li key={i} className="flex gap-3 text-sm text-gray-500 dark:text-gray-400">
                    <span>✗</span>
                    <span>{limitation}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
