'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useApp } from '@/contexts/AppContext'
import StatusBadge from '@/components/ui/StatusBadge'
import KPICard from '@/components/ui/KPICard'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function PortalDashboard() {
  const { t } = useApp()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/portal')
      .then(r => r.json())
      .then(d => { if (d.success) setData(d.data) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />
  if (!data) return <p style={{ color: 'var(--text-muted)' }}>Could not load portal data</p>

  const activeProjects = (data.projects || []).filter((p: any) => p.status === 'active').length
  const unpaidInvoices = (data.invoices || []).filter((i: any) => i.status !== 'paid').length

  return (
    <div>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Welcome, {data.customer?.name}</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <KPICard title="Active Projects" value={activeProjects} icon="📁" />
        <KPICard title="Total Projects" value={data.projects?.length || 0} icon="📋" />
        <KPICard title="Unpaid Invoices" value={unpaidInvoices} icon="💳" color="var(--warning)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontWeight: 600, fontSize: '0.95rem' }}>Recent Projects</h3>
            <Link href="/portal/projects" style={{ fontSize: '0.8rem', color: 'var(--accent)', textDecoration: 'none' }}>View all</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {(data.projects || []).slice(0, 4).map((p: any) => (
              <div key={p._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem', background: 'var(--surface2)', borderRadius: 8 }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{p.name}</span>
                <StatusBadge status={p.status || 'planning'} />
              </div>
            ))}
            {data.projects?.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No projects yet</p>}
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontWeight: 600, fontSize: '0.95rem' }}>Recent Invoices</h3>
            <Link href="/portal/invoices" style={{ fontSize: '0.8rem', color: 'var(--accent)', textDecoration: 'none' }}>View all</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {(data.invoices || []).slice(0, 4).map((inv: any) => (
              <div key={inv._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem', background: 'var(--surface2)', borderRadius: 8 }}>
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 500 }}>{inv.invoiceNumber}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{inv.currency} {(inv.amountBase || 0).toLocaleString()}</p>
                </div>
                <StatusBadge status={inv.status} />
              </div>
            ))}
            {data.invoices?.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No invoices yet</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
