import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('WARNING: SUPABASE_URL or SUPABASE_ANON_KEY not set. Supabase features will not work.');
}

// Public client (read-only, uses anon key with RLS)
export const supabase = createClient(
    supabaseUrl || '',
    supabaseAnonKey || ''
);

// Admin client (bypasses RLS, uses service role key — for admin CRUD only)
export const supabaseAdmin = createClient(
    supabaseUrl || '',
    supabaseServiceKey || supabaseAnonKey || ''
);
