'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { submitTicket } from './actions'

const CATEGORIES = [
  'IT Support',
  'HR Inquiries',
  'Facility Management',
  'Equipment Request',
  'Other'
]

const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent']

export default function TicketForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await submitTicket(formData)

    setIsSubmitting(false)
    if (result.error) {
      setError(result.error)
    } else {
      setIsOpen(false)
      // The page will revalidate due to revalidatePath in the action
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Create New Ticket</Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Register New Issue">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label htmlFor="subject" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Subject</label>
            <Input name="subject" id="subject" placeholder="e.g. Laptop not starting" required />
          </div>

          <div>
            <label htmlFor="category" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Category</label>
            <select 
              name="category" 
              id="category" 
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                border: '1px solid #d1d5db',
                backgroundColor: 'white'
              }}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="priority" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Priority</label>
            <select 
              name="priority" 
              id="priority" 
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                border: '1px solid #d1d5db',
                backgroundColor: 'white'
              }}
            >
              {PRIORITIES.map(prio => (
                <option key={prio} value={prio}>{prio}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="description" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Description</label>
            <textarea 
              name="description" 
              id="description" 
              rows={4}
              required
              placeholder="Describe your issue in detail..."
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                border: '1px solid #d1d5db'
              }}
            />
          </div>

          {error && <p style={{ color: '#ef4444', fontSize: '0.875rem' }}>{error}</p>}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
            <Button variant="secondary" type="button" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}
