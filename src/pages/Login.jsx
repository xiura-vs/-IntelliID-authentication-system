import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
  // State to store form inputs
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  // State to show loading spinner during login
  const [loading, setLoading] = useState(false)
  
  // State to show error messages
  const [error, setError] = useState('')
  
  // Hook to navigate to different pages
  const navigate = useNavigate()

  // Function to handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault() // Prevent page reload
    
    // Clear previous error
    setError('')

    // Start loading state
    setLoading(true)

    try {
      // Call Supabase signInWithPassword function
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })

      // Check if there was an error
      if (error) {
        setError(error.message)
      } else {
        // Success! The session is automatically stored by Supabase
        // Navigate to dashboard
        navigate('/dashboard')
      }
    } catch (err) {
      // Handle any unexpected errors
      setError('An unexpected error occurred. Please try again.')
    } finally {
      // Stop loading state
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">IntelliID</h1>
          <p className="text-gray-600 mt-2">Welcome back! Please login</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Link to Signup */}
        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login