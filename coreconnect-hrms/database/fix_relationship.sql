-- ============================================================
-- Fix Relationship for Help Desk Tickets
-- Run this in the Supabase SQL Editor
-- ============================================================

-- 1. Drop existing foreign key constraints pointing to auth.users
-- This handles dropping constraints if they exist with typical auto-generated names
DO $$ 
DECLARE
  r record;
BEGIN
  FOR r IN (
    SELECT conname 
    FROM pg_constraint 
    WHERE conrelid = 'public.help_desk_tickets'::regclass 
    AND confrelid = 'auth.users'::regclass
  ) LOOP
    EXECUTE 'ALTER TABLE public.help_desk_tickets DROP CONSTRAINT ' || quote_ident(r.conname);
  END LOOP;
END $$;

-- 2. Add new foreign key constraints pointing to public.profiles
ALTER TABLE public.help_desk_tickets
  ADD CONSTRAINT fk_help_desk_user 
  FOREIGN KEY (user_id) 
  REFERENCES public.profiles(id) 
  ON DELETE CASCADE;

ALTER TABLE public.help_desk_tickets
  ADD CONSTRAINT fk_help_desk_resolved_by
  FOREIGN KEY (resolved_by) 
  REFERENCES public.profiles(id);

-- 3. Notify that the fix is applied
-- (Optional but helps ensure the schema cache is updated if you run it in a tool)
NOTIFY pgrst, 'reload schema';
