import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getInvoices } from '../../api'
import { useTranslation } from '../../hooks/useTranslation'
import StatusBadge from '../../components/StatusBadge'
import LoadingSpinner from '../../components/LoadingSpinner'

export default function PortalInvoicesPage() {
  const { t } = useTranslation()
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getInvoices().then(res => setInvoices(res.data.data)).finally(() => setLoading(false))
  }, [])

  const fmt = (n) => (n || 0).toLocaleString('ar-SA', { maximumFractionDigits: 2 })

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{t.portal.invoices}</h1>
      </div>
      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>{t.finance.invoiceNumber}</th>
                <th>{t.common.project}</th>
                <th>{t.finance.total}</th>
                <th>{t.finance.remaining}</th>
                <th>{t.common.status}</th>
                <th>{t.finance.issueDate}</th>
                <th>{t.common.dueDate}</th>
                <th>{t.common.actions}</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>{t.common.noData}</td></tr>
              ) : invoices.map(inv => (
                <tr key={inv._id}>
                  <td><b>{inv.invoiceNumber}</b></td>
                  <td>{inv.projectId?.name || '-'}</td>
                  <td>{fmt(inv.amountBase)} ر.س</td>
                  <td style={{ color: (inv.remainingAmountBase || 0) > 0 ? 'var(--danger)' : 'var(--success)' }}>
                    {fmt(inv.remainingAmountBase)} ر.س
                  </td>
                  <td><StatusBadge status={inv.status} /></td>
                  <td>{inv.issueDate ? new Date(inv.issueDate).toLocaleDateString('ar') : '-'}</td>
                  <td style={{ color: inv.dueDate && new Date(inv.dueDate) < new Date() && !['paid','cancelled'].includes(inv.status) ? 'var(--danger)' : undefined }}>
                    {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString('ar') : '-'}
                  </td>
                  <td>
                    <Link to={`/portal/invoices/${inv._id}/pdf`} className="btn btn-sm">{t.finance.viewPDF}</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
