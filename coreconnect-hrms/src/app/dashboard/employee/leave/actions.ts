'use server'

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function submitLeaveRequest(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const leaveType = formData.get('leave_type') as string;
  const startDate = formData.get('start_date') as string;
  const endDate = formData.get('end_date') as string;
  const reason = formData.get('reason') as string;

  if (!leaveType || !startDate || !endDate || !reason) {
    throw new Error('All fields are required.');
  }

  // Calculate number of days (inclusive of both start and end dates)
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (end < start) {
    throw new Error('End date must be on or after the start date.');
  }
  const diffTime = end.getTime() - start.getTime();
  const days = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

  const { error } = await supabase
    .from('leave_requests')
    .insert({
      user_id: user.id,
      leave_type: leaveType,
      start_date: startDate,
      end_date: endDate,
      days,
      reason,
      status: 'Pending',
    });

  if (error) {
    console.error('Submit leave error:', error.message);
    throw new Error('Failed to submit leave request: ' + error.message);
  }

  revalidatePath('/dashboard/employee/leave');
}
