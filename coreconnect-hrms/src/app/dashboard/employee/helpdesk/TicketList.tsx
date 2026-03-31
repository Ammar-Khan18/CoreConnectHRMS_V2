'use client'

import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface Ticket {
  id: string
  subject: string
  description: string
  category: string
  priority: string
  status: string
  resolution_note?: string
  created_at: string
}

export default function TicketList({ tickets }: { tickets: Ticket[] }) {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved': return '#10b981'
      case 'pending': return '#f59e0b'
      default: return '#6b7280'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent': return '#ef4444'
      case 'high': return '#f97316'
      case 'medium': return '#3b82f6'
      default: return '#6b7280'
    }
  }

  if (tickets.length === 0) {
    return (
      <Card>
        <CardContent style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
          No tickets found. If you have an issue, create a new ticket above.
        </CardContent>
      </Card>
    )
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '1.5rem' }}>
      <div style={{ flex: 1 }}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id} onClick={() => setSelectedTicket(ticket)} style={{ cursor: 'pointer' }}>
                <TableCell style={{ fontWeight: 500 }}>{ticket.subject}</TableCell>
                <TableCell>{ticket.category}</TableCell>
                <TableCell>
                  <span style={{ 
                    color: getPriorityColor(ticket.priority),
                    fontWeight: 600,
                    fontSize: '0.75rem'
                  }}>
                    {ticket.priority.toUpperCase()}
                  </span>
                </TableCell>
                <TableCell>
                  <span style={{ 
                    backgroundColor: getStatusColor(ticket.status) + '20',
                    color: getStatusColor(ticket.status),
                    padding: '0.2rem 0.5rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}>
                    {ticket.status}
                  </span>
                </TableCell>
                <TableCell>{new Date(ticket.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                   <Button variant="secondary" size="sm" onClick={() => setSelectedTicket(ticket)}>View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div style={{ position: 'sticky', top: '1.5rem' }}>
        <Card>
          <CardContent style={{ padding: '1.5rem' }}>
            {selectedTicket ? (
              <>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.125rem', fontWeight: 600 }}>Ticket Details</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                   <div>
                      <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>Subject</span>
                      <p style={{ margin: '0.25rem 0 0 0', fontWeight: 500 }}>{selectedTicket.subject}</p>
                   </div>
                   <div>
                      <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>Description</span>
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#374151', lineHeight: '1.5' }}>{selectedTicket.description}</p>
                   </div>
                   {selectedTicket.status === 'Resolved' && (
                     <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#ecfdf5', borderRadius: '0.5rem', border: '1px solid #10b981' }}>
                        <span style={{ fontSize: '0.75rem', color: '#059669', textTransform: 'uppercase', fontWeight: 600 }}>HR Resolution Note</span>
                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#065f46', fontStyle: 'italic' }}>
                          {selectedTicket.resolution_note || 'Issue has been resolved.'}
                        </p>
                     </div>
                   )}
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', color: '#9ca3af', padding: '2rem 0' }}>
                Select a ticket to view details.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
