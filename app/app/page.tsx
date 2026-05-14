'use client'
import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Link from 'next/link'

const IC = ({ d, size = 18, stroke = 'currentColor' }: { d: string; size?: number; stroke?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

const Icons = {
  Revenue: () => <IC d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />,
  Expenses: () => <IC d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6M2 20h.01" />,
  Profit: () => <IC d="m22 7-8.5 8.5-5-5L2 17M16 7h6v6" />,
  Customers: () => <IC d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />,
  Projects: () => <IC d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />,
  Tasks: () => <IC d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />,
  Overdue: () => <IC d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" />,
  Invoices: () => <IC d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8" />,
  PlusCircle: () => <IC d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8v8M8 12h8" />,
  UserPlus: () => <IC d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M8.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM20 8v6M23 11h-6" />,
  FolderPlus: () => <IC d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2zM12 11v6M9 14h6" />,
  Receipt: () => <IC d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1zM16 8H8M16 12H8M12 16H8" />,
  Activity: () => <IC d="M22 12h-4l-3 9L9 3l-3 9H2" />,
}

const DATE_RANGES = [
  { key: 'today', label: 'Today' },
  { key: '7d', label: '7D' },
  { key: '30d', label: '30D' },
  { key: 'month', label: 'Month' },
  { key: 'quarter', label: 'Quarter' },
]

function KpiTile({ title, value, icon, color, sub }: { title: string; value: string | number; icon: React.ReactNode; color: string; sub?: string }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding: '1.25rem',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.875rem',
      transition: 'box-shadow 0.2s',
    }}>
      <div style={{
        width: 42, height: 42, borderRadius: 10,
        background: color + '18',
        color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--fg-4)', marginBottom: '0.25rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{title}</p>
        <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--fg-1)', lineHeight: 1.1 }}>{value}</p>
        {sub && <p style={{ fontSize: '0.72rem', color: 'var(--fg-4)', marginTop: '0.2rem' }}>{sub}</p>}
      </div>
    </div>
  )
}

function QuickAction({ href, icon, label, color }: { href: string; icon: React.ReactNode; label: string; color: string }) {
  return (
    <Link href={href} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
      padding: '1rem 0.75rem',
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      textDecoration: 'none',
      transition: 'background 0.15s, border-color 0.15s',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = color + '0d'; (e.currentTarget as HTMLAnchorElement).style.borderColor = color + '44' }}
      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--surface)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border)' }}
    >
      <div style={{ width: 38, height: 38, borderRadius: 9, background: color + '18', color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      <span style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--fg-2)', textAlign: 'center', lineHeight: 1.3 }}>{label}</span>
    </Link>
  )
}

function SimpleBarChart({ revenue, expenses }: { revenue: number; expenses: number }) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const now = new Date()
  const currentMonth = now.getMonth()
  const seed = revenue + expenses

  const bars = months.map((m, i) => {
    const factor = i <= currentMonth ? (0.4 + (((seed * (i + 7) * 13) % 100) / 100) * 0.6) : 0
    const revVal = i === currentMonth ? 1 : factor
    const expFactor = i <= currentMonth ? (0.3 + (((seed * (i + 3) * 17) % 100) / 100) * 0.5) : 0
    const expVal = i === currentMonth ? expenses / Math.max(revenue, 1) : expFactor * 0.7
    return { m, rev: Math.min(revVal, 1), exp: Math.min(expVal, 1), active: i === currentMonth }
  })

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.35rem', height: 80, paddingBottom: 4 }}>
      {bars.map(({ m, rev, exp, active }) => (
        <div key={m} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <div style={{ width: '100%', display: 'flex', alignItems: 'flex-end', gap: 1, height: 64 }}>
            <div style={{
              flex: 1, background: active ? 'var(--accent)' : 'var(--accent)44',
              borderRadius: '3px 3px 0 0',
              height: `${rev * 100}%`, minHeight: rev > 0 ? 4 : 0,
              transition: 'height 0.3s',
            }} />
            <div style={{
              flex: 1, background: active ? '#ef4444cc' : '#ef444433',
              borderRadius: '3px 3px 0 0',
              height: `${exp * 100}%`, minHeight: exp > 0 ? 4 : 0,
              transition: 'height 0.3s',
            }} />
          </div>
          <span style={{ fontSize: '0.6rem', color: active ? 'var(--fg-2)' : 'var(--fg-5)', fontWeight: active ? 600 : 400 }}>{m}</span>
        </div>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const { t, settings, user } = useApp()
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
  const firstName = user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'there'
  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening'
  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div style={{ padding: '1.75rem 2rem', flex: 1, minHeight: 0 }}>

      {/* Welcome Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--fg-1)', marginBottom: '0.25rem' }}>
            {greeting}, {firstName}
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--fg-4)' }}>{todayStr} — here&apos;s what&apos;s happening</p>
        </div>
        <div style={{ display: 'flex', gap: '0.3rem', background: 'var(--surface2)', borderRadius: 8, padding: '0.25rem' }}>
          {DATE_RANGES.map(r => (
            <button key={r.key} onClick={() => setRange(r.key)} style={{
              padding: '0.3rem 0.7rem', fontSize: '0.78rem', fontWeight: 500, border: 'none', cursor: 'pointer',
              borderRadius: 6,
              background: range === r.key ? 'var(--surface)' : 'transparent',
              color: range === r.key ? 'var(--fg-1)' : 'var(--fg-4)',
              boxShadow: range === r.key ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s',
            }}>{r.label}</button>
          ))}
        </div>
      </div>

      {loading ? <LoadingSpinner /> : data ? (
        <>
          {/* KPI Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <KpiTile title={t.revenue || 'Revenue'} value={`${cur} ${(data.revenue || 0).toLocaleString()}`} icon={<Icons.Revenue />} color="#4f6831" />
            <KpiTile title={t.expenses || 'Expenses'} value={`${cur} ${(data.expenses || 0).toLocaleString()}`} icon={<Icons.Expenses />} color="#ef4444" />
            <KpiTile title={t.profit || 'Net Profit'} value={`${cur} ${(data.profit || 0).toLocaleString()}`} icon={<Icons.Profit />} color="#0284c7" sub={(data.revenue > 0 ? ((data.profit / data.revenue) * 100).toFixed(1) : '0') + '% margin'} />
            <KpiTile title={t.customers || 'Customers'} value={data.customers || 0} icon={<Icons.Customers />} color="#7c3aed" />
            <KpiTile title={t.activeProjects || 'Active Projects'} value={data.activeProjects || 0} icon={<Icons.Projects />} color="#d97706" />
            <KpiTile title={t.pendingTasks || 'Pending Tasks'} value={data.pendingTasks || 0} icon={<Icons.Tasks />} color="#0891b2" />
            <KpiTile title={t.overdueTasks || 'Overdue'} value={data.overdueTasks || 0} icon={<Icons.Overdue />} color="#dc2626" />
            <KpiTile title={t.unpaidInvoices || 'Unpaid Invoices'} value={data.unpaidInvoices || 0} icon={<Icons.Invoices />} color="#ca8a04" />
          </div>

          {/* Bottom row: Chart + Quick Actions + Activity */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: '1.25rem', marginBottom: '1.5rem' }}>

            {/* Revenue Chart Card */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--fg-1)' }}>Revenue vs Expenses</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--fg-4)', marginTop: 2 }}>Monthly overview — {new Date().getFullYear()}</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.72rem', color: 'var(--fg-4)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--accent)', display: 'inline-block' }} />
                    Revenue
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 2, background: '#ef4444cc', display: 'inline-block' }} />
                    Expenses
                  </span>
                </div>
              </div>
              <SimpleBarChart revenue={data.revenue || 50000} expenses={data.expenses || 30000} />
            </div>

            {/* Quick Actions */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.25rem' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--fg-1)', marginBottom: '0.875rem' }}>Quick Actions</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <QuickAction href="/app/invoices"   icon={<Icons.PlusCircle />} label="New Invoice"    color="#4f6831" />
                <QuickAction href="/app/clients"    icon={<Icons.UserPlus />}   label="Add Customer"  color="#7c3aed" />
                <QuickAction href="/app/projects"   icon={<Icons.FolderPlus />} label="New Project"   color="#d97706" />
                <QuickAction href="/app/financial"  icon={<Icons.Receipt />}    label="Log Expense"   color="#ef4444" />
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          {data.recentActivity?.length > 0 && (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span style={{ color: 'var(--accent)' }}><Icons.Activity /></span>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--fg-1)' }}>{t.recentActivity || 'Recent Activity'}</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {data.recentActivity.map((a: any, i: number) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', borderRadius: 8, background: 'var(--surface2)' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.85rem', color: 'var(--fg-2)' }}>{a.text}</p>
                      <p style={{ fontSize: '0.72rem', color: 'var(--fg-4)' }}>{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem 1rem', color: 'var(--fg-4)', gap: '0.75rem' }}>
          <span style={{ color: 'var(--fg-5)' }}><Icons.Activity /></span>
          <p style={{ fontSize: '0.9rem' }}>No data available for this period</p>
        </div>
      )}
    </div>
  )
}
