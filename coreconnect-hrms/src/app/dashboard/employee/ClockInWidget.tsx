'use client';

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import styles from './page.module.css';

export function ClockInWidget() {
  const [time, setTime] = useState('');
  const [clockedIn, setClockedIn] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.checkInBox} style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
      <div className={styles.timeInfo} style={{ display: 'flex', flexDirection: 'column' }}>
        <span className={styles.timeLabel} style={{ fontSize: '0.875rem', color: '#6b7280' }}>Current Time</span>
        <span className={styles.currentTime} style={{ fontSize: '1.25rem', fontWeight: 600 }}>{time || '--:--'}</span>
      </div>
      <Button 
        variant={clockedIn ? "outline" : "primary"} 
        className={styles.checkInBtn}
        onClick={() => setClockedIn(!clockedIn)}
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
      >
        <Clock size={18} /> {clockedIn ? "Clock Out" : "Clock In Now"}
      </Button>
    </div>
  );
}
