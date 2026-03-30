'use client';

import React, { useState } from 'react';

interface MonthFilterProps {
  currentMonth: number;
  currentYear: number;
}

export function MonthFilter({ currentMonth, currentYear }: MonthFilterProps) {
  // Generate last 12 months as options
  const months = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(currentYear, currentMonth - i, 1);
    months.push({
      value: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    });
  }

  const [selected, setSelected] = useState(months[0].value);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelected(e.target.value);
    // Navigate with query param
    const url = new URL(window.location.href);
    url.searchParams.set('month', e.target.value);
    window.location.href = url.toString();
  }

  return (
    <select
      value={selected}
      onChange={handleChange}
      style={{
        padding: '0.5rem 0.75rem',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.875rem',
        color: 'var(--text-primary)',
        background: 'white',
        cursor: 'pointer',
      }}
    >
      {months.map((m) => (
        <option key={m.value} value={m.value}>{m.label}</option>
      ))}
    </select>
  );
}
