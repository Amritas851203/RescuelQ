import { supabase } from './src/config/supabase.js';

async function checkUser() {
  const email = 'amritasingh38381@gmail.com';
  console.log(`Checking user: ${email}`);
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
    
  if (error) {
    console.error('User search error:', error.message);
    if (error.code === 'PGRST116') {
      console.log('User not found.');
    }
  } else {
    console.log('User found:', {
      id: data.id,
      email: data.email,
      is_verified: data.is_verified,
      has_password_hash: !!data.password_hash
    });
  }
}

checkUser();
