import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login, demoLogin } = useAuthStore()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    const result = await login(email, password)
    
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error || 'Login failed. Please check your credentials.')
    }
    
    setLoading(false)
  }

  const handleDemoLogin = async () => {
    setError('')
    setLoading(true)
    
    const result = await demoLogin()
    
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error || 'Demo login failed')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      {/* Simple Header */}
      <header className="flex justify-between items-center px-gutter py-4 border-b border-outline-variant">
        <Link to="/" className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary font-bold">QuizFlow</Link>
        <p className="font-body-md text-body-md text-on-surface-variant">
          New here? <Link to="/signup" className="text-primary font-medium hover:underline">Sign up</Link>
        </p>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-gutter py-16">
        <div className="w-full max-w-md">
          {/* Decorative Element */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full blur-3xl -z-10"></div>
          
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-sm">
            {/* Header */}
            <div className="text-center mb-8">
              <span className="material-symbols-outlined text-5xl text-primary block mb-4">login</span>
              <h1 className="font-headline-lg text-headline-lg-mobile text-on-surface mb-2">Welcome Back</h1>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Login to continue your learning journey
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-error-container text-on-error-container px-4 py-3 rounded-xl flex items-start gap-3">
                <span className="material-symbols-outlined flex-shrink-0 mt-0.5">error</span>
                <p className="font-body-md text-body-md">{error}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email Input */}
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-lg border-2 border-outline-variant bg-surface font-body-md text-body-md text-on-surface placeholder-on-surface-variant/60 transition-colors duration-200 focus:outline-none focus:border-primary focus:bg-surface-container-lowest"
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="font-label-md text-label-md text-on-surface">Password</label>
                  <a href="#forgot" className="font-label-md text-label-md text-primary hover:underline text-sm">Forgot?</a>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg border-2 border-outline-variant bg-surface font-body-md text-body-md text-on-surface placeholder-on-surface-variant/60 transition-colors duration-200 focus:outline-none focus:border-primary focus:bg-surface-container-lowest"
                  required
                />
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-3d w-full bg-primary border-on-primary-fixed text-on-primary font-label-md text-label-md py-3 px-6 rounded-xl hover:bg-surface-tint disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></span>
                    Logging in...
                  </span>
                ) : (
                  'Login'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-outline-variant"></div>
              <span className="font-label-md text-label-md text-on-surface-variant">or</span>
              <div className="flex-1 h-px bg-outline-variant"></div>
            </div>

            {/* Demo Login */}
            <button
              onClick={handleDemoLogin}
              disabled={loading}
              className="btn-3d w-full bg-surface-container border-2 border-outline-variant text-on-surface font-label-md text-label-md py-3 px-6 rounded-xl hover:bg-surface-container-highest disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></span>
                  Loading...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">rocket_launch</span>
                  Try Demo
                </span>
              )}
            </button>
          </div>

          {/* Footer */}
          <p className="text-center font-body-md text-body-md text-on-surface-variant mt-6">
            Don't have an account? <Link to="/signup" className="text-primary font-medium hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
