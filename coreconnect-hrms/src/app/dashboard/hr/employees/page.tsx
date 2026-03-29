import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Plus, Search, MoreHorizontal } from 'lucide-react';
import styles from './page.module.css';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function EmployeeListPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: userProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (userProfile?.role !== 'HR' && userProfile?.role !== 'Admin') {
    redirect('/unauthorized');
  }
  
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  const employees = profiles?.map((p, index) => ({
    id: `EMP-${(index + 1).toString().padStart(3, '0')}`,
    name: `${p.first_name} ${p.last_name}`,
    role: p.role || 'Employee',
    dept: p.department || 'Unassigned',
    status: p.status || 'Active'
  })) || [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Employees Data</h1>
          <p className={styles.subtitle}>Manage your organization's workforce here.</p>
        </div>
        <Link href="/dashboard/hr/employees/new">
          <Button className={styles.addButton}>
            <Plus size={18} className={styles.btnIcon} /> Add Employee
          </Button>
        </Link>
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
