'use client'
import { ReactNode } from 'react'

interface Props {
  title: string
  value: string | number
  icon?: ReactNode
  color?: string
  sub?: string
}

export default function KPICard({ title, value, icon, color = 'var(--accent)', sub }: Props) {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
      {icon && (
        <div style={{ width: 44, height: 44, borderRadius: 10, background: color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0 }}>
          {icon}
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{title}</p>
        <p style={{ fontSize: '1.5rem', fontWeight: 700, color }}>{value}</p>
        {sub && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{sub}</p>}
      </div>
    </div>
  )
}
