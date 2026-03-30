import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Clock, CalendarDays, Timer } from 'lucide-react';
import styles from './page.module.css';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { MonthFilter } from './MonthFilter';

export default async function AttendancePage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Determine which month to show
  const params = await searchParams;
  const now = new Date();
  let filterYear = now.getFullYear();
  let filterMonth = now.getMonth(); // 0-indexed

  if (params.month) {
    const [y, m] = params.month.split('-').map(Number);
    if (y && m) {
      filterYear = y;
      filterMonth = m - 1;
    }
  }

  const startOfMonth = new Date(filterYear, filterMonth, 1).toISOString();
  const endOfMonth = new Date(filterYear, filterMonth + 1, 0, 23, 59, 59).toISOString();

  // Fetch attendance records for the selected month
  const { data: records } = await supabase
    .from('attendance_records')
    .select('*')
    .eq('user_id', user.id)
    .gte('clock_in', startOfMonth)
    .lte('clock_in', endOfMonth)
    .order('clock_in', { ascending: false });

  const attendance = records || [];

  // Check if currently clocked in
  const { data: activeSession } = await supabase
    .from('attendance_records')
    .select('id, clock_in')
    .eq('user_id', user.id)
    .is('clock_out', null)
    .limit(1)
    .single();

  // Calculate stats
  const totalDays = attendance.filter(r => r.clock_out).length + (activeSession ? 1 : 0);
  
  let totalHoursMonth = 0;
  attendance.forEach(r => {
    if (r.clock_out) {
      totalHoursMonth += (new Date(r.clock_out).getTime() - new Date(r.clock_in).getTime()) / (1000 * 60 * 60);
    }
  });

  // Today's hours
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayRecords = attendance.filter(r => new Date(r.clock_in) >= todayStart);
  let todayHours = 0;
  todayRecords.forEach(r => {
    if (r.clock_out) {
      todayHours += (new Date(r.clock_out).getTime() - new Date(r.clock_in).getTime()) / (1000 * 60 * 60);
    }
  });

  function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  function getHoursWorked(clockIn: string, clockOut: string | null) {
    if (!clockOut) return '—';
    const diff = (new Date(clockOut).getTime() - new Date(clockIn).getTime()) / (1000 * 60 * 60);
    const hrs = Math.floor(diff);
    const mins = Math.round((diff - hrs) * 60);
    return `${hrs}h ${mins}m`;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>My Attendance</h1>
          <p className={styles.subtitle}>View your clock-in history and hours worked.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsRow}>
        <Card className={styles.statCard}>
          <CardContent className={styles.statContent}>
            <div className={styles.statIconBox} style={{ backgroundColor: '#e0e7ff', color: '#4f46e5' }}>
              <CalendarDays size={24} />
            </div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>Days Attended</p>
              <p className={styles.statValue}>{totalDays}</p>
              <p className={styles.statDesc}>This month</p>
            </div>
          </CardContent>
        </Card>

        <Card className={styles.statCard}>
          <CardContent className={styles.statContent}>
            <div className={styles.statIconBox} style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
              <Timer size={24} />
            </div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>Hours Today</p>
              <p className={styles.statValue}>{todayHours.toFixed(1)}h</p>
              <p className={styles.statDesc}>{activeSession ? 'Currently active' : 'Completed'}</p>
            </div>
          </CardContent>
        </Card>

        <Card className={styles.statCard}>
          <CardContent className={styles.statContent}>
            <div className={styles.statIconBox} style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
              <Clock size={24} />
            </div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>Total Hours</p>
              <p className={styles.statValue}>{totalHoursMonth.toFixed(1)}h</p>
              <p className={styles.statDesc}>This month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Records Table */}
      <Card>
        <CardHeader style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
          <CardTitle>Attendance Records</CardTitle>
          <MonthFilter currentMonth={now.getMonth()} currentYear={now.getFullYear()} />
        </CardHeader>
        <CardContent>
          {attendance.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Clock In</TableHead>
                  <TableHead>Clock Out</TableHead>
                  <TableHead>Hours Worked</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendance.map((record) => {
                  const isActive = !record.clock_out;
                  return (
                    <TableRow key={record.id}>
                      <TableCell style={{ fontWeight: 500 }}>{formatDate(record.clock_in)}</TableCell>
                      <TableCell>{formatTime(record.clock_in)}</TableCell>
                      <TableCell>{record.clock_out ? formatTime(record.clock_out) : '—'}</TableCell>
                      <TableCell>{getHoursWorked(record.clock_in, record.clock_out)}</TableCell>
                      <TableCell>
                        <span className={`${styles.statusBadge} ${isActive ? styles.statusActive : styles.statusCompleted}`}>
                          <span className={`${styles.statusDot} ${isActive ? styles.dotActive : styles.dotCompleted}`} />
                          {isActive ? 'Active' : 'Completed'}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📋</div>
              <h2 className={styles.emptyTitle}>No attendance records</h2>
              <p className={styles.emptyDesc}>
                No clock-in records found for this month. Use the &quot;Clock In&quot; button on your dashboard to start tracking.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
