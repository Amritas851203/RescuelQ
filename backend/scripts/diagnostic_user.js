import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function checkUser(email) {
  console.log(`Checking user: ${email}`);
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .maybeSingle();

  if (error) {
    console.error('Supabase Error:', error);
  } else if (data) {
    console.log('User found:', {
      id: data.id,
      email: data.email,
      is_verified: data.is_verified,
      created_at: data.created_at
    });
  } else {
    console.log('User NOT found.');
  }
}

checkUser('aditya.choubey.soe@gmail.com');
