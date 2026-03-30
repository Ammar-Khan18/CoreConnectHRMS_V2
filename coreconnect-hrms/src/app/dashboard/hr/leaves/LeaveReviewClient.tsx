'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { reviewLeaveRequest } from './actions';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

interface LeaveRequest {
  id: string;
  user_id: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  days: number;
  reason: string;
  status: string;
  reviewer_note: string | null;
  created_at: string;
  employee_name: string;
}

interface Stats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

interface LeaveReviewClientProps {
  leaveRequests: LeaveRequest[];
  stats: Stats;
}

export function LeaveReviewClient({ leaveRequests, stats }: LeaveReviewClientProps) {
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [reviewModal, setReviewModal] = useState<{ isOpen: boolean; requestId: string; action: 'Approved' | 'Rejected'; employeeName: string }>({
    isOpen: false,
    requestId: '',
    action: 'Approved',
    employeeName: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const filtered = filter === 'All' ? leaveRequests : leaveRequests.filter(r => r.status === filter);

  function formatDate(dateString: string) {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  function openReviewModal(requestId: string, action: 'Approved' | 'Rejected', employeeName: string) {
    setReviewModal({ isOpen: true, requestId, action, employeeName });
    setError(null);
  }

  async function handleReview(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set('request_id', reviewModal.requestId);
    formData.set('status', reviewModal.action);

    try {
      await reviewLeaveRequest(formData);
      setReviewModal({ isOpen: false, requestId: '', action: 'Approved', employeeName: '' });
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  const filterTabs: Array<'All' | 'Pending' | 'Approved' | 'Rejected'> = ['All', 'Pending', 'Approved', 'Rejected'];

  return (
    <>
      {/* Stats */}
      <div className={styles.statsRow}>
        {[
          { label: 'Total Requests', value: stats.total, color: '#0b5cff', bg: '#e0e7ff' },
          { label: 'Pending', value: stats.pending, color: '#d97706', bg: '#fef3c7' },
          { label: 'Approved', value: stats.approved, color: '#16a34a', bg: '#dcfce7' },
          { label: 'Rejected', value: stats.rejected, color: '#dc2626', bg: '#fee2e2' },
        ].map((stat) => (
          <Card key={stat.label} className={styles.statCard}>
            <CardContent className={styles.statContent}>
              <div className={styles.statIconBox} style={{ backgroundColor: stat.bg, color: stat.color }}>
                <span style={{ fontSize: '1.125rem', fontWeight: 700 }}>{stat.value}</span>
              </div>
              <div className={styles.statInfo}>
                <p className={styles.statLabel}>{stat.label}</p>
                <p className={styles.statValue}>{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter + Table */}
      <Card>
        <CardHeader style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
          <CardTitle>Leave Requests</CardTitle>
          <div className={styles.filterTabs}>
            {filterTabs.map((tab) => (
              <button
                key={tab}
                className={`${styles.filterTab} ${filter === tab ? styles.filterTabActive : ''}`}
                onClick={() => setFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell>
                      <div className={styles.empInfo}>
                        <div className={styles.empAvatar}>
                          {req.employee_name.charAt(0)}
                        </div>
                        <span className={styles.empName}>{req.employee_name}</span>
                      </div>
                    </TableCell>
                    <TableCell style={{ fontWeight: 500 }}>{req.leave_type}</TableCell>
                    <TableCell>
                      <div className={styles.dateRange}>
                        <span className={styles.dateRangeText}>
                          {formatDate(req.start_date)} — {formatDate(req.end_date)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{req.days}</TableCell>
                    <TableCell className={styles.reasonCell} title={req.reason}>
                      {req.reason}
                    </TableCell>
                    <TableCell>
                      <span className={`${styles.statusBadge} ${styles[req.status.toLowerCase()]}`}>
                        {req.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {req.status === 'Pending' ? (
                        <div className={styles.actionBtns}>
                          <button
                            className={styles.approveBtn}
                            onClick={() => openReviewModal(req.id, 'Approved', req.employee_name)}
                          >
                            Approve
                          </button>
                          <button
                            className={styles.rejectBtn}
                            onClick={() => openReviewModal(req.id, 'Rejected', req.employee_name)}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <div className={styles.reviewInfo}>
                          {req.reviewer_note && <span>Note: {req.reviewer_note}</span>}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📋</div>
              <h2 className={styles.emptyTitle}>No {filter !== 'All' ? filter.toLowerCase() : ''} leave requests</h2>
              <p className={styles.emptyDesc}>
                {filter === 'Pending'
                  ? 'All leave requests have been reviewed. Great work!'
                  : 'No leave requests found for the selected filter.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Modal */}
      <Modal
        isOpen={reviewModal.isOpen}
        onClose={() => setReviewModal({ ...reviewModal, isOpen: false })}
        title={`${reviewModal.action === 'Approved' ? 'Approve' : 'Reject'} Leave Request`}
      >
        <form onSubmit={handleReview} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {error && <div className={styles.formError}>{error}</div>}

          <p style={{ fontSize: '0.875rem', color: '#374151' }}>
            You are about to <strong>{reviewModal.action === 'Approved' ? 'approve' : 'reject'}</strong> the leave request from <strong>{reviewModal.employeeName}</strong>.
          </p>

          <div className={styles.formGroup}>
            <label htmlFor="reviewer_note" className={styles.formLabel}>Note (optional)</label>
            <textarea
              name="reviewer_note"
              id="reviewer_note"
              rows={3}
              placeholder="Add an optional note for the employee..."
              className={styles.formTextarea}
            />
          </div>

          <div className={styles.formActions}>
            <Button
              type="button"
              variant="outline"
              onClick={() => setReviewModal({ ...reviewModal, isOpen: false })}
              disabled={loading}
              style={{ backgroundColor: 'white', color: '#374151', border: '1px solid #d1d5db' }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              variant={reviewModal.action === 'Approved' ? 'primary' : 'danger'}
            >
              {loading ? 'Processing...' : reviewModal.action === 'Approved' ? 'Approve' : 'Reject'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
