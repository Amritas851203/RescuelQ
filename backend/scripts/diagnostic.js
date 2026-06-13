import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log('Connecting to:', supabaseUrl);
  
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .limit(1);

  if (error) {
    console.log('Error accessing users table:', error.code, error.message);
    if (error.code === '42P01') {
      console.log('CONFIRMED: The "users" table does not exist in the public schema of this project.');
    }
  } else {
    console.log('SUCCESS: "users" table found and accessible.');
  }

  // List all tables in public schema
  const { data: tables, error: tableError } = await supabase
    .rpc('get_tables'); // This might not work if RPC is not set up
    
  if (tableError) {
    // Alternative: try to select from a non-existent table to see the error format
    const { error: testError } = await supabase.from('random_table_123').select('*');
    console.log('Test error for non-existent table:', testError?.code);
  }
}

check();
