import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { PayrollClient } from './PayrollClient';
import styles from './page.module.css';

export default async function HRPayrollPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Verify the user is HR or Admin
  const { data: userProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (userProfile?.role !== 'HR' && userProfile?.role !== 'Admin') {
    redirect('/unauthorized');
  }

  // Fetch all profiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, role, department, base_salary')
    .order('first_name', { ascending: true });

  // Fetch all payslips
  const { data: payslips } = await supabase
    .from('payslips')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Payroll Management</h1>
          <p className={styles.subtitle}>Manage employee salaries, process monthly payments, and track tax deductions.</p>
        </div>
      </header>

      <PayrollClient 
        profiles={profiles || []} 
        initialPayslips={payslips || []} 
      />
    </div>
  );
}
