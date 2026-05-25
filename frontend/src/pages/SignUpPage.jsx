import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { register } = useAuthStore()
  const navigate = useNavigate()

  const handleSignUp = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!email || !password || !displayName) {
      setError('All fields are required')
      return
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    
    setLoading(true)
    const result = await register(email, password, displayName)
    
    if (result.success) {
      navigate('/login')
    } else {
      setError(result.error || 'Sign up failed')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      {/* Simple Header */}
      <header className="flex justify-between items-center px-gutter py-4 border-b border-outline-variant">
        <Link to="/" className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary font-bold">QuizFlow</Link>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Login</Link>
        </p>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-gutter py-16">
        <div className="w-full max-w-md">
          {/* Decorative Element */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-full blur-3xl -z-10"></div>
          
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-sm">
            {/* Header */}
            <div className="text-center mb-8">
              <span className="material-symbols-outlined text-5xl text-secondary block mb-4">person_add</span>
              <h1 className="font-headline-lg text-headline-lg-mobile text-on-surface mb-2">Join QuizFlow</h1>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Master competitive exams with 6000+ questions
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-error-container text-on-error-container px-4 py-3 rounded-xl flex items-start gap-3">
                <span className="material-symbols-outlined flex-shrink-0 mt-0.5">error</span>
                <p className="font-body-md text-body-md">{error}</p>
              </div>
            )}

            {/* Sign Up Form */}
            <form onSubmit={handleSignUp} className="space-y-5">
              {/* Full Name Input */}
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-2">Full Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-lg border-2 border-outline-variant bg-surface font-body-md text-body-md text-on-surface placeholder-on-surface-variant/60 transition-colors duration-200 focus:outline-none focus:border-secondary focus:bg-surface-container-lowest"
                  required
                />
              </div>

              {/* Email Input */}
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-lg border-2 border-outline-variant bg-surface font-body-md text-body-md text-on-surface placeholder-on-surface-variant/60 transition-colors duration-200 focus:outline-none focus:border-secondary focus:bg-surface-container-lowest"
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg border-2 border-outline-variant bg-surface font-body-md text-body-md text-on-surface placeholder-on-surface-variant/60 transition-colors duration-200 focus:outline-none focus:border-secondary focus:bg-surface-container-lowest"
                  required
                />
              </div>

              {/* Confirm Password Input */}
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg border-2 border-outline-variant bg-surface font-body-md text-body-md text-on-surface placeholder-on-surface-variant/60 transition-colors duration-200 focus:outline-none focus:border-secondary focus:bg-surface-container-lowest"
                  required
                />
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  className="w-4 h-4 mt-1 accent-secondary rounded"
                  required
                />
                <label htmlFor="terms" className="font-label-md text-label-md text-on-surface-variant">
                  I agree to the{' '}
                  <a href="#terms" className="text-secondary hover:underline">terms and conditions</a> and{' '}
                  <a href="#privacy" className="text-secondary hover:underline">privacy policy</a>
                </label>
              </div>

              {/* Sign Up Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-3d w-full bg-secondary border-on-secondary text-on-secondary font-label-md text-label-md py-3 px-6 rounded-xl hover:bg-surface-tint disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></span>
                    Creating Account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-outline-variant"></div>
              <span className="font-label-md text-label-md text-on-surface-variant">or</span>
              <div className="flex-1 h-px bg-outline-variant"></div>
            </div>

            {/* Free Trial Info */}
            <div className="bg-surface-container-highest border border-outline-variant rounded-xl p-4 text-center">
              <p className="font-label-md text-label-md text-on-surface-variant">
                <span className="text-secondary font-medium">Get 5 free questions</span> from each topic when you sign up
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center font-body-md text-body-md text-on-surface-variant mt-6">
            Already have an account? <Link to="/login" className="text-secondary font-medium hover:underline">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
