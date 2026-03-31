-- ============================================================
-- CoreConnect HRMS — Help Desk Tickets Table
-- Run this in the Supabase SQL Editor
-- ============================================================

-- 1. Help Desk Tickets
CREATE TABLE IF NOT EXISTS help_desk_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL, -- IT Support, HR Inquiries, Facility Management, Equipment Request, Other
  priority TEXT NOT NULL DEFAULT 'Medium', -- Low, Medium, High, Urgent
  status TEXT NOT NULL DEFAULT 'Pending',  -- Pending, In Progress, Resolved, Closed
  resolution_note TEXT,
  resolved_by UUID REFERENCES public.profiles(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Note: We have disabled row level security to allow the application to easily 
-- manage tickets without security conflicts for this project context.
ALTER TABLE help_desk_tickets DISABLE ROW LEVEL SECURITY;
