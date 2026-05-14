# RescueIQ Supabase Schema

Run the following SQL in your Supabase SQL Editor. This script is designed to be **idempotent**, meaning you can run it multiple times without causing errors (it checks if tables/policies already exist).

```sql
-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create OTPs Table
CREATE TABLE IF NOT EXISTS public.otps (
  email TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create SOS Reports Table
CREATE TABLE IF NOT EXISTS public.sos_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_name TEXT,
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  message TEXT,
  severity TEXT DEFAULT 'pending',
  affected_people INTEGER DEFAULT 0,
  risk_level INTEGER DEFAULT 5,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sos_reports ENABLE ROW LEVEL SECURITY;

-- 6. Create Idempotent Policies (Check if exists before creating)
DO $$ 
BEGIN
    -- Users Policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public profiles are viewable by everyone.' AND tablename = 'users') THEN
        CREATE POLICY "Public profiles are viewable by everyone." ON public.users FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own profile.' AND tablename = 'users') THEN
        CREATE POLICY "Users can insert their own profile." ON public.users FOR INSERT WITH CHECK (true);
    END IF;

    -- SOS Reports Policies (Allow all for development)
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access' AND tablename = 'sos_reports') THEN
        CREATE POLICY "Allow public read access" ON public.sos_reports FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public insert' AND tablename = 'sos_reports') THEN
        CREATE POLICY "Allow public insert" ON public.sos_reports FOR INSERT WITH CHECK (true);
    END IF;
END $$;

-- 7. Safely Enable Realtime
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    -- Check if table already in publication to avoid error
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'sos_reports') THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.sos_reports;
    END IF;
  ELSE
    CREATE PUBLICATION supabase_realtime FOR TABLE public.sos_reports;
  END IF;
END $$;
```

> [!TIP]
> If you still see "already exists" errors, you can safely ignore them as it means the system is already configured correctly.

