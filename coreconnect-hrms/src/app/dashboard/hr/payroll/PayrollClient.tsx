'use client'

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { DollarSign, Send, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import styles from './page.module.css';
import { updateBaseSalary, generatePayrollRun, markPayslipAsPaid } from './actions';

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  department: string;
  base_salary: number;
}

interface Payslip {
  id: string;
  user_id: string;
  month: number;
  year: number;
  base_pay: number;
  tax_deduction: number;
  bonus: number;
  net_pay: number;
  status: string;
  paid_at?: string;
  created_at: string;
}

interface PayrollClientProps {
  profiles: Profile[];
  initialPayslips: Payslip[];
}

export function PayrollClient({ profiles, initialPayslips }: PayrollClientProps) {
  const [activeTab, setActiveTab] = useState<'salaries' | 'process'>('salaries');
  const [editingSalaries, setEditingSalaries] = useState<Record<string, number>>({});
  const [processing, setProcessing] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const handleSalaryChange = (id: string, value: string) => {
    setEditingSalaries({ ...editingSalaries, [id]: Number(value) });
  };

  const handleUpdateSalary = async (id: string) => {
    const amount = editingSalaries[id];
    if (amount === undefined) return;

    try {
      setProcessing(true);
      await updateBaseSalary(id, amount);
      alert('Salary updated successfully!');
      const newEditing = { ...editingSalaries };
      delete newEditing[id];
      setEditingSalaries(newEditing);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleRunPayroll = async () => {
    if (!confirm(`Are you sure you want to generate payroll for ${new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long' })} ${selectedYear}?`)) {
      return;
    }

    try {
      setProcessing(true);
      await generatePayrollRun(selectedMonth, selectedYear);
      alert('Payroll generated successfully!');
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const handleMarkAsPaid = async (id: string) => {
    try {
      setProcessing(true);
      await markPayslipAsPaid(id);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setProcessing(false);
    }
  };

  const filteredPayslips = initialPayslips.filter(p => p.month === selectedMonth && p.year === selectedYear);
  const totalNetPay = filteredPayslips.reduce((sum, p) => sum + Number(p.net_pay), 0);

  return (
    <div className={styles.payrollWrapper}>
      {/* Summary Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard} style={{ borderLeft: '4px solid #4f46e5' }}>
          <div className={styles.statIcon} style={{ backgroundColor: '#eef2ff', color: '#4f46e5' }}>
            <DollarSign size={20} />
          </div>
          <div>
            <p className={styles.statLabel}>Monthly Budget</p>
            <p className={styles.statValue}>${totalNetPay.toLocaleString()}</p>
          </div>
        </div>
        <div className={styles.statCard} style={{ borderLeft: '4px solid #10b981' }}>
          <div className={styles.statIcon} style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>
            <CheckCircle size={20} />
          </div>
          <div>
            <p className={styles.statLabel}>Paid Employees</p>
            <p className={styles.statValue}>
              {filteredPayslips.filter(p => p.status === 'Paid').length} / {filteredPayslips.length}
            </p>
          </div>
        </div>
        <div className={styles.statCard} style={{ borderLeft: '4px solid #f59e0b' }}>
          <div className={styles.statIcon} style={{ backgroundColor: '#fffbeb', color: '#f59e0b' }}>
            <AlertCircle size={20} />
          </div>
          <div>
            <p className={styles.statLabel}>Tax Deductions (5%)</p>
            <p className={styles.statValue}>
              ${filteredPayslips.reduce((sum, p) => sum + Number(p.tax_deduction), 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'salaries' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('salaries')}
        >
          Manage Base Salaries
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'process' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('process')}
        >
          Payroll Processing
        </button>
      </div>

      {activeTab === 'salaries' && (
        <Card className={styles.mainCard}>
          <CardHeader>
            <CardTitle>Employee Base Salaries</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Current Salary</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell style={{ fontWeight: 500 }}>{p.first_name} {p.last_name}</TableCell>
                    <TableCell>{p.department || 'Unassigned'}</TableCell>
                    <TableCell>
                      <div className={styles.salaryInputBox}>
                        <span>$</span>
                        <input
                          type="number"
                          value={editingSalaries[p.id] !== undefined ? editingSalaries[p.id] : p.base_salary}
                          onChange={(e) => handleSalaryChange(p.id, e.target.value)}
                          className={styles.salaryInput}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="secondary"
                        disabled={processing || editingSalaries[p.id] === undefined}
                        onClick={() => handleUpdateSalary(p.id)}
                      >
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {activeTab === 'process' && (
        <div className={styles.processingLayout}>
          <Card className={styles.controlCard}>
            <CardHeader>
              <CardTitle>Run Monthly Payroll</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.runForm}>
                <div className={styles.formGroup}>
                  <label>Select Month</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className={styles.select}
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Date(0, i).toLocaleString('default', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Select Year</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className={styles.select}
                  >
                    {[2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <Button
                  className={styles.runBtn}
                  disabled={processing}
                  onClick={handleRunPayroll}
                >
                  <Send size={18} /> Process All Payments
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className={styles.resultsCard}>
            <CardHeader>
              <CardTitle>
                Generated Payslips — {new Date(0, selectedMonth - 1).toLocaleString('default', { month: 'long' })} {selectedYear}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredPayslips.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Net Pay</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayslips.map((ps) => {
                      const emp = profiles.find(p => p.id === ps.user_id);
                      return (
                        <TableRow key={ps.id}>
                          <TableCell>{emp ? `${emp.first_name} ${emp.last_name}` : 'Unknown'}</TableCell>
                          <TableCell style={{ fontWeight: 600 }}>${Number(ps.net_pay).toLocaleString()}</TableCell>
                          <TableCell>
                            <span className={`${styles.statusBadge} ${styles[ps.status.toLowerCase()]}`}>
                              {ps.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            {ps.status !== 'Paid' ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleMarkAsPaid(ps.id)}
                                disabled={processing}
                              >
                                Mark as Paid
                              </Button>
                            ) : (
                              <span className={styles.paidAt}>
                                <Calendar size={14} /> {ps.paid_at ? new Date(ps.paid_at).toLocaleDateString() : '-'}
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className={styles.emptyState}>
                  <Calendar size={48} />
                  <p>No payroll data for this period yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
