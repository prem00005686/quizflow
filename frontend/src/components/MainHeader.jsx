import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

const NAV_ITEMS = [
  { label: 'Home', to: '/' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Practice', to: '/test' },
  { label: 'Store', to: '/subscriptions' }
]

export default function MainHeader() {
  const location = useLocation()
  const { isAuthenticated, user } = useAuthStore()

  const displayInitial = user?.user_metadata?.display_name?.charAt(0)
    || user?.email?.charAt(0)
    || 'U'

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-gutter py-4 bg-surface/80 backdrop-blur-md border-b border-outline-variant">
      <div className="flex items-center gap-8">
        <Link to="/" className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary font-bold tracking-tight">
          QuizFlow
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.to
            return (
              <Link
                key={item.to}
                className={active
                  ? 'text-primary border-b-2 border-primary font-bold pb-1 font-label-md text-label-md hover:text-primary transition-colors duration-200'
                  : 'text-on-surface-variant font-medium font-label-md text-label-md hover:text-primary transition-colors duration-200'}
                to={item.to}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <button aria-label="Current Streak" className="text-streak-flame hover:scale-110 transition-transform duration-150 flex items-center gap-1">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: '\'FILL\' 1' }}>local_fire_department</span>
              <span className="font-stats-number text-stats-number text-on-surface text-lg">12</span>
            </button>
            <button className="text-on-surface-variant hover:text-primary transition-colors duration-200">
              <span className="material-symbols-outlined">military_tech</span>
            </button>
            <Link to="/dashboard" className="w-10 h-10 rounded-full bg-surface-variant border border-outline-variant flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 ring-primary transition-all">
              <span className="font-bold text-on-surface-variant">{displayInitial}</span>
            </Link>
          </>
        ) : (
          <div className="flex gap-3">
            <Link to="/login" className="text-on-surface-variant font-medium font-label-md text-label-md hover:text-primary transition-colors duration-200">Log in</Link>
            <Link to="/signup" className="text-primary font-medium font-label-md text-label-md hover:text-primary transition-colors duration-200">Sign up</Link>
          </div>
        )}

        <button className="md:hidden text-on-surface">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>
    </header>
  )
}