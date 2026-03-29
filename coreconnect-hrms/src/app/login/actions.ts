'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data: authData, error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.error('Login error:', error.message)
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  let redirectPath = '/dashboard/employee'
  if (authData.user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', authData.user.id).single()
    if (profile?.role === 'Admin') redirectPath = '/dashboard/admin'
    if (profile?.role === 'HR') redirectPath = '/dashboard/hr/employees'
  }

  revalidatePath('/', 'layout')
  redirect(redirectPath)
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
        data: {
            first_name: formData.get('first_name') as string,
            last_name: formData.get('last_name') as string,
            role: formData.get('role') as string || 'Employee',
        }
    }
  }

  const { data: authData, error } = await supabase.auth.signUp(data)

  if (error) {
    console.error('Signup error:', error.message)
    redirect(`/login?mode=signup&error=${encodeURIComponent(error.message)}`)
  }

  let redirectPath = '/dashboard/employee'
  if (authData.user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', authData.user.id).single()
    if (profile?.role === 'Admin') redirectPath = '/dashboard/admin'
    if (profile?.role === 'HR') redirectPath = '/dashboard/hr/employees'
  }

  revalidatePath('/', 'layout')
  redirect(redirectPath)
}

export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
