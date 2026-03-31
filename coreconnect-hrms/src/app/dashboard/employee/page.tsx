import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Clock, Calendar, HelpCircle, FileText } from 'lucide-react';
import styles from './page.module.css';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ClockInWidget } from './ClockInWidget';

export default async function EmployeeDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name')
    .eq('id', user.id)
    .single();

  const firstName = profile?.first_name || 'Employee';

  // 1. Fetch Latest Announcements
  const { data: latestAnnouncements } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3);

  // 2. Fetch Upcoming Approved Leaves
  const { data: upcomingLeaves } = await supabase
    .from('leave_requests')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'Approved')
    .gt('start_date', new Date().toISOString().split('T')[0])
    .order('start_date', { ascending: true })
    .limit(1);

  // 3. Fetch Active Helpdesk Tickets (Pending or In Progress)
  const { count: activeTicketsCount } = await supabase
    .from('help_desk_tickets')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .neq('status', 'Resolved');

  // 4. Fetch Latest Payslip
  const { data: latestPayslip } = await supabase
    .from('payslips')
    .select('month, year')
    .eq('user_id', user.id)
    .order('year', { ascending: false })
    .order('month', { ascending: false })
    .limit(1);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{getGreeting()}, {firstName}!</h1>
          <p className={styles.subtitle}>Here is your daily summary and tasks.</p>
        </div>
        <ClockInWidget />
      </div>

      <div className={styles.grid}>
        <div className={styles.mainCol}>
          <Card className={styles.card}>
            <CardContent className={styles.cardContent}>
              <div className={styles.iconBox} style={{ backgroundColor: '#e0e7ff', color: '#4f46e5' }}>
                <Calendar size={24} />
              </div>
              <div className={styles.cardText}>
                <h3>Upcoming Leaves</h3>
                <p>
                  {upcomingLeaves && upcomingLeaves.length > 0 
                    ? `Next: ${new Date(upcomingLeaves[0].start_date).toLocaleDateString()}` 
                    : 'No upcoming approved leaves'}
                </p>
              </div>
              <Link href="/dashboard/employee/leave">
                <Button variant="outline" size="sm">Request Leave</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className={styles.card}>
            <CardContent className={styles.cardContent}>
              <div className={styles.iconBox} style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
                <HelpCircle size={24} />
              </div>
              <div className={styles.cardText}>
                <h3>Active Tickets</h3>
                <p>{activeTicketsCount || 0} unresolved issues</p>
              </div>
              <Link href="/dashboard/employee/helpdesk">
                <Button variant="outline" size="sm">View Tickets</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className={styles.card}>
            <CardContent className={styles.cardContent}>
              <div className={styles.iconBox} style={{ backgroundColor: '#ccfbf1', color: '#0d9488' }}>
                <FileText size={24} />
              </div>
              <div className={styles.cardText}>
                <h3>Latest Payslip</h3>
                <p>
                  {latestPayslip && latestPayslip.length > 0 
                    ? `${monthNames[latestPayslip[0].month - 1]} ${latestPayslip[0].year}` 
                    : 'No payslips generated'}
                </p>
              </div>
              <Link href="/dashboard/employee/payslips">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className={styles.sideCol}>
          <Card className={styles.announcementsCard}>
            <div className={styles.announcementsHeader}>
              <h3>Company Announcements</h3>
              <span className={styles.badge}>New</span>
            </div>
            <div className={styles.announcementList}>
              {latestAnnouncements && latestAnnouncements.length > 0 ? (
                latestAnnouncements.map((ann) => (
                  <div key={ann.id} className={styles.announcementItem}>
                    <h4>{ann.title}</h4>
                    <p style={{ 
                      display: '-webkit-box', 
                      WebkitLineClamp: 2, 
                      WebkitBoxOrient: 'vertical', 
                      overflow: 'hidden',
                      textOverflow: 'ellipsis' 
                    }}>
                      {ann.body}
                    </p>
                    <span className={styles.date}>{formatDate(ann.created_at)}</span>
                  </div>
                ))
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>
                  <p style={{ fontSize: '0.875rem' }}>No announcements yet.</p>
                </div>
              )}
            </div>
            <Link href="/dashboard/announcements" className={styles.viewAllLink}>
              View All Announcements
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
