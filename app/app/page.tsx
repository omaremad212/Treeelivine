'use client'
import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import KPICard from '@/components/ui/KPICard'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

const DATE_RANGES = ['today', '7d', '30d', 'month', 'quarter']

export default function DashboardPage() {
  const { t, settings } = useApp()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [range, setRange] = useState('30d')

  useEffect(() => {
    setLoading(true)
    fetch(`/api/dashboard?range=${range}`)
      .then(r => r.json())
      .then(d => { if (d.success) setData(d.data) })
      .finally(() => setLoading(false))
  }, [range])

  const cur = settings?.defaultCurrency || 'SAR'

  return (
    <div style={{ padding: '1.5rem', flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{t.dashboard || 'Dashboard'}</h2>
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          {DATE_RANGES.map(r => (
            <button
              key={r}
              className="btn"
              onClick={() => setRange(r)}
              style={{
                padding: '0.35rem 0.75rem', fontSize: '0.8rem',
                background: range === r ? 'var(--accent)' : 'var(--surface2)',
                color: range === r ? '#fff' : 'var(--text)',
                border: '1px solid var(--border)',
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {loading ? <LoadingSpinner /> : data ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <KPICard title={t.revenue || 'Revenue'} value={`${cur} ${(data.revenue || 0).toLocaleString()}`} icon="💰" color="var(--success)" />
            <KPICard title={t.expenses || 'Expenses'} value={`${cur} ${(data.expenses || 0).toLocaleString()}`} icon="📤" color="var(--danger)" />
            <KPICard title={t.profit || 'Profit'} value={`${cur} ${(data.profit || 0).toLocaleString()}`} icon="📈" color="var(--accent)" />
            <KPICard title={t.customers || 'Customers'} value={data.customers || 0} icon="👥" color="var(--info)" />
            <KPICard title={t.activeProjects || 'Active Projects'} value={data.activeProjects || 0} icon="📁" color="var(--warning)" />
            <KPICard title={t.pendingTasks || 'Pending Tasks'} value={data.pendingTasks || 0} icon="✅" color="var(--text-muted)" />
            <KPICard title={t.overdueTasks || 'Overdue'} value={data.overdueTasks || 0} icon="⚠️" color="var(--danger)" />
            <KPICard title={t.unpaidInvoices || 'Unpaid Invoices'} value={data.unpaidInvoices || 0} icon="📋" color="var(--warning)" />
          </div>

          {data.recentActivity?.length > 0 && (
            <div className="card">
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem' }}>{t.recentActivity || 'Recent Activity'}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {data.recentActivity.map((a: any, i: number) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', borderRadius: 8, background: 'var(--surface2)' }}>
                    <span style={{ fontSize: '1rem' }}>{a.icon || '•'}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.85rem' }}>{a.text}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <p style={{ color: 'var(--text-muted)' }}>No data available</p>
      )}
    </div>
  )
}
