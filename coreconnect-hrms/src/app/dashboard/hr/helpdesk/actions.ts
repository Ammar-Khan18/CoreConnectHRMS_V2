'use server'

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getAllTickets() {
  const supabase = await createClient();

  // Fetch tickets with requester name from profiles
  const { data, error } = await supabase
    .from('help_desk_tickets')
    .select(`
      *,
      profiles!fk_help_desk_user (
        first_name,
        last_name
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Fetch all tickets error:', error.message);
    return [];
  }

  return data;
}

export async function resolveTicket(formData: FormData) {
  const supabase = await createClient();

  // Get current HR user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return { error: 'Unauthorized' };
  }

  const ticketId = formData.get('ticketId') as string;
  const resolutionNote = formData.get('resolutionNote') as string;

  const { error } = await supabase
    .from('help_desk_tickets')
    .update({
      status: 'Resolved',
      resolution_note: resolutionNote,
      resolved_by: user.id,
      resolved_at: new Date().toISOString()
    })
    .eq('id', ticketId);

  if (error) {
    console.error('Resolve ticket error:', error.message);
    return { error: error.message };
  }

  revalidatePath('/dashboard/hr/helpdesk');
  revalidatePath('/dashboard/employee/helpdesk'); // Update for the employee too
  return { success: true };
}
