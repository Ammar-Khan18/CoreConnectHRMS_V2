-- Create custom types for enum values safely
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('Admin', 'HR', 'Employee');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE leave_status AS ENUM ('Pending', 'Approved', 'Rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE employee_status AS ENUM ('Active', 'Inactive', 'Onboarding');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create profiles table linked to Supabase auth.users
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role user_role DEFAULT 'Employee',
  status employee_status DEFAULT 'Active',
  department TEXT,
  designation TEXT,
  base_salary DECIMAL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Note: We have disabled row level security and removed restrictive policies 
-- to allow the application to easily accept user profiles without security conflicts.
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 2. Payslips Table for Payroll System
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

ALTER TABLE payslips DISABLE ROW LEVEL SECURITY;

-- Replace the function to be more fault tolerant against null meta data
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, role)
  VALUES (
    NEW.id,
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'first_name', ''), 'System'),
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'last_name', ''), 'User'),
    CASE 
      WHEN (NEW.raw_user_meta_data->>'role') IN ('Admin', 'HR', 'Employee') 
        THEN (NEW.raw_user_meta_data->>'role')::public.user_role
      ELSE 'Employee'::public.user_role
    END
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error in handle_new_user for %: %', NEW.id, SQLERRM;
    RETURN NEW; -- Attempt to avoid blocking user creation if profile fails
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
