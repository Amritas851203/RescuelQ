import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumns() {
  console.log('Checking columns in sos_reports...');
  
  // Try to insert a full object. If it fails, the error will tell us which column is missing.
  const fullReport = {
    reporter_name: 'TEST',
    location_lat: 0,
    location_lng: 0,
    message: 'TEST',
    severity: 'High',
    affected_people: 10,
    risk_level: 5
  };

  const { error } = await supabase.from('sos_reports').insert([fullReport]);
  
  if (error) {
    console.error('ERROR:', error.message);
  } else {
    console.log('SUCCESS: All columns exist!');
  }
}

checkColumns();
