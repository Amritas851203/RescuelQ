import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  console.log('Attempting dummy insert into sos_reports...');
  
  const dummy = {
    reporter_name: 'TEST_AGENT',
    location_lat: 0,
    location_lng: 0,
    message: 'TEST_MESSAGE'
  };

  const { data, error } = await supabase
    .from('sos_reports')
    .insert([dummy])
    .select();

  if (error) {
    console.error('INSERT ERROR CODE:', error.code);
    console.error('INSERT ERROR MESSAGE:', error.message);
    console.error('INSERT ERROR DETAILS:', error.details);
  } else {
    console.log('SUCCESS: Table found and record inserted!', data);
  }
}

testInsert();
