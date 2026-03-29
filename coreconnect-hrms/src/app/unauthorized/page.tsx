import React from 'react';
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100vw',
      backgroundColor: 'var(--bg-secondary, #f8fafc)',
      fontFamily: 'var(--font-primary, sans-serif)'
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '3rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        textAlign: 'center',
        maxWidth: '450px'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛑</div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#111827', margin: '0 0 1rem 0' }}>Access Denied</h1>
        <p style={{ color: '#6b7280', margin: '0 0 2rem 0', lineHeight: 1.5 }}>
          You don't have permission to access this page. Please return to your designated dashboard area.
        </p>
        <Link 
          href="/dashboard/employee" 
          style={{
            backgroundColor: 'var(--primary, #4f46e5)',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 500,
            display: 'inline-block'
          }}
        >
          Return to My Dashboard
        </Link>
      </div>
    </div>
  );
}
