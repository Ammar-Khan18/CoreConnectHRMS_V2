import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';

export default function BarebonesPage({ title = "Page Title", desc = "This module is coming soon." }) {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#111827', margin: '0 0 0.5rem 0' }}>{title}</h1>
        <p style={{ color: '#6b7280', margin: 0 }}>{desc}</p>
      </div>
      
      <Card>
        <CardContent style={{ padding: '3rem', textAlign: 'center', backgroundColor: '#f9fafb' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', color: '#9ca3af' }}>🚧</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Module Under Construction</h2>
          <p style={{ color: '#6b7280', maxWidth: '400px', margin: '0 auto' }}>
            The {title.toLowerCase()} feature is currently being developed and will be available in a future update.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
