import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { addEmployee } from '../../actions';

export default async function AddEmployeePage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const isError = resolvedParams?.error;

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#111827', margin: '0 0 0.5rem 0' }}>Add New Employee</h1>
          <p style={{ color: '#6b7280', margin: 0 }}>Create a new employee profile and generate their credentials.</p>
        </div>
        <Link href="/dashboard/hr/employees">
          <Button variant="outline">Cancel</Button>
        </Link>
      </div>
      
      <Card>
        <CardContent style={{ padding: '2rem' }}>
          {isError && (
            <div style={{ padding: '1rem', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '6px', marginBottom: '1.5rem' }}>
              Error: {isError}
            </div>
          )}
          
          <form action={addEmployee} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Input id="first_name" name="first_name" type="text" label="First Name" placeholder="Jane" required fullWidth />
              <Input id="last_name" name="last_name" type="text" label="Last Name" placeholder="Doe" required fullWidth />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <Input id="email" name="email" type="email" label="Company Email" placeholder="jane.doe@company.com" required fullWidth />
              <Input id="password" name="password" type="password" label="Temporary Password" placeholder="••••••••" required fullWidth />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                <label htmlFor="role" style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6b7280' }}>System Role</label>
                <select id="role" name="role" required style={{ padding: '0.625rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', outline: 'none' }}>
                  <option value="Employee">Employee</option>
                  <option value="HR">Human Resources</option>
                  <option value="Admin">System Admin</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                <label htmlFor="department" style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6b7280' }}>Department</label>
                <select id="department" name="department" required style={{ padding: '0.625rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', outline: 'none' }}>
                  <option value="Engineering">Engineering</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="submit" variant="primary">Create Employee Record</Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}
