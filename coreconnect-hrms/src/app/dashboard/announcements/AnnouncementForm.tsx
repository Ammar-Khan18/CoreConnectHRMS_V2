'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Plus } from 'lucide-react';
import { createAnnouncement } from './actions';
import { useRouter } from 'next/navigation';

export function AnnouncementForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    try {
      await createAnnouncement(formData);
      setIsOpen(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Plus size={18} style={{ marginRight: '0.5rem' }} /> Post Announcement
      </Button>

      <Modal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        title="Post New Announcement"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {error && (
            <div style={{ padding: '0.75rem', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '6px', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="title" style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>Title</label>
            <input 
              name="title" 
              id="title" 
              required 
              placeholder="E.g., Holiday Notice, Policy Update..."
              style={{ padding: '0.625rem', border: '1px solid #d1d5db', borderRadius: '6px', width: '100%', fontSize: '0.875rem' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="body" style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>Content</label>
            <textarea 
              name="body" 
              id="body" 
              required 
              rows={5}
              placeholder="Write your announcement here..."
              style={{ padding: '0.625rem', border: '1px solid #d1d5db', borderRadius: '6px', width: '100%', fontSize: '0.875rem', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={loading}
              style={{ backgroundColor: 'white', color: '#374151', border: '1px solid #d1d5db' }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Posting...' : 'Shoot Announcement'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
