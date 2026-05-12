import { createClient } from '@supabase/supabase-js';

// Hardcoding these values temporarily to ensure connectivity
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wxshbhibdylevfveamyc.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4c2hiaGliZHlsZXZmdmVhbXljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwNDY1MjEsImV4cCI6MjA5MzYyMjUyMX0.1mET0ZGQYlvZzfpWeWvCAn2dd13AlBPWiXo8vyuGgR8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
