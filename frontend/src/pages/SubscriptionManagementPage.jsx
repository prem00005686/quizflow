import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSubscriptionStore } from '../store/subscriptionStore'
import MainHeader from '../components/MainHeader'

export default function SubscriptionManagementPage() {
  const {
    userPlan,
    isLoading,
    fetchUserPlan
  } = useSubscriptionStore()
  const navigate = useNavigate()

  useEffect(() => {
    fetchUserPlan()
  }, [])

  const isFree = userPlan?.planId === 'free' || !userPlan?.planId

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <>
      <MainHeader />

      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-gutter py-8 md:py-16 flex flex-col gap-8">
          {/* Header */}
          <section className="flex flex-col gap-2">
            <h2 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl text-on-surface">Your Plan</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Manage your subscription and view your account details</p>
          </section>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {/* Current Plan Card */}
              <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-sm">
                <div className="flex items-start justify-between mb-8 pb-8 border-b border-outline-variant">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: '\'FILL\' 1' }}>
                        {isFree ? 'school' : 'workspace_premium'}
                      </span>
                      <h3 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
                        {isFree ? 'Free Trial' : 'Premium Access'}
                      </h3>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Status: <span className={`font-bold ${isFree ? 'text-on-surface-variant' : 'text-heatmap-active'}`}>
                        {isFree ? 'Limited Access' : 'Full Access Active'}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-stats-number text-stats-number text-primary">
                      {isFree ? '5' : '6000+'}
                    </p>
                    <p className="font-label-md text-label-md text-on-surface-variant">
                      {isFree ? 'questions per topic' : 'total questions available'}
                    </p>
                  </div>
                </div>

                {/* Subscription Details */}
                {!isFree && userPlan && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2">Started</p>
                      <p className="font-body-md text-body-md text-on-surface">{formatDate(userPlan.startDate)}</p>
                    </div>
                    <div>
                      <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2">Renews On</p>
                      <p className="font-body-md text-body-md text-on-surface">{formatDate(userPlan.renewalDate)}</p>
                    </div>
                    <div>
                      <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2">Plan Type</p>
                      <p className="font-body-md text-body-md text-on-surface capitalize">{userPlan.billingCycle}</p>
                    </div>
                  </div>
                )}
              </section>

              {/* Benefits Section */}
              <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-sm">
                <h3 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-6">
                  {isFree ? '🎁 What You Get' : '✨ Your Benefits'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {isFree ? (
                    <>
                      <div className="flex gap-4">
                        <span className="material-symbols-outlined text-heatmap-active text-2xl flex-shrink-0">check_circle</span>
                        <div>
                          <p className="font-body-md text-body-md text-on-surface font-medium">5 Practice Questions</p>
                          <p className="font-label-md text-label-md text-on-surface-variant mt-1">From each topic to explore the platform</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <span className="material-symbols-outlined text-heatmap-active text-2xl flex-shrink-0">check_circle</span>
                        <div>
                          <p className="font-body-md text-body-md text-on-surface font-medium">All Topics Available</p>
                          <p className="font-label-md text-label-md text-on-surface-variant mt-1">Browse and explore all subject categories</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <span className="material-symbols-outlined text-heatmap-active text-2xl flex-shrink-0">check_circle</span>
                        <div>
                          <p className="font-body-md text-body-md text-on-surface font-medium">View Scoring System</p>
                          <p className="font-label-md text-label-md text-on-surface-variant mt-1">Understand how tests are scored</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <span className="material-symbols-outlined text-heatmap-active text-2xl flex-shrink-0">check_circle</span>
                        <div>
                          <p className="font-body-md text-body-md text-on-surface font-medium">No Payment Required</p>
                          <p className="font-label-md text-label-md text-on-surface-variant mt-1">Start learning at no cost</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex gap-4">
                        <span className="material-symbols-outlined text-heatmap-active text-2xl flex-shrink-0" style={{ fontVariationSettings: '\'FILL\' 1' }}>check_circle</span>
                        <div>
                          <p className="font-body-md text-body-md text-on-surface font-medium">6000+ Questions</p>
                          <p className="font-label-md text-label-md text-on-surface-variant mt-1">Access entire question bank</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <span className="material-symbols-outlined text-heatmap-active text-2xl flex-shrink-0" style={{ fontVariationSettings: '\'FILL\' 1' }}>check_circle</span>
                        <div>
                          <p className="font-body-md text-body-md text-on-surface font-medium">Unlimited Tests</p>
                          <p className="font-label-md text-label-md text-on-surface-variant mt-1">Take unlimited practice tests</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <span className="material-symbols-outlined text-heatmap-active text-2xl flex-shrink-0" style={{ fontVariationSettings: '\'FILL\' 1' }}>check_circle</span>
                        <div>
                          <p className="font-body-md text-body-md text-on-surface font-medium">Detailed Analytics</p>
                          <p className="font-label-md text-label-md text-on-surface-variant mt-1">Track detailed learning progress</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <span className="material-symbols-outlined text-heatmap-active text-2xl flex-shrink-0" style={{ fontVariationSettings: '\'FILL\' 1' }}>check_circle</span>
                        <div>
                          <p className="font-body-md text-body-md text-on-surface font-medium">Ad-Free Experience</p>
                          <p className="font-label-md text-label-md text-on-surface-variant mt-1">Learn without any distractions</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <span className="material-symbols-outlined text-heatmap-active text-2xl flex-shrink-0" style={{ fontVariationSettings: '\'FILL\' 1' }}>check_circle</span>
                        <div>
                          <p className="font-body-md text-body-md text-on-surface font-medium">Priority Support</p>
                          <p className="font-label-md text-label-md text-on-surface-variant mt-1">Get help from our support team</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <span className="material-symbols-outlined text-heatmap-active text-2xl flex-shrink-0" style={{ fontVariationSettings: '\'FILL\' 1' }}>check_circle</span>
                        <div>
                          <p className="font-body-md text-body-md text-on-surface font-medium">Custom Learning Path</p>
                          <p className="font-label-md text-label-md text-on-surface-variant mt-1">Personalized recommendations</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </section>

              {/* Actions */}
              <section className="flex gap-4 flex-col sm:flex-row">
                {!isFree && (
                  <button className="btn-3d bg-error text-on-error border-error-container font-label-md text-label-md py-3 px-6 rounded-xl hover:bg-error/90 transition-all">
                    Cancel Subscription
                  </button>
                )}
                <button 
                  onClick={() => navigate('/subscriptions')}
                  className="btn-3d bg-primary text-on-primary border-on-primary-fixed font-label-md text-label-md py-3 px-6 rounded-xl hover:bg-surface-tint transition-all flex-1 sm:flex-none"
                >
                  {isFree ? 'Upgrade to Premium' : 'Manage Plans'}
                </button>
              </section>
            </>
          )}
        </div>
      </main>
    </>
  )
}
