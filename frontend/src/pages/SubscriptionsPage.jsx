import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSubscriptionStore } from '../store/subscriptionStore'
import MainHeader from '../components/MainHeader'

export default function SubscriptionsPage() {
  const {
    plans,
    userPlan,
    isLoading,
    error,
    billingCycle,
    fetchPlans,
    fetchUserPlan,
    checkout,
    clearError,
    setBillingCycle
  } = useSubscriptionStore()

  const [selectedPlan, setSelectedPlan] = useState(null)

  useEffect(() => {
    fetchPlans()
    fetchUserPlan()
  }, [])

  const handleSelectPlan = async (planId) => {
    if (planId === userPlan?.planId) {
      return // Already on this plan
    }
    
    setSelectedPlan(planId)
    await checkout(planId, billingCycle)
    setSelectedPlan(null)
  }

  return (
    <>
      <MainHeader />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-gutter py-8 md:py-16">
          {/* Error Message */}
          {error && (
            <div className="mb-8 bg-error-container text-on-error-container px-6 py-4 rounded-2xl flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined">error</span>
                <p className="font-body-md text-body-md">{error}</p>
              </div>
              <button onClick={clearError} className="text-on-error-container hover:opacity-80">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          )}

          {/* Hero Section */}
          <section className="mb-20 relative">
            <div className="absolute -top-32 -left-40 w-96 h-96 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full blur-3xl -z-10"></div>
            <div className="text-center">
              <h1 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl text-on-surface mb-4">Unlock Unlimited Learning</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-8">
                Get access to 6000+ practice questions, unlimited tests, and detailed analytics to master competitive exams
              </p>
            </div>
          </section>

          {/* Billing Cycle Toggle */}
          <section className="flex justify-center gap-4 mb-16">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-3 rounded-xl font-label-md text-label-md transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container border border-outline-variant text-on-surface'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-3 rounded-xl font-label-md text-label-md transition-all relative ${
                billingCycle === 'yearly'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container border border-outline-variant text-on-surface'
              }`}
            >
              Yearly
              {billingCycle === 'yearly' && (
                <span className="absolute -top-3 -right-3 bg-error text-on-error text-xs font-bold px-2 py-1 rounded-full">-25%</span>
              )}
            </button>
          </section>

          {/* Free Trial Card */}
          <section className="mb-16 bg-surface-container-lowest border border-outline-variant rounded-2xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <span className="material-symbols-outlined text-3xl text-primary" style={{ fontVariationSettings: '\'FILL\' 1' }}>school</span>
              <div>
                <h2 className="font-headline-lg text-headline-lg-mobile text-on-surface">Free Trial</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Get started for free with limited access</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-heatmap-active">check_circle</span>
                <span className="font-body-md text-body-md text-on-surface">5 questions per topic</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-heatmap-active">check_circle</span>
                <span className="font-body-md text-body-md text-on-surface">All subjects available</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-heatmap-active">check_circle</span>
                <span className="font-body-md text-body-md text-on-surface">View scoring system</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-heatmap-active">check_circle</span>
                <span className="font-body-md text-body-md text-on-surface">No payment required</span>
              </div>
            </div>
          </section>

          {/* Premium Plans */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <section className="mb-16">
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-8 text-center">Premium Plans</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {plans && plans.filter(p => p.id !== 'free').map((plan) => (
                  <div
                    key={plan.id}
                    className={`bg-surface-container-lowest border-2 rounded-2xl p-8 transition-all ${
                      userPlan?.planId === plan.id
                        ? 'border-primary ring-2 ring-primary ring-opacity-50'
                        : 'border-outline-variant hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-headline-lg text-headline-lg-mobile text-on-surface">{plan.name}</h3>
                        <p className="font-body-md text-body-md text-on-surface-variant mt-1">{plan.description}</p>
                      </div>
                      {userPlan?.planId === plan.id && (
                        <span className="bg-heatmap-active text-on-primary px-3 py-1 rounded-full font-label-md text-label-md">Current</span>
                      )}
                    </div>

                    <div className="mb-6 py-4 border-t border-b border-outline-variant">
                      <p className="font-stats-number text-stats-number text-primary">
                        ${billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice}
                      </p>
                      <p className="font-label-md text-label-md text-on-surface-variant">
                        per {billingCycle === 'yearly' ? 'year' : 'month'}
                      </p>
                    </div>

                    <div className="space-y-3 mb-8">
                      {(plan.features || []).map((feature, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="material-symbols-outlined text-heatmap-active text-sm mt-0.5">check_circle</span>
                          <span className="font-label-md text-label-md text-on-surface-variant">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => handleSelectPlan(plan.id)}
                      disabled={userPlan?.planId === plan.id || selectedPlan === plan.id}
                      className="btn-3d w-full bg-primary border-on-primary-fixed text-on-primary font-label-md text-label-md py-3 rounded-xl hover:bg-surface-tint disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {userPlan?.planId === plan.id ? 'Your Current Plan' : selectedPlan === plan.id ? 'Processing...' : 'Choose Plan'}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Features Section */}
          <section className="mb-16">
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-12 text-center">Why Go Premium?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
              {/* 6000+ Questions */}
              <div className="md:col-span-2 bg-surface-container-low border border-outline-variant rounded-2xl p-8 flex flex-col justify-between">
                <div>
                  <span className="material-symbols-outlined text-4xl text-primary mb-4 block" style={{ fontVariationSettings: '\'FILL\' 1' }}>library_books</span>
                  <h3 className="font-headline-lg text-headline-lg-mobile text-on-surface">6000+ Questions</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-2">Access entire question bank covering all topics</p>
                </div>
              </div>

              {/* Detailed Analytics */}
              <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-8 flex flex-col justify-between">
                <div>
                  <span className="material-symbols-outlined text-4xl text-secondary mb-4 block" style={{ fontVariationSettings: '\'FILL\' 1' }}>analytics</span>
                  <h3 className="font-headline-lg text-headline-lg-mobile text-on-surface">Analytics</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-2">Track your progress with detailed reports</p>
                </div>
              </div>

              {/* Unlimited Tests */}
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-8 flex flex-col justify-between">
                <div>
                  <span className="material-symbols-outlined text-4xl text-primary mb-4 block" style={{ fontVariationSettings: '\'FILL\' 1' }}>schedule</span>
                  <h3 className="font-headline-lg text-headline-lg-mobile text-on-surface">Unlimited Tests</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-2">Practice with unlimited timed tests</p>
                </div>
              </div>

              {/* Ad-Free */}
              <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-8 flex flex-col justify-between">
                <div>
                  <span className="material-symbols-outlined text-4xl text-heatmap-active mb-4 block" style={{ fontVariationSettings: '\'FILL\' 1' }}>done_all</span>
                  <h3 className="font-headline-lg text-headline-lg-mobile text-on-surface">Ad-Free</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-2">Learn without any distractions</p>
                </div>
              </div>

              {/* Priority Support */}
              <div className="md:col-span-2 bg-surface-container-low border border-outline-variant rounded-2xl p-8 flex flex-col justify-between">
                <div>
                  <span className="material-symbols-outlined text-4xl text-tertiary mb-4 block" style={{ fontVariationSettings: '\'FILL\' 1' }}>support_agent</span>
                  <h3 className="font-headline-lg text-headline-lg-mobile text-on-surface">Priority Support</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-2">Get help from our support team whenever you need it</p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="max-w-4xl mx-auto">
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-8 text-center">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              {[
                {
                  q: 'Can I cancel anytime?',
                  a: 'Yes, you can cancel your subscription at any time without any penalties.'
                },
                {
                  q: 'What payment methods do you accept?',
                  a: 'We accept all major credit cards, debit cards, and digital wallets.'
                },
                {
                  q: 'Is there a money-back guarantee?',
                  a: '7-day money-back guarantee if you\'re not satisfied with the service.'
                }
              ].map((faq, i) => (
                <div key={i} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6">
                  <h4 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-2">{faq.q}</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
