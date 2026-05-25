import { Link, Navigate } from 'react-router-dom'
import { useMcqStore } from '../store/mcqStore'

export default function ResultsPage() {
  const { results, resetTest } = useMcqStore()

  if (!results) {
    return <Navigate to="/dashboard" />
  }

  const percentage = Math.round((results.correct / results.total) * 100)

  // Determine performance level
  const getPerformanceLevel = (score) => {
    if (score >= 90) return { level: 'Excellent', icon: 'trophy', color: 'text-heatmap-active' }
    if (score >= 75) return { level: 'Good', icon: 'thumb_up', color: 'text-tertiary' }
    if (score >= 60) return { level: 'Fair', icon: 'auto_awesome', color: 'text-secondary' }
    return { level: 'Keep Practicing', icon: 'trending_up', color: 'text-tertiary' }
  }

  const performance = getPerformanceLevel(percentage)

  return (
    <>
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-gutter py-4 bg-surface/80 backdrop-blur-md border-b border-outline-variant">
        <div className="flex items-center gap-8">
          <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary font-bold tracking-tight">QuizFlow</h1>
          <nav className="hidden md:flex items-center gap-6">
            <Link className="text-on-surface-variant font-medium font-label-md text-label-md hover:text-primary transition-colors duration-200" to="/">Home</Link>
            <Link className="text-on-surface-variant font-medium font-label-md text-label-md hover:text-primary transition-colors duration-200" to="/dashboard">Dashboard</Link>
            <Link className="text-primary border-b-2 border-primary font-bold pb-1 font-label-md text-label-md hover:text-primary transition-colors duration-200" to="/test">Practice</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-primary hover:text-primary transition-colors duration-200 p-2 rounded-full hover:bg-surface-container flex items-center justify-center">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: '\'FILL\' 1' }}>local_fire_department</span>
          </button>
          <button className="text-primary hover:text-primary transition-colors duration-200 p-2 rounded-full hover:bg-surface-container flex items-center justify-center">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: '\'FILL\' 1' }}>military_tech</span>
          </button>
          <Link to="/dashboard" className="w-10 h-10 rounded-full bg-surface-variant border border-outline-variant flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 ring-primary transition-all">
            <span className="font-bold text-on-surface-variant">P</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-gutter py-8 md:py-16 flex flex-col gap-8">
          {/* Score Card */}
          <section className="bg-surface-container-lowest border-2 border-heatmap-active rounded-2xl p-12 shadow-sm relative overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-heatmap-active/10 to-transparent pointer-events-none"></div>
            
            <div className="relative flex flex-col items-center justify-center text-center">
              {/* Trophy Icon */}
              <div className="w-24 h-24 rounded-full bg-heatmap-active/20 flex items-center justify-center mb-6">
                <span className={`material-symbols-outlined text-5xl ${performance.color}`} style={{ fontVariationSettings: '\'FILL\' 1' }}>
                  {performance.icon}
                </span>
              </div>

              {/* Performance Level */}
              <p className="font-label-md text-label-md text-heatmap-active uppercase tracking-wider mb-2">
                {performance.level}
              </p>

              {/* Score */}
              <h1 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl text-on-surface mb-2">
                Test Completed!
              </h1>

              {/* Percentage */}
              <div className="flex items-end justify-center gap-2 mb-8">
                <span className="font-stats-number text-7xl leading-none text-heatmap-active">{percentage}</span>
                <span className="font-headline-lg text-headline-lg text-on-surface-variant mb-2">%</span>
              </div>

              {/* Results Summary */}
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md mb-8">
                You answered <span className="font-bold text-on-surface">{results.correct}</span> out of <span className="font-bold text-on-surface">{results.total}</span> questions correctly
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="btn-3d bg-surface-container border-2 border-outline-variant text-on-surface font-label-md text-label-md px-8 py-3 rounded-xl hover:bg-surface-container-highest transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm">review</span>
                  <span>Review Answers</span>
                </button>
                <Link 
                  to="/dashboard" 
                  onClick={resetTest}
                  className="btn-3d bg-primary border-on-primary-fixed text-on-primary font-label-md text-label-md px-8 py-3 rounded-xl hover:bg-surface-tint transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">home</span>
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </section>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* XP Gained */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-on-surface-variant mb-4">
                <span className="material-symbols-outlined text-xp-bar-fill text-lg" style={{ fontVariationSettings: '\'FILL\' 1' }}>star</span>
                <span className="font-label-md text-label-md">XP Earned</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-stats-number text-stats-number text-xp-bar-fill">+{percentage * 10}</span>
                <span className="font-label-md text-label-md text-on-surface-variant">experience points</span>
              </div>
            </div>

            {/* Time Taken */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-on-surface-variant mb-4">
                <span className="material-symbols-outlined text-tertiary text-lg">timer</span>
                <span className="font-label-md text-label-md">Time Taken</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-stats-number text-stats-number text-tertiary">18:45</span>
                <span className="font-label-md text-label-md text-on-surface-variant">minutes</span>
              </div>
            </div>

            {/* Accuracy */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-on-surface-variant mb-4">
                <span className="material-symbols-outlined text-heatmap-active text-lg" style={{ fontVariationSettings: '\'FILL\' 1' }}>check_circle</span>
                <span className="font-label-md text-label-md">Accuracy</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-stats-number text-stats-number text-heatmap-active">{results.correct}</span>
                <span className="font-label-md text-label-md text-on-surface-variant">of {results.total} correct</span>
              </div>
            </div>
          </div>

          {/* Question Breakdown */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8">
            <h2 className="font-headline-lg text-headline-lg-mobile text-on-surface mb-6">Question Breakdown</h2>
            
            <div className="space-y-4">
              {/* Correct */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <span className="font-body-md text-body-md text-on-surface">Correct Answers</span>
                    <span className="font-label-md text-label-md text-heatmap-active font-bold">{results.correct}</span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-heatmap-active h-full rounded-full transition-all duration-500"
                      style={{ width: `${(results.correct / results.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Incorrect */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <span className="font-body-md text-body-md text-on-surface">Incorrect Answers</span>
                    <span className="font-label-md text-label-md text-error font-bold">{results.total - results.correct}</span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-error h-full rounded-full transition-all duration-500"
                      style={{ width: `${((results.total - results.correct) / results.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Next Steps */}
          <section className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-8">
            <h2 className="font-headline-lg text-headline-lg-mobile text-on-surface mb-4">What's Next?</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              Great effort! Review your answers to understand concepts better, or take another test to improve your score.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/test"
                className="btn-3d bg-primary border-on-primary-fixed text-on-primary font-label-md text-label-md px-6 py-3 rounded-xl hover:bg-surface-tint transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">restart_alt</span>
                Take Another Test
              </Link>
              <Link 
                to="/dashboard"
                className="btn-3d bg-surface-container border-2 border-outline-variant text-on-surface font-label-md text-label-md px-6 py-3 rounded-xl hover:bg-surface-container-highest transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">analytics</span>
                View Analytics
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
