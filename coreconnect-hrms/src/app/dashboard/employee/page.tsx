import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Clock, Calendar, CheckCircle, FileText } from 'lucide-react';
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

  const { data: latestAnnouncements } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3);

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
          <h1 className={styles.title}>Good Morning, {firstName}!</h1>
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
                <p>No upcoming approvals</p>
              </div>
              <Link href="/dashboard/employee/leave">
                <Button variant="outline" size="sm">Request Leave</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className={styles.card}>
            <CardContent className={styles.cardContent}>
              <div className={styles.iconBox} style={{ backgroundColor: '#ccfbf1', color: '#0d9488' }}>
                <CheckCircle size={24} />
              </div>
              <div className={styles.cardText}>
                <h3>Pending Tasks</h3>
                <p>2 courses pending completion</p>
              </div>
              <Link href="/dashboard/employee/helpdesk">
                <Button variant="outline" size="sm">View Tasks</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className={styles.card}>
            <CardContent className={styles.cardContent}>
              <div className={styles.iconBox} style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
                <FileText size={24} />
              </div>
              <div className={styles.cardText}>
                <h3>Latest Payslip</h3>
                <p>September 2026 added</p>
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
