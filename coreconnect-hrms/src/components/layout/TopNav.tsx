import React from 'react';
import { Bell, Search } from 'lucide-react';
import styles from './TopNav.module.css';

export const TopNav = () => {
  return (
    <header className={styles.header}>
      <div className={styles.searchContainer}>
        <Search className={styles.searchIcon} size={20} />
        <input 
          type="text" 
          placeholder="Search employees, documents..." 
          className={styles.searchInput}
        />
      </div>
      <div className={styles.actions}>
        <button className={styles.iconButton}>
          <Bell size={20} />
          <span className={styles.badge}></span>
        </button>
      </div>
    </header>
  );
};
