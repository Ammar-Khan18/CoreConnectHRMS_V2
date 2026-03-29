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
              <Link href="/dashboard/hr/payroll">
                <Button variant="outline" size="sm">Download</Button>
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
              <div className={styles.announcementItem}>
                <h4>Annual Company Retreat</h4>
                <p>Join us for the annual retreat in November. Please RSVP by Oct 15th.</p>
                <span className={styles.date}>Today</span>
              </div>
              <div className={styles.announcementItem}>
                <h4>New Health Insurance Policy</h4>
                <p>We've updated our benefits. Make sure to review the new policy documents.</p>
                <span className={styles.date}>Yesterday</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
