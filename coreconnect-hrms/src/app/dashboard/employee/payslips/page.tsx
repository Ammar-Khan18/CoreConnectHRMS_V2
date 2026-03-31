import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { EmployeePayslips } from './EmployeePayslips';
import styles from './page.module.css';

export default async function MyPayslipsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Fetch the employee's profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name')
    .eq('id', user.id)
    .single();

  // Fetch the employee's payslips
  const { data: payslips } = await supabase
    .from('payslips')
    .select('*')
    .eq('user_id', user.id)
    .order('year', { ascending: false })
    .order('month', { ascending: false });

  const employeeName = profile ? `${profile.first_name} ${profile.last_name}` : 'Employee';

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>My Payslips</h1>
        <p className={styles.subtitle}>Manage and view your monthly payment history and tax deductions.</p>
      </header>

      <EmployeePayslips 
        payslips={payslips || []} 
        employeeName={employeeName} 
      />
    </div>
  );
}
