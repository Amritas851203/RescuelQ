import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function listTables() {
  console.log('Listing all tables in public schema...');
  // PostgREST doesn't have a built-in 'list tables' via the client, 
  // so we try to select from likely ones or use an RPC if available.
  // But we can check if we can access the 'sos_reports' table again.
  
  const { data, error } = await supabase
    .from('sos_reports')
    .select('*')
    .limit(1);

  if (error) {
    console.error('SOS_REPORTS ERROR:', error.message);
  } else {
    console.log('SOS_REPORTS SUCCESS: Data found:', data);
  }

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('email')
    .limit(1);

  if (userError) {
    console.error('USERS ERROR:', userError.message);
  } else {
    console.log('USERS SUCCESS: Found email:', userData);
  }
}

listTables();
