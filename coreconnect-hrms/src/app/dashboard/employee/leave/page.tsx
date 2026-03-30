import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Calendar, Thermometer, Coffee } from 'lucide-react';
import styles from './page.module.css';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { LeaveRequestForm } from './LeaveRequestForm';

// Default leave entitlements per year
const LEAVE_ENTITLEMENTS = {
  Annual: 20,
  Sick: 10,
  Casual: 5,
};

export default async function LeavePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get current year
  const currentYear = new Date().getFullYear();
  const yearStart = `${currentYear}-01-01`;
  const yearEnd = `${currentYear}-12-31`;

  // Fetch all leave requests for this user this year
  const { data: leaveRequests } = await supabase
    .from('leave_requests')
    .select('*')
    .eq('user_id', user.id)
    .gte('start_date', yearStart)
    .lte('start_date', yearEnd)
    .order('created_at', { ascending: false });

  const requests = leaveRequests || [];

  // Calculate used leaves (only approved ones count against balance)
  const usedLeaves = {
    Annual: 0,
    Sick: 0,
    Casual: 0,
  };

  requests.forEach(r => {
    if (r.status === 'Approved' && usedLeaves.hasOwnProperty(r.leave_type)) {
      usedLeaves[r.leave_type as keyof typeof usedLeaves] += r.days;
    }
  });

  const balances = [
    {
      type: 'Annual Leave',
      key: 'Annual' as const,
      total: LEAVE_ENTITLEMENTS.Annual,
      used: usedLeaves.Annual,
      remaining: LEAVE_ENTITLEMENTS.Annual - usedLeaves.Annual,
      icon: Calendar,
      color: '#0b5cff',
      gradientColor: 'linear-gradient(90deg, #0b5cff, #38bdf8)',
    },
    {
      type: 'Sick Leave',
      key: 'Sick' as const,
      total: LEAVE_ENTITLEMENTS.Sick,
      used: usedLeaves.Sick,
      remaining: LEAVE_ENTITLEMENTS.Sick - usedLeaves.Sick,
      icon: Thermometer,
      color: '#ef4444',
      gradientColor: 'linear-gradient(90deg, #ef4444, #f97316)',
    },
    {
      type: 'Casual Leave',
      key: 'Casual' as const,
      total: LEAVE_ENTITLEMENTS.Casual,
      used: usedLeaves.Casual,
      remaining: LEAVE_ENTITLEMENTS.Casual - usedLeaves.Casual,
      icon: Coffee,
      color: '#8b5cf6',
      gradientColor: 'linear-gradient(90deg, #8b5cf6, #d946ef)',
    },
  ];

  function formatDate(dateString: string) {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>My Leaves</h1>
          <p className={styles.subtitle}>View your leave balances, request time off, and track approval statuses.</p>
        </div>
        <LeaveRequestForm />
      </div>

      {/* Leave Balance Cards */}
      <div className={styles.balanceRow}>
        {balances.map((b) => {
          const Icon = b.icon;
          const usedPercent = b.total > 0 ? (b.used / b.total) * 100 : 0;
          return (
            <Card key={b.key} className={styles.balanceCard}>
              <CardContent className={styles.balanceContent}>
                <div className={styles.balanceIconBox} style={{ backgroundColor: `${b.color}15`, color: b.color }}>
                  <Icon size={24} />
                </div>
                <div className={styles.balanceInfo}>
                  <p className={styles.balanceType}>{b.type}</p>
                  <p className={styles.balanceValue}>{b.remaining} <span style={{ fontSize: '0.875rem', fontWeight: 400, color: 'var(--text-secondary)' }}>/ {b.total} days</span></p>
                  <p className={styles.balanceMeta}>{b.used} days used</p>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${usedPercent}%`, background: b.gradientColor }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Leave Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {requests.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell style={{ fontWeight: 500 }}>{req.leave_type}</TableCell>
                    <TableCell>
                      <div className={styles.dateRange}>
                        <span className={styles.dateRangeText}>
                          {formatDate(req.start_date)} — {formatDate(req.end_date)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{req.days}</TableCell>
                    <TableCell style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {req.reason}
                    </TableCell>
                    <TableCell>
                      <span className={`${styles.statusBadge} ${styles[req.status.toLowerCase()]}`}>
                        {req.status}
                      </span>
                    </TableCell>
                    <TableCell style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      {new Date(req.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🏖️</div>
              <h2 className={styles.emptyTitle}>No leave requests yet</h2>
              <p className={styles.emptyDesc}>
                Click &quot;Apply for Leave&quot; to submit your first leave request.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
