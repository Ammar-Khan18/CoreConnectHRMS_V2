'use server'

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createAnnouncement(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  // Fetch author details to include in the announcement
  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name, role')
    .eq('id', user.id)
    .single();

  if (!profile || (profile.role !== 'HR' && profile.role !== 'Admin')) {
    throw new Error('Unauthorized: Only HR and Admin can post announcements.');
  }

  const title = formData.get('title') as string;
  const body = formData.get('body') as string;

  if (!title || !body) {
    throw new Error('Title and body are required.');
  }

  const { error } = await supabase
    .from('announcements')
    .insert({
      title,
      body,
      author_id: user.id,
      author_name: `${profile.first_name} ${profile.last_name}`,
      author_role: profile.role
    });

  if (error) {
    console.error('Create announcement error:', error.message);
    throw new Error('Failed to create announcement: ' + error.message);
  }

  revalidatePath('/dashboard/announcements');
}
