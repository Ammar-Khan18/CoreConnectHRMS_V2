'use server'

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Updates the base salary for a specific employee profile.
 */
export async function updateBaseSalary(profileId: string, amount: number) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('profiles')
    .update({ base_salary: amount })
    .eq('id', profileId);

  if (error) {
    throw new Error(`Failed to update salary: ${error.message}`);
  }

  revalidatePath('/dashboard/hr/payroll');
}

/**
 * Generates monthly payslips for all active employees.
 * Includes a fixed 5% tax deduction.
 */
export async function generatePayrollRun(month: number, year: number) {
  const supabase = await createClient();

  // 1. Fetch all active employees with a base salary > 0
  const { data: employees, error: fetchError } = await supabase
    .from('profiles')
    .select('id, base_salary')
    .eq('status', 'Active')
    .gt('base_salary', 0);

  if (fetchError) {
    throw new Error(`Failed to fetch employees: ${fetchError.message}`);
  }

  if (!employees || employees.length === 0) {
    throw new Error('No active employees with base salaries found to process.');
  }

  // 2. Prepare payslip records
  const payslips = employees.map(emp => {
    const basePay = Number(emp.base_salary);
    const taxDeduction = basePay * 0.05; // 5% Tax
    const netPay = basePay - taxDeduction;

    return {
      user_id: emp.id,
      month,
      year,
      base_pay: basePay,
      tax_deduction: taxDeduction,
      bonus: 0,
      net_pay: netPay,
      status: 'Pending'
    };
  });

  // 3. Batch insert (ignore duplicates if they exist via ON CONFLICT if we had it, 
  // but using UNIQUE constraint we'll just try to insert and catch errors)
  const { error: insertError } = await supabase
    .from('payslips')
    .upsert(payslips, { onConflict: 'user_id,month,year' });

  if (insertError) {
    throw new Error(`Failed to generate payroll: ${insertError.message}`);
  }

  revalidatePath('/dashboard/hr/payroll');
}

/**
 * Marks a specific payslip as paid.
 */
export async function markPayslipAsPaid(payslipId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('payslips')
    .update({ 
      status: 'Paid',
      paid_at: new Date().toISOString()
    })
    .eq('id', payslipId);

  if (error) {
    throw new Error(`Failed to mark as paid: ${error.message}`);
  }

  revalidatePath('/dashboard/hr/payroll');
}
