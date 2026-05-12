# RescueIQ Supabase Schema

Run the following SQL in your Supabase SQL Editor to set up the required tables for the authentication system.

### 1. Users Table
```sql
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. OTPs Table
```sql
CREATE TABLE IF NOT EXISTS otps (
  email TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3. SOS Reports Table (Optional but recommended)
```sql
CREATE TABLE IF NOT EXISTS sos_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_name TEXT,
  location_lat FLOAT,
  location_lng FLOAT,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

> [!NOTE]
> Make sure to enable RLS (Row Level Security) if you are deploying to production, or disable it for development testing.
