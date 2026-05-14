'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useApp } from '@/contexts/AppContext'
import StatusBadge from '@/components/ui/StatusBadge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function PortalProjectsPage() {
  const { t } = useApp()
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/portal')
      .then(r => r.json())
      .then(d => { if (d.success) setProjects(d.data.projects || []) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>{t.projects || 'Projects'}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {projects.map(p => (
          <div key={p._id} className="card">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <h3 style={{ fontWeight: 600 }}>{p.name}</h3>
              <StatusBadge status={p.status || 'planning'} />
            </div>
            {p.description && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem', lineHeight: 1.5 }}>{p.description}</p>}
            {p.dueDate && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Due: {new Date(p.dueDate).toLocaleDateString()}</p>}
            <Link href={`/portal/briefs/${p._id}`} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>View Brief</Link>
          </div>
        ))}
        {projects.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No projects yet</p>}
      </div>
    </div>
  )
}
