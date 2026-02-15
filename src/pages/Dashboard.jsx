import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  // State to store the current user's information
  const [user, setUser] = useState(null)
  
  // State to show loading spinner while fetching user
  const [loading, setLoading] = useState(true)
  
  // Hook to navigate to different pages
  const navigate = useNavigate()

  // useEffect runs when component loads
  useEffect(() => {
    // Function to get the current logged-in user
    const getUser = async () => {
      // Get the current session from Supabase
      const { data: { session } } = await supabase.auth.getSession()
      
      // If session exists, set the user
      if (session) {
        setUser(session.user)
      } else {
        // If no session, redirect to login
        navigate('/login')
      }
      
      // Stop loading
      setLoading(false)
    }

    // Call the function
    getUser()
  }, [navigate])

  // Function to handle logout
  const handleLogout = async () => {
    // Call Supabase signOut function
    await supabase.auth.signOut()
    
    // Redirect to login page
    navigate('/login')
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Dashboard Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium transition duration-200"
            >
              Logout
            </button>
          </div>

          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-green-800 mb-2">
              ✅ Logged in successfully!
            </h2>
            <p className="text-green-700">
              Welcome to your secure IntelliID dashboard.
            </p>
          </div>

          {/* User Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Your Account Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="text-gray-600 font-medium w-32">Email:</span>
                <span className="text-gray-800">{user?.email}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600 font-medium w-32">User ID:</span>
                <span className="text-gray-800 text-sm">{user?.id}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600 font-medium w-32">Status:</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              🔒 Your Account is Secure
            </h3>
            <p className="text-blue-700">
              This is your protected dashboard. Only authenticated users can access this page.
              Future features like fraud detection and risk analysis will be added here.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard