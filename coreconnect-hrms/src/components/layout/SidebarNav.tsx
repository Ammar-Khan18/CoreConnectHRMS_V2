'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Calendar, Clock, HelpCircle, Briefcase, FileText, Settings } from 'lucide-react';
import styles from './Sidebar.module.css';

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

export function SidebarNav({ userRole }: { userRole: string }) {
  const pathname = usePathname();

  // Filter items based on user role
  const filteredNavItems = navItems.filter((item) => {
    if (item.role === 'all') return true;
    if (userRole === 'Admin') return true; // Admins see everything
    if (userRole === 'HR' && item.role === 'hr') return true;
    return false;
  });

  return (
    <nav className={styles.nav}>
      <ul className={styles.navList}>
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.href}>
              <Link 
                href={item.href} 
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                style={isActive ? { backgroundColor: 'var(--primary, #4f46e5)', color: 'white' } : {}}
              >
                <Icon className={styles.icon} size={20} />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
