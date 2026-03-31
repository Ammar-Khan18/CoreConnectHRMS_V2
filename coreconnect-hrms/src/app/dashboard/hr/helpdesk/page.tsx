import React from 'react';
import { getAllTickets } from './actions';
import TicketManager from './TicketManager';

export default async function HRHelpdeskPage() {
  const tickets = await getAllTickets();

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#111827', margin: '0 0 0.5rem 0' }}>Helpdesk Ticket Management</h1>
        <p style={{ color: '#6b7280', margin: 0 }}>Review and resolve issues submitted by employees across different departments.</p>
      </div>

      <TicketManager tickets={tickets as any} />
    </div>
  );
}
