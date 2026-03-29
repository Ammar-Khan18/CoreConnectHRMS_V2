import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Plus, Search, MoreHorizontal } from 'lucide-react';
import styles from './page.module.css';

export default function EmployeeListPage() {
  const employees = [
    { id: 'EMP-001', name: 'Ammar Khan', role: 'System Admin', dept: 'IT', status: 'Active' },
    { id: 'EMP-002', name: 'Sarah Jenkins', role: 'HR Manager', dept: 'Human Resources', status: 'Active' },
    { id: 'EMP-003', name: 'Alex Chen', role: 'Software Engineer', dept: 'Engineering', status: 'Onboarding' },
    { id: 'EMP-004', name: 'Maria Garcia', role: 'Marketing Lead', dept: 'Marketing', status: 'Active' },
    { id: 'EMP-005', name: 'James Doe', role: 'Sales rep', dept: 'Sales', status: 'Inactive' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Employees Data</h1>
          <p className={styles.subtitle}>Manage your organization's workforce here.</p>
        </div>
        <Button className={styles.addButton}>
          <Plus size={18} className={styles.btnIcon} /> Add Employee
        </Button>
      </div>

      <Card>
        <CardHeader className={styles.toolbar}>
          <div className={styles.searchBox}>
            <Search className={styles.searchIcon} size={18} />
            <input type="text" placeholder="Search employees..." className={styles.searchInput} />
          </div>
          <div className={styles.filters}>
            <select className={styles.filterSelect}>
              <option>All Departments</option>
              <option>IT</option>
              <option>Human Resources</option>
              <option>Engineering</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Employee Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell className={styles.empId}>{emp.id}</TableCell>
                  <TableCell>
                    <div className={styles.empInfo}>
                      <div className={styles.empAvatar}>{emp.name.charAt(0)}</div>
                      <span className={styles.empName}>{emp.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{emp.role}</TableCell>
                  <TableCell>{emp.dept}</TableCell>
                  <TableCell>
                    <span className={`${styles.statusBadge} ${styles[emp.status.toLowerCase()]}`}>
                      {emp.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <button className={styles.actionBtn}>
                      <MoreHorizontal size={18} />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
