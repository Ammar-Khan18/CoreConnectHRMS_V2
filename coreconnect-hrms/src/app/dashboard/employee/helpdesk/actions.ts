'use server'

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function submitTicket(formData: FormData) {
  const supabase = await createClient();

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return { error: 'Unauthorized' };
  }

  const subject = formData.get('subject') as string;
  const description = formData.get('description') as string;
  const category = formData.get('category') as string;
  const priority = formData.get('priority') as string;

  const { error } = await supabase
    .from('help_desk_tickets')
    .insert({
      user_id: user.id,
      subject,
      description,
      category,
      priority,
      status: 'Pending'
    });

  if (error) {
    console.error('Submit ticket error:', error.message);
    return { error: error.message };
  }

  revalidatePath('/dashboard/employee/helpdesk');
  return { success: true };
}

export async function getEmployeeTickets() {
  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return [];
  }

  const { data, error } = await supabase
    .from('help_desk_tickets')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Fetch tickets error:', error.message);
    return [];
  }

  return data;
}
