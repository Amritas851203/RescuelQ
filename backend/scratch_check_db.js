import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: './.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log('Checking sos_reports table...');
  const { data, error } = await supabase
    .from('sos_reports')
    .select('id')
    .limit(1);

  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('Success! Table exists. Data:', data);
  }
}

check();
