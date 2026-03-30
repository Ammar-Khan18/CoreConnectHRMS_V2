'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Plus } from 'lucide-react';
import { submitLeaveRequest } from './actions';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export function LeaveRequestForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      await submitLeaveRequest(formData);
      setIsOpen(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  // Default start date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Plus size={18} style={{ marginRight: '0.5rem' }} /> Apply for Leave
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Apply for Leave"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {error && <div className={styles.formError}>{error}</div>}

          <div className={styles.formGroup}>
            <label htmlFor="leave_type" className={styles.formLabel}>Leave Type</label>
            <select name="leave_type" id="leave_type" required className={styles.formSelect}>
              <option value="">Select leave type...</option>
              <option value="Annual">Annual Leave</option>
              <option value="Sick">Sick Leave</option>
              <option value="Casual">Casual Leave</option>
            </select>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="start_date" className={styles.formLabel}>Start Date</label>
              <input
                type="date"
                name="start_date"
                id="start_date"
                required
                min={minDate}
                className={styles.formInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="end_date" className={styles.formLabel}>End Date</label>
              <input
                type="date"
                name="end_date"
                id="end_date"
                required
                min={minDate}
                className={styles.formInput}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="reason" className={styles.formLabel}>Reason</label>
            <textarea
              name="reason"
              id="reason"
              required
              rows={4}
              placeholder="Please provide a reason for your leave request..."
              className={styles.formTextarea}
            />
          </div>

          <div className={styles.formActions}>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={loading}
              style={{ backgroundColor: 'white', color: '#374151', border: '1px solid #d1d5db' }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Request'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
