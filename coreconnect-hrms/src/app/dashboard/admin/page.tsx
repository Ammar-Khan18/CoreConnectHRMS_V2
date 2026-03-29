import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Users, Briefcase, Calendar, TrendingUp } from 'lucide-react';
import styles from './page.module.css';

export default function AdminDashboardPage() {
  const stats = [
    { title: 'Total Employees', value: '1,248', desc: '+12% from last month', icon: Users, color: '#0b5cff' },
    { title: 'Active Jobs', value: '42', desc: '5 new roles opened', icon: Briefcase, color: '#10b981' },
    { title: 'Leave Requests', value: '18', desc: 'Needs approval', icon: Calendar, color: '#f59e0b' },
    { title: 'Performance Avg', value: '4.8/5', desc: 'Q3 Reviews', icon: TrendingUp, color: '#8b5cf6' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Admin Overview</h1>
          <p className={styles.subtitle}>Welcome back, Ammar. Here's what's happening today.</p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className={styles.statCard}>
              <CardContent className={styles.statContent}>
                <div className={styles.statInfo}>
                  <p className={styles.statTitle}>{stat.title}</p>
                  <h3 className={styles.statValue}>{stat.value}</h3>
                  <p className={styles.statDesc}>{stat.desc}</p>
                </div>
                <div className={styles.iconContainer} style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                  <Icon size={24} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className={styles.chartsGrid}>
        <Card className={styles.chartCard}>
          <CardHeader>
            <CardTitle>Workforce Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.placeholderChart}>
              <div className={styles.chartBar} style={{ height: '60%' }}></div>
              <div className={styles.chartBar} style={{ height: '80%' }}></div>
              <div className={styles.chartBar} style={{ height: '40%' }}></div>
              <div className={styles.chartBar} style={{ height: '90%' }}></div>
              <div className={styles.chartBar} style={{ height: '50%' }}></div>
            </div>
          </CardContent>
        </Card>

        <Card className={styles.chartCard}>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className={styles.activityList}>
              <li className={styles.activityItem}>
                <div className={styles.activityDot} />
                <div className={styles.activityInfo}>
                  <p><strong>Sarah Jenkins</strong> requested Annual Leave</p>
                  <span>2 hours ago</span>
                </div>
              </li>
              <li className={styles.activityItem}>
                <div className={styles.activityDot} />
                <div className={styles.activityInfo}>
                  <p><strong>Dev Team</strong> submitted Q3 reviews</p>
                  <span>4 hours ago</span>
                </div>
              </li>
              <li className={styles.activityItem}>
                <div className={styles.activityDot} />
                <div className={styles.activityInfo}>
                  <p>New employee onboarding for <strong>Alex Chen</strong></p>
                  <span>1 day ago</span>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
