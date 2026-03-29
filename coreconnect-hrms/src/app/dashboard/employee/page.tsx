import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Clock, Calendar, CheckCircle, FileText } from 'lucide-react';
import styles from './page.module.css';

export default function EmployeeDashboardPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Good Morning, Alex!</h1>
          <p className={styles.subtitle}>Here is your daily summary and tasks.</p>
        </div>
        <div className={styles.checkInBox}>
          <div className={styles.timeInfo}>
            <span className={styles.timeLabel}>Current Time</span>
            <span className={styles.currentTime}>09:00 AM</span>
          </div>
          <Button variant="primary" className={styles.checkInBtn}>
            <Clock size={18} /> Clock In Now
          </Button>
        </div>
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
              <Button variant="outline" size="sm">Request Leave</Button>
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
              <Button variant="outline" size="sm">View Tasks</Button>
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
              <Button variant="outline" size="sm">Download</Button>
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
