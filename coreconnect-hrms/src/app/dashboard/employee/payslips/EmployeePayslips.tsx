'use client'

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { FileText, Download, X, Printer, DollarSign, PieChart } from 'lucide-react';
import styles from './page.module.css';

interface Payslip {
  id: string;
  month: number;
  year: number;
  base_pay: number;
  tax_deduction: number;
  bonus: number;
  net_pay: number;
  status: string;
  created_at: string;
  paid_at?: string;
}

interface EmployeePayslipsProps {
  payslips: Payslip[];
  employeeName: string;
}

export function EmployeePayslips({ payslips, employeeName }: EmployeePayslipsProps) {
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);

  const formatMonth = (m: number) => new Date(0, m - 1).toLocaleString('default', { month: 'long' });

  return (
    <div className={styles.wrapper}>
      <Card>
        <CardHeader className={styles.listHeader}>
          <CardTitle>My Payment History</CardTitle>
          <p className={styles.subtitle}>View and download your monthly digital payslips.</p>
        </CardHeader>
        <CardContent>
          {payslips.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead>Base Salary</TableHead>
                  <TableHead>Net Pay</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payslips.map((ps) => (
                  <TableRow key={ps.id}>
                    <TableCell style={{ fontWeight: 600 }}>
                      {formatMonth(ps.month)} {ps.year}
                    </TableCell>
                    <TableCell>${Number(ps.base_pay).toLocaleString()}</TableCell>
                    <TableCell style={{ color: '#059669', fontWeight: 600 }}>
                      ${Number(ps.net_pay).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <span className={`${styles.statusBadge} ${styles[ps.status.toLowerCase()]}`}>
                        {ps.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => setSelectedPayslip(ps)}>
                        <FileText size={16} /> View Digital Slips
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>💰</div>
              <h3>No payslips available</h3>
              <p>Your payment records will appear here once processed by HR.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payslip Modal */}
      {selectedPayslip && (
        <div className={styles.modalOverlay} onClick={() => setSelectedPayslip(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.headerInfo}>
                <h2>Payslip — {formatMonth(selectedPayslip.month)} {selectedPayslip.year}</h2>
                <span className={`${styles.statusBadge} ${styles[selectedPayslip.status.toLowerCase()]}`}>
                  {selectedPayslip.status}
                </span>
              </div>
              <button className={styles.closeBtn} onClick={() => setSelectedPayslip(null)}>
                <X size={20} />
              </button>
            </div>
            
            <div className={styles.payslipBody}>
              <div className={styles.employeeInfo}>
                <div className={styles.infoBlock}>
                  <label>Employee Name</label>
                  <p>{employeeName}</p>
                </div>
                <div className={styles.infoBlock}>
                  <label>Payment Date</label>
                  <p>{selectedPayslip.paid_at ? new Date(selectedPayslip.paid_at).toLocaleDateString() : 'Pending'}</p>
                </div>
                <div className={styles.infoBlock}>
                  <label>Statement No.</label>
                  <p>PAY-{selectedPayslip.id.slice(0, 8).toUpperCase()}</p>
                </div>
              </div>

              <div className={styles.financeGrid}>
                <div className={styles.earnings}>
                  <div className={styles.sectionTitle}>
                    <DollarSign size={16} /> Earnings
                  </div>
                  <div className={styles.row}>
                    <span>Base Salary</span>
                    <span>${Number(selectedPayslip.base_pay).toLocaleString()}</span>
                  </div>
                  <div className={styles.row}>
                    <span>Bonus / Allowances</span>
                    <span>${Number(selectedPayslip.bonus).toLocaleString()}</span>
                  </div>
                  <div className={styles.totalRow}>
                    <span>Gross Salary</span>
                    <span>${(Number(selectedPayslip.base_pay) + Number(selectedPayslip.bonus)).toLocaleString()}</span>
                  </div>
                </div>

                <div className={styles.deductions}>
                  <div className={styles.sectionTitle} style={{ color: '#dc2626' }}>
                    <PieChart size={16} /> Deductions
                  </div>
                  <div className={styles.row}>
                    <span>Tax Deduction (5%)</span>
                    <span>-${Number(selectedPayslip.tax_deduction).toLocaleString()}</span>
                  </div>
                  <div className={styles.totalRow} style={{ color: '#dc2626' }}>
                    <span>Total Deductions</span>
                    <span>-${Number(selectedPayslip.tax_deduction).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className={styles.finalPay}>
                <div className={styles.netLabel}>Net Transfer Amount</div>
                <div className={styles.netAmount}>${Number(selectedPayslip.net_pay).toLocaleString()}</div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <Button variant="outline" onClick={() => window.print()}>
                <Printer size={18} /> Print Record
              </Button>
              <Button onClick={() => setSelectedPayslip(null)}>
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
