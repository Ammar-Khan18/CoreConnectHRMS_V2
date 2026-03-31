-- 1. Create employee_status type if it doesn't exist
DO $$ BEGIN
    CREATE TYPE employee_status AS ENUM ('Active', 'Inactive', 'Onboarding');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Add status column to profiles if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status employee_status DEFAULT 'Active';

-- 3. Add base_salary to profiles if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS base_salary DECIMAL DEFAULT 0;

-- 4. Create payslips table
CREATE TABLE IF NOT EXISTS payslips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL,
  base_pay DECIMAL NOT NULL DEFAULT 0,
  tax_deduction DECIMAL NOT NULL DEFAULT 0,
  bonus DECIMAL NOT NULL DEFAULT 0,
  net_pay DECIMAL NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Pending', -- Pending, Paid, Cancelled
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, month, year) -- Prevent duplicate payslips for same user/month/year
);

-- Disable Row Level Security for simplicity as per project requirements
ALTER TABLE payslips DISABLE ROW LEVEL SECURITY;
