'use client';

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/utils/supabase/client';
import { clockIn, clockOut } from './attendance/actions';
import styles from './page.module.css';

export function ClockInWidget() {
  const [time, setTime] = useState('');
  const [clockedIn, setClockedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  // Check if user is already clocked in on mount
  useEffect(() => {
    async function checkStatus() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: openSession } = await supabase
          .from('attendance_records')
          .select('id')
          .eq('user_id', user.id)
          .is('clock_out', null)
          .limit(1)
          .single();

        setClockedIn(!!openSession);
      } catch {
        // No open session means not clocked in
        setClockedIn(false);
      } finally {
        setCheckingStatus(false);
      }
    }
    checkStatus();
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  async function handleToggle() {
    setLoading(true);
    try {
      if (clockedIn) {
        await clockOut();
        setClockedIn(false);
      } else {
        await clockIn();
        setClockedIn(true);
      }
    } catch (err: any) {
      alert(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.checkInBox} style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
      <div className={styles.timeInfo} style={{ display: 'flex', flexDirection: 'column' }}>
        <span className={styles.timeLabel} style={{ fontSize: '0.875rem', color: '#6b7280' }}>Current Time</span>
        <span className={styles.currentTime} style={{ fontSize: '1.25rem', fontWeight: 600 }}>{time || '--:--'}</span>
      </div>
      <Button 
        variant={clockedIn ? "outline" : "primary"} 
        className={styles.checkInBtn}
        onClick={handleToggle}
        disabled={loading || checkingStatus}
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
      >
        <Clock size={18} /> {loading ? 'Processing...' : checkingStatus ? 'Loading...' : clockedIn ? "Clock Out" : "Clock In Now"}
      </Button>
    </div>
  );
}
