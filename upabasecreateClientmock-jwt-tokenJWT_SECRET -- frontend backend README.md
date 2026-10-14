[1mdiff --git a/backend/scripts/diagnostic_user.js b/backend/scripts/diagnostic_user.js[m
[1mdeleted file mode 100644[m
[1mindex 779f96f..0000000[m
[1m--- a/backend/scripts/diagnostic_user.js[m
[1m+++ /dev/null[m
[36m@@ -1,29 +0,0 @@[m
[31m-import { createClient } from '@supabase/supabase-js';[m
[31m-import dotenv from 'dotenv';[m
[31m-dotenv.config();[m
[31m-[m
[31m-const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);[m
[31m-[m
[31m-async function checkUser(email) {[m
[31m-  console.log(`Checking user: ${email}`);[m
[31m-  const { data, error } = await supabase[m
[31m-    .from('users')[m
[31m-    .select('*')[m
[31m-    .eq('email', email)[m
[31m-    .maybeSingle();[m
[31m-[m
[31m-  if (error) {[m
[31m-    console.error('Supabase Error:', error);[m
[31m-  } else if (data) {[m
[31m-    console.log('User found:', {[m
[31m-      id: data.id,[m
[31m-      email: data.email,[m
[31m-      is_verified: data.is_verified,[m
[31m-      created_at: data.created_at[m
[31m-    });[m
[31m-  } else {[m
[31m-    console.log('User NOT found.');[m
[31m-  }[m
[31m-}[m
[31m-[m
[31m-checkUser('aditya.choubey.soe@gmail.com');[m
[1mdiff --git a/backend/scripts/scratch_check_columns.js b/backend/scripts/scratch_check_columns.js[m
[1mdeleted file mode 100644[m
[1mindex e2bb88f..0000000[m
[1m--- a/backend/scripts/scratch_check_columns.js[m
[1m+++ /dev/null[m
[36m@@ -1,33 +0,0 @@[m
[31m-import { createClient } from '@supabase/supabase-js';[m
[31m-import dotenv from 'dotenv';[m
[31m-[m
[31m-dotenv.config({ path: './.env' });[m
[31m-[m
[31m-const supabaseUrl = process.env.SUPABASE_URL;[m
[31m-const supabaseKey = process.env.SUPABASE_ANON_KEY;[m
[31m-const supabase = createClient(supabaseUrl, supabaseKey);[m
[31m-[m
[31m-async function checkColumns() {[m
[31m-  console.log('Checking columns in sos_reports...');[m
[31m-  [m
[31m-  // Try to insert a full object. If it fails, the error will tell us which column is missing.[m
[31m-  const fullReport = {[m
[31m-    reporter_name: 'TEST',[m
[31m-    location_lat: 0,[m
[31m-    location_lng: 0,[m
[31m-    message: 'TEST',[m
[31m-    severity: 'High',[m
[31m-    affected_people: 10,[m
[31m-    risk_level: 5[m
[31m-  };[m
[31m-[m
[31m-  const { error } = await supabase.from('sos_reports').insert([fullReport]);[m
[31m-  [m
[31m-  if (error) {[m
[31m-    console.error('ERROR:', error.message);[m
[31m-  } else {[m
[31m-    console.log('SUCCESS: All columns exist!');[m
[31m-  }[m
[31m-}[m
[31m-[m
[31m-checkColumns();[m
[1mdiff --git a/backend/scripts/scratch_check_db.js b/backend/scripts/scratch_check_db.js[m
[1mdeleted file mode 100644[m
[1mindex b3b990f..0000000[m
[1m--- a/backend/scripts/scratch_check_db.js[m
[1m+++ /dev/null[m
[36m@@ -1,25 +0,0 @@[m
[31m-import { createClient } from '@supabase/supabase-js';[m
[31m-import dotenv from 'dotenv';[m
[31m-import path from 'path';[m
[31m-[m
[31m-dotenv.config({ path: './.env' });[m
[31m-[m
[31m-const supabaseUrl = process.env.SUPABASE_URL;[m
[31m-const supabaseKey = process.env.SUPABASE_ANON_KEY;[m
[31m-const supabase = createClient(supabaseUrl, supabaseKey);[m
[31m-[m
[31m-async function check() {[m
[31m-  console.log('Checking sos_reports table...');[m
[31m-  const { data, error } = await supabase[m
[31m-    .from('sos_reports')[m
[31m-    .select('id')[m
[31m-    .limit(1);[m
[31m-[m
[31m-  if (error) {[m
[31m-    console.error('Error:', error.message);[m
[31m-  } else {[m
[31m-    console.log('Success! Table exists. Data:', data);[m
[31m-  }[m
[31m-}[m
[31m-[m
[31m-check();[m
[1mdiff --git a/backend/scripts/scratch_deep_search.js b/backend/scripts/scratch_deep_search.js[m
[1mdeleted file mode 100644[m
[1mindex 0eedd9b..0000000[m
[1m--- a/backend/scripts/scratch_deep_search.js[m
[1m+++ /dev/null[m
[36m@@ -1,36 +0,0 @@[m
[31m-import { createClient } from '@supabase/supabase-js';[m
[31m-import dotenv from 'dotenv';[m
[31m-[m
[31m-dotenv.config({ path: './.env' });[m
[31m-[m
[31m-const supabaseUrl = process.env.SUPABASE_URL;[m
[31m-const supabaseKey = process.env.SUPABASE_ANON_KEY;[m
[31m-const supabase = createClient(supabaseUrl, supabaseKey);[m
[31m-[m
[31m-async function findTable() {[m
[31m-  console.log('Searching for sos_reports table in all visible parts of the database...');[m
[31m-  [m
[31m-  // Try to query from public[m
[31m-  const { error: publicError } = await supabase.from('sos_reports').select('id').limit(1);[m
[31m-  if (publicError) {[m
[31m-    console.log('Public Schema Search:', publicError.message);[m
[31m-  } else {[m
[31m-    console.log('SUCCESS: Table found in public schema!');[m
[31m-    return;[m
[31m-  }[m
[31m-[m
[31m-  // Try to use a raw RPC to list tables if possible (requires a function)[m
[31m-  // Since we can't easily do that, we'll try common variations[m
[31m-  const variations = ['SOS_REPORTS', 'SosReports', 'sosReports'];[m
[31m-  for (const v of variations) {[m
[31m-    const { error } = await supabase.from(v).select('id').limit(1);[m
[31m-    if (!error) {[m
[31m-      console.log(`SUCCESS: Table found with name: ${v}`);[m
[31m-      return;[m
[31m-    }[m
[31m-  }[m
[31m-  [m
[31m-  console.log('FAILURE: Table "sos_reports" could not be found anywhere.');[m
[31m-}[m
[31m-[m
[31m-findTable();[m
[1mdiff --git a/backend/scripts/scratch_list_tables.js b/backend/scripts/scratch_list_tables.js[m
[1mdeleted file mode 100644[m
[1mindex dfd2e9d..0000000[m
[1m--- a/backend/scripts/scratch_list_tables.js[m
[1m+++ /dev/null[m
[36m@@ -1,39 +0,0 @@[m
[31m-import { createClient } from '@supabase/supabase-js';[m
[31m-import dotenv from 'dotenv';[m
[31m-[m
[31m-dotenv.config({ path: './.env' });[m
[31m-[m
[31m-const supabaseUrl = process.env.SUPABASE_URL;[m
[31m-const supabaseKey = process.env.SUPABASE_ANON_KEY;[m
[31m-const supabase = createClient(supabaseUrl, supabaseKey);[m
[31m-[m
[31m-async function listTables() {[m
[31m-  console.log('Listing all tables in public schema...');[m
[31m-  // PostgREST doesn't have a built-in 'list tables' via the client, [m
[31m-  // so we try to select from likely ones or use an RPC if available.[m
[31m-  // But we can check if we can access the 'sos_reports' table again.[m
[31m-  [m
[31m-  const { data, error } = await supabase[m
[31m-    .from('sos_reports')[m
[31m-    .select('*')[m
[31m-    .limit(1);[m
[31m-[m
[31m-  if (error) {[m
[31m-    console.error('SOS_REPORTS ERROR:', error.message);[m
[31m-  } else {[m
[31m-    console.log('SOS_REPORTS SUCCESS: Data found:', data);[m
[31m-  }[m
[31m-[m
[31m-  const { data: userData, error: userError } = await supabase[m
[31m-    .from('users')[m
[31m-    .select('email')[m
[31m-    .limit(1);[m
[31m-[m
[31m-  if (userError) {[m
[31m-    console.error('USERS ERROR:', userError.message);[m
[31m-  } else {[m
[31m-    console.log('USERS SUCCESS: Found email:', userData);[m
[31m-  }[m
[31m-}[m
[31m-[m
[31m-listTables();[m
[1mdiff --git a/backend/scripts/scratch_test_insert.js b/backend/scripts/scratch_test_insert.js[m
[1mdeleted file mode 100644[m
[1mindex 4a2a2df..0000000[m
[1m--- a/backend/scripts/scratch_test_insert.js[m
[1m+++ /dev/null[m
[36m@@ -1,34 +0,0 @@[m
[31m-import { createClient } from '@supabase/supabase-js';[m
[31m-import dotenv from 'dotenv';[m
[31m-[m
[31m-dotenv.config({ path: './.env' });[m
[31m-[m
[31m-const supabaseUrl = process.env.SUPABASE_URL;[m
[31m-const supabaseKey = process.env.SUPABASE_ANON_KEY;[m
[31m-const supabase = createClient(supabaseUrl, supabaseKey);[m
[31m-[m
[31m-async function testInsert() {[m
[31m-  console.log('Attempting dummy insert into sos_reports...');[m
[31m-  [m
[31m-  const dummy = {[m
[31m-    reporter_name: 'TEST_AGENT',[m
[31m-    location_lat: 0,[m
[31m-    location_lng: 0,[m
[31m-    message: 'TEST_MESSAGE'[m
[31m-  };[m
[31m-[m
[31m-  const { data, error } = await supabase[m
[31m-    .from('sos_reports')[m
[31m-    .insert([dummy])[m
[31m-    .select();[m
[31m-[m
[31m-  if (error) {[m
[31m-    console.error('INSERT ERROR CODE:', error.code);[m
[31m-    console.error('INSERT ERROR MESSAGE:', error.message);[m
[31m-    console.error('INSERT ERROR DETAILS:', error.details);[m
[31m-  } else {[m
[31m-    console.log('SUCCESS: Table found and record inserted!', data);[m
[31m-  }[m
[31m-}[m
[31m-[m
[31m-testInsert();[m
