-- ============================================================
-- FINAL Fix for Help Desk Relationship Errors
-- Run this in the Supabase SQL Editor
-- ============================================================

-- 1. Drop ALL foreign key constraints on help_desk_tickets to start fresh
DO $$ 
DECLARE
  r record;
BEGIN
  FOR r IN (
    SELECT conname 
    FROM pg_constraint 
    WHERE conrelid = 'public.help_desk_tickets'::regclass 
    AND contype = 'f'
  ) LOOP
    EXECUTE 'ALTER TABLE public.help_desk_tickets DROP CONSTRAINT ' || quote_ident(r.conname);
  END LOOP;
END $$;

-- 2. Add precisely named foreign key constraints pointing to public.profiles
-- We use unique names to ensure we can reference them in our JS query
ALTER TABLE public.help_desk_tickets
  ADD CONSTRAINT fk_help_desk_user 
  FOREIGN KEY (user_id) 
  REFERENCES public.profiles(id) 
  ON DELETE CASCADE;

ALTER TABLE public.help_desk_tickets
  ADD CONSTRAINT fk_help_desk_resolver 
  FOREIGN KEY (resolved_by) 
  REFERENCES public.profiles(id);

-- 3. Reload the schema cache for PostgREST
NOTIFY pgrst, 'reload schema';
