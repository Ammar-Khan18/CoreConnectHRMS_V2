'use server'

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function clockIn() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  // Check if there's already an open session (clocked in but not out)
  const { data: openSession } = await supabase
    .from('attendance_records')
    .select('id')
    .eq('user_id', user.id)
    .is('clock_out', null)
    .limit(1)
    .single();

  if (openSession) {
    throw new Error('You are already clocked in. Please clock out first.');
  }

  const { error } = await supabase
    .from('attendance_records')
    .insert({
      user_id: user.id,
      clock_in: new Date().toISOString(),
    });

  if (error) {
    console.error('Clock in error:', error.message);
    throw new Error('Failed to clock in: ' + error.message);
  }

  revalidatePath('/dashboard/employee');
  revalidatePath('/dashboard/employee/attendance');
}

export async function clockOut() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  // Find the open session
  const { data: openSession } = await supabase
    .from('attendance_records')
    .select('id')
    .eq('user_id', user.id)
    .is('clock_out', null)
    .order('clock_in', { ascending: false })
    .limit(1)
    .single();

  if (!openSession) {
    throw new Error('No active clock-in session found.');
  }

  const { error } = await supabase
    .from('attendance_records')
    .update({ clock_out: new Date().toISOString() })
    .eq('id', openSession.id);

  if (error) {
    console.error('Clock out error:', error.message);
    throw new Error('Failed to clock out: ' + error.message);
  }

  revalidatePath('/dashboard/employee');
  revalidatePath('/dashboard/employee/attendance');
}
