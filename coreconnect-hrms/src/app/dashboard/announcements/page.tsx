import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { AnnouncementForm } from './AnnouncementForm';
import styles from './page.module.css';
import { redirect } from 'next/navigation';

export default async function AnnouncementsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const isHRorAdmin = profile?.role === 'HR' || profile?.role === 'Admin';

  const { data: announcements, error } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Fetch announcements error:', error.message);
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Company Announcements</h1>
          <p className={styles.subtitle}>Stay updated with the latest news, policy changes, and organization-wide memos.</p>
        </div>
        {isHRorAdmin && <AnnouncementForm />}
      </div>

      <div className={styles.announcementGrid}>
        {announcements && announcements.length > 0 ? (
          announcements.map((ann) => (
            <div key={ann.id} className={styles.announcementCard}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>{ann.title}</h2>
                <span className={styles.date}>{formatDate(ann.created_at)}</span>
              </div>
              <div className={styles.cardBody}>
                {ann.body}
              </div>
              <div className={styles.cardFooter}>
                <div className={styles.authorAvatar}>
                  {ann.author_name.charAt(0)}
                </div>
                <div className={styles.authorInfo}>
                  <span className={styles.authorName}>{ann.author_name}</span>
                  <span className={styles.authorRole}>{ann.author_role}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', color: '#9ca3af' }}>📣</div>
            <h2 className={styles.emptyTitle}>No announcements yet</h2>
            <p style={{ color: '#6b7280', maxWidth: '400px', margin: '0 auto' }}>
              When organization-wide updates are posted, they will appear here. Stay tuned!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
