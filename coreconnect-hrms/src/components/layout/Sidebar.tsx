import React from 'react';
import Link from 'next/link';
import { Home, Users, Calendar, Clock, HelpCircle, Briefcase, FileText, Settings, LogOut } from 'lucide-react';
import styles from './Sidebar.module.css';
import { signout } from '@/app/login/actions';
import { createClient } from '@/utils/supabase/server';
import { SidebarNav } from './SidebarNav';

export const Sidebar = async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let firstName = 'System';
  let lastName = 'User';
  let role = 'Employee';
  let initial = 'S';

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name, last_name, role')
      .eq('id', user.id)
      .single();
    
    if (profile) {
      firstName = profile.first_name || firstName;
      lastName = profile.last_name || lastName;
      role = profile.role || role;
      initial = firstName.charAt(0).toUpperCase();
    }
  }

  const fullName = lastName ? `${firstName} ${lastName}` : firstName;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon} />
        <span className={styles.logoText}>CoreConnect</span>
      </div>
      
      <SidebarNav userRole={role} />

      <div className={styles.footer}>
        <div className={styles.userCard}>
          <div className={styles.avatar}>{initial}</div>
          <div className={styles.userInfo}>
            <p className={styles.userName}>{fullName}</p>
            <p className={styles.userRole}>{role}</p>
          </div>
        </div>
        <form action={signout} className={styles.logoutForm}>
          <button type="submit" className={styles.logoutBtn}>
            <LogOut size={18} />
            <span>Sign out</span>
          </button>
        </form>
      </div>
    </aside>
  );
};
