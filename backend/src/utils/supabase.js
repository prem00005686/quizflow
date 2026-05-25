import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Ensure .env is loaded
dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials in .env file. Please set SUPABASE_URL and SUPABASE_KEY.')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
