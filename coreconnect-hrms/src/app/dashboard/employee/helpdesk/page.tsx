import React from 'react';
import { getEmployeeTickets } from './actions';
import TicketForm from './TicketForm';
import TicketList from './TicketList';

export default async function HelpdeskPage() {
  const tickets = await getEmployeeTickets();

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#111827', margin: '0 0 0.5rem 0' }}>IT Helpdesk & Tickets</h1>
          <p style={{ color: '#6b7280', margin: 0 }}>Register and track your technical issues or facility requests.</p>
        </div>
        <TicketForm />
      </div>

      <TicketList tickets={tickets as any} />
    </div>
  );
}
