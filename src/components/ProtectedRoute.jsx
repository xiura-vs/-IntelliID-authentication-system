import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

// This component protects routes that require authentication
// If user is not logged in, they are redirected to login page
function ProtectedRoute({ children }) {
  // State to store authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(null)

  useEffect(() => {
    // Function to check if user is authenticated
    const checkAuth = async () => {
      // Get the current session from Supabase
      const { data: { session } } = await supabase.auth.getSession()
      
      // Set authentication status based on session
      setIsAuthenticated(!!session)
    }

    // Check authentication on component mount
    checkAuth()

    // Listen for authentication state changes
    // This ensures we update if user logs in/out in another tab
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session)
    })

    // Cleanup subscription on component unmount
    return () => subscription.unsubscribe()
  }, [])

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    )
  }

  // If authenticated, show the protected content
  // If not authenticated, redirect to login page
  return isAuthenticated ? children : <Navigate to="/login" />
}

export default ProtectedRoute