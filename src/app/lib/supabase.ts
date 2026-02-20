import { createClient } from '@supabase/supabase-js';

// Use environment variables, fallback to hardcoded for Figma compatibility
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kkkcjcqvngyohzhqoanb.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtra2NqY3F2bmd5b2h6aHFvYW5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0NDE2NDIsImV4cCI6MjA4NzAxNzY0Mn0.XIRTDP8569c9yV-HE8ISWIyXYmCEjduRm_nJS3rrDRI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
