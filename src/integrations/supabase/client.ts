
import { createClient } from '@supabase/supabase-js';
import { Tables } from './database.types';

// Supabase client setup
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are defined
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Make sure environment variables are properly configured.');
}

export const supabase = createClient<{
  Tables: Tables;
}>(
  supabaseUrl || 'https://glzcadfvlvmvcexwibap.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsemNhZGZ2bHZtdmNleHdpYmFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2MjU3MjksImV4cCI6MjA1OTIwMTcyOX0.iFbk_Q4QVh6k2_VihLd2kxa5jaAxCfImZaeb2AocwqQ'
);

export default supabase;
