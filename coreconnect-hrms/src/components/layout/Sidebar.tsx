import React from 'react';
import Link from 'next/link';
import { Home, Users, Calendar, Clock, HelpCircle, Briefcase, FileText, Settings, LogOut } from 'lucide-react';
import styles from './Sidebar.module.css';
import { signout } from '@/app/login/actions';

const navItems = [
  { href: '/dashboard/employee', label: 'My Dashboard', icon: Home, role: 'all' },
  { href: '/dashboard/employee/attendance', label: 'My Attendance', icon: Clock, role: 'all' },
  { href: '/dashboard/employee/leave', label: 'My Leaves', icon: Calendar, role: 'all' },
  { href: '/dashboard/hr/employees', label: 'Manage Employees', icon: Users, role: 'hr' },
  { href: '/dashboard/hr/payroll', label: 'Payroll', icon: Briefcase, role: 'hr' },
  { href: '/dashboard/hr/announcements', label: 'Announcements', icon: FileText, role: 'hr' },
  { href: '/dashboard/admin', label: 'Admin Settings', icon: Settings, role: 'admin' },
  { href: '/dashboard/employee/helpdesk', label: 'Helpdesk', icon: HelpCircle, role: 'all' },
];

export const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon} />
        <span className={styles.logoText}>CoreConnect</span>
      </div>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link href={item.href} className={styles.navItem}>
                  <Icon className={styles.icon} size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className={styles.footer}>
        <div className={styles.userCard}>
          <div className={styles.avatar}>A</div>
          <div className={styles.userInfo}>
            <p className={styles.userName}>Ammar Khan</p>
            <p className={styles.userRole}>Admin</p>
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
