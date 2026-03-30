'use server'

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function reviewLeaveRequest(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  // Verify the reviewer is HR or Admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || (profile.role !== 'HR' && profile.role !== 'Admin')) {
    throw new Error('Unauthorized: Only HR and Admin can review leave requests.');
  }

  const requestId = formData.get('request_id') as string;
  const status = formData.get('status') as string; // 'Approved' or 'Rejected'
  const reviewerNote = formData.get('reviewer_note') as string;

  if (!requestId || !status) {
    throw new Error('Request ID and status are required.');
  }

  if (status !== 'Approved' && status !== 'Rejected') {
    throw new Error('Invalid status. Must be Approved or Rejected.');
  }

  const { error } = await supabase
    .from('leave_requests')
    .update({
      status,
      reviewer_id: user.id,
      reviewer_note: reviewerNote || null,
    })
    .eq('id', requestId);

  if (error) {
    console.error('Review leave error:', error.message);
    throw new Error('Failed to review leave request: ' + error.message);
  }

  revalidatePath('/dashboard/hr/leaves');
  revalidatePath('/dashboard/employee/leave');
}
