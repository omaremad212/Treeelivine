import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProjects, getInvoices } from '../../api'
import { useTranslation } from '../../hooks/useTranslation'
import StatusBadge from '../../components/StatusBadge'
import KPICard from '../../components/KPICard'
import LoadingSpinner from '../../components/LoadingSpinner'

export default function PortalDashboardPage() {
  const { t } = useTranslation()
  const [projects, setProjects] = useState([])
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getProjects(), getInvoices()])
      .then(([pRes, iRes]) => {
        setProjects(pRes.data.data)
        setInvoices(iRes.data.data)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  const unpaidInvoices = invoices.filter(i => ['unpaid','issued','partially_paid','overdue'].includes(i.status))
  const unpaidTotal = unpaidInvoices.reduce((a, i) => a + (i.remainingAmountBase || 0), 0)
  const fmt = (n) => (n || 0).toLocaleString('ar-SA', { maximumFractionDigits: 0 })

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{t.portal.title}</h1>
      </div>

      <div className="kpi-grid">
        <KPICard label={t.portal.totalProjects} value={projects.length} icon="📁" color="blue" />
        <KPICard label={t.portal.totalInvoices} value={invoices.length} icon="🧾" color="blue" />
        <KPICard label={t.portal.unpaidTotal} value={`${fmt(unpaidTotal)} ر.س`} icon="💳" color={unpaidTotal > 0 ? 'red' : 'green'} />
      </div>

      <div className="grid-2" style={{ gap: '20px', marginTop: '8px' }}>
        <div className="card">
          <div className="card-header">
            <span className="section-title">{t.portal.recentProjects}</span>
            <Link to="/portal/projects" style={{ color: 'var(--primary)', fontSize: '.82rem' }}>عرض الكل</Link>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {projects.slice(0, 5).map(p => (
              <div key={p._id} style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '.88rem' }}>{p.name}</div>
                  {p.briefTemplateId && <div style={{ marginTop: '4px' }}><StatusBadge status={p.briefStatus || 'not_started'} /></div>}
                </div>
                <StatusBadge status={p.status} />
              </div>
            ))}
            {projects.length === 0 && <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>{t.common.noData}</div>}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="section-title">{t.portal.recentInvoices}</span>
            <Link to="/portal/invoices" style={{ color: 'var(--primary)', fontSize: '.82rem' }}>عرض الكل</Link>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {invoices.slice(0, 5).map(inv => (
              <div key={inv._id} style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '.88rem' }}>{inv.invoiceNumber}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '.8rem' }}>{(inv.amountBase || 0).toLocaleString()} ر.س</div>
                </div>
                <StatusBadge status={inv.status} />
              </div>
            ))}
            {invoices.length === 0 && <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>{t.common.noData}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
