import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function findTable() {
  console.log('Searching for sos_reports table in all visible parts of the database...');
  
  // Try to query from public
  const { error: publicError } = await supabase.from('sos_reports').select('id').limit(1);
  if (publicError) {
    console.log('Public Schema Search:', publicError.message);
  } else {
    console.log('SUCCESS: Table found in public schema!');
    return;
  }

  // Try to use a raw RPC to list tables if possible (requires a function)
  // Since we can't easily do that, we'll try common variations
  const variations = ['SOS_REPORTS', 'SosReports', 'sosReports'];
  for (const v of variations) {
    const { error } = await supabase.from(v).select('id').limit(1);
    if (!error) {
      console.log(`SUCCESS: Table found with name: ${v}`);
      return;
    }
  }
  
  console.log('FAILURE: Table "sos_reports" could not be found anywhere.');
}

findTable();
