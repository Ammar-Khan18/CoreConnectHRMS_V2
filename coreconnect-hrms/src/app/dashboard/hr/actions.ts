'use server'

import { createClient as createJSClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addEmployee(formData: FormData) {
  // We use the naked JS client here instead of the @supabase/ssr client.
  // This is a direct API call that WILL NOT modify the HR admin's NextJS session cookies,
  // preventing the bug where creating a user accidentally logs the HR out!
  const supabaseAPI = createJSClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
        data: {
            first_name: formData.get('first_name') as string,
            last_name: formData.get('last_name') as string,
            role: formData.get('role') as string || 'Employee',
            department: formData.get('department') as string,
        }
    }
  }

  const { error } = await supabaseAPI.auth.signUp(data);

  if (error) {
    console.error('Add Employee error:', error.message);
    redirect(`/dashboard/hr/employees/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath('/dashboard/hr/employees');
  redirect('/dashboard/hr/employees');
}
