// Import the Supabase client library
import { createClient } from '@supabase/supabase-js'

// Get the Supabase URL from environment variables
// VITE_ prefix is required for Vite to expose these variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

// Get the Supabase anonymous key from environment variables
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create and export the Supabase client instance
// This will be used throughout the app to interact with Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)