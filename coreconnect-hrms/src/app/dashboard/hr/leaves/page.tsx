import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import styles from './page.module.css';
import { LeaveReviewClient } from './LeaveReviewClient';

export default async function HRLeaveReviewPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Verify the user is HR or Admin
  const { data: userProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (userProfile?.role !== 'HR' && userProfile?.role !== 'Admin') {
    redirect('/unauthorized');
  }

  // Fetch all leave requests
  const { data: leaveRequests } = await supabase
    .from('leave_requests')
    .select('*')
    .order('created_at', { ascending: false });

  const requests = leaveRequests || [];

  // Fetch employee names for each unique user_id
  const userIds = [...new Set(requests.map(r => r.user_id))];
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, first_name, last_name')
    .in('id', userIds.length > 0 ? userIds : ['00000000-0000-0000-0000-000000000000']);

  const profileMap = new Map<string, string>();
  profiles?.forEach(p => {
    profileMap.set(p.id, `${p.first_name} ${p.last_name}`);
  });

  // Enrich requests with employee names
  const enrichedRequests = requests.map(r => ({
    ...r,
    employee_name: profileMap.get(r.user_id) || 'Unknown Employee',
  }));

  // Calculate stats
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'Pending').length,
    approved: requests.filter(r => r.status === 'Approved').length,
    rejected: requests.filter(r => r.status === 'Rejected').length,
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Leave Requests</h1>
          <p className={styles.subtitle}>Review and manage employee leave requests.</p>
        </div>
      </div>

      <LeaveReviewClient leaveRequests={enrichedRequests} stats={stats} />
    </div>
  );
}
