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
import { Modal } from '@/components/ui/Modal'
import { resolveTicket } from './actions'

interface Ticket {
  id: string
  subject: string
  description: string
  category: string
  priority: string
  status: string
  resolution_note?: string
  created_at: string
  profiles: {
    first_name: string
    last_name: string
  }
}

export default function TicketManager({ tickets }: { tickets: Ticket[] }) {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [resolutionNote, setResolutionNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved': return '#10b981'
      case 'pending': return '#f59e0b'
      default: return '#6b7280'
    }
  }

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTicket) return

    setIsSubmitting(true)
    const formData = new FormData()
    formData.append('ticketId', selectedTicket.id)
    formData.append('resolutionNote', resolutionNote)

    const result = await resolveTicket(formData)
    setIsSubmitting(false)

    if (result.success) {
      setIsModalOpen(false)
      setSelectedTicket(null)
      setResolutionNote('')
    } else {
      alert(result.error || 'Failed to resolve ticket')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <Card>
        <CardContent style={{ padding: '0' }}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                    No tickets found.
                  </TableCell>
                </TableRow>
              ) : (
                tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell style={{ fontWeight: 500 }}>
                      {ticket.profiles.first_name} {ticket.profiles.last_name}
                    </TableCell>
                    <TableCell>{ticket.subject}</TableCell>
                    <TableCell>{ticket.category}</TableCell>
                    <TableCell>
                      <span style={{ 
                        color: ticket.priority === 'Urgent' ? '#ef4444' : '#3b82f6',
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
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => {
                          setSelectedTicket(ticket)
                          setIsModalOpen(true)
                        }}
                      >
                        {ticket.status === 'Resolved' ? 'View' : 'Review & Resolve'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={selectedTicket?.status === 'Resolved' ? "View Ticket" : "Resolve Ticket"}
      >
        {selectedTicket && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <p style={{ margin: '0', fontSize: '0.875rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Employee</p>
              <p style={{ margin: '0.25rem 0 0 0', fontWeight: 500 }}>{selectedTicket.profiles.first_name} {selectedTicket.profiles.last_name}</p>
            </div>
            <div>
              <p style={{ margin: '0', fontSize: '0.875rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Subject</p>
              <p style={{ margin: '0.25rem 0 0 0', fontWeight: 500 }}>{selectedTicket.subject}</p>
            </div>
            <div>
              <p style={{ margin: '0', fontSize: '0.875rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Description</p>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', lineHeight: '1.5' }}>{selectedTicket.description}</p>
            </div>

            <hr style={{ border: '0', borderTop: '1px solid #e5e7eb', margin: '0.5rem 0' }} />

            {selectedTicket.status === 'Resolved' ? (
              <div>
                <p style={{ margin: '0', fontSize: '0.875rem', color: '#10b981', fontWeight: 600, textTransform: 'uppercase' }}>Resolution Note</p>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', fontStyle: 'italic' }}>{selectedTicket.resolution_note || 'Resolved'}</p>
              </div>
            ) : (
              <form onSubmit={handleResolve} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label htmlFor="resolutionNote" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>Resolution Note</label>
                  <textarea 
                    id="resolutionNote"
                    value={resolutionNote}
                    onChange={(e) => setResolutionNote(e.target.value)}
                    rows={3}
                    placeholder="Describe how the issue was resolved..."
                    required
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '0.375rem',
                      border: '1px solid #d1d5db'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Processing...' : 'Mark as Resolved'}
                  </Button>
                </div>
              </form>
            )}

            {selectedTicket.status === 'Resolved' && (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Close</Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
