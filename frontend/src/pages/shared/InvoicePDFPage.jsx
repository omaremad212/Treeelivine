import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getInvoice } from '../../api'

export default function InvoicePDFPage() {
  const { invoiceId } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getInvoice(invoiceId)
      .then(res => { setData(res.data.data); setSettings(res.data.settings) })
      .catch(err => setError(err.response?.data?.message || 'خطأ في تحميل الفاتورة'))
      .finally(() => setLoading(false))
  }, [invoiceId])

  const fmt = (n) => (n || 0).toLocaleString('ar-SA', { maximumFractionDigits: 2 })

  const statusLabel = {
    draft: 'مسودة', issued: 'صادرة', paid: 'مدفوعة', overdue: 'متأخرة',
    cancelled: 'ملغاة', unpaid: 'غير مدفوعة', partially_paid: 'مدفوعة جزئيًا'
  }

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>جاري التحميل...</div>
  if (error) return <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>{error}</div>

  const inv = data

  return (
    <div>
      <div className="no-print" style={{ padding: '12px 24px', background: '#f1f5f9', display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button className="btn" onClick={() => navigate(-1)}>← رجوع</button>
        <button className="btn btn-primary" onClick={() => window.print()}>🖨️ طباعة / حفظ PDF</button>
      </div>

      <div className="print-page" dir="rtl">
        <div className="invoice-header">
          <div>
            {settings?.companyLogo && <img src={settings.companyLogo} alt="logo" style={{ height: '60px', marginBottom: '8px' }} />}
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{settings?.companyName || 'Treeelivine'}</div>
          </div>
          <div style={{ textAlign: 'left' }}>
            <div className="invoice-title">فاتورة</div>
            <div style={{ color: '#64748b', fontSize: '.9rem', marginTop: '4px' }}>#{inv.invoiceNumber}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
          <div>
            <div style={{ fontWeight: 700, marginBottom: '8px', color: '#64748b', fontSize: '.8rem' }}>فاتورة إلى</div>
            <div style={{ fontWeight: 700, fontSize: '1rem' }}>{inv.customerId?.name}</div>
            {inv.customerId?.company && <div style={{ color: '#64748b' }}>{inv.customerId.company}</div>}
            {inv.customerId?.email && <div style={{ color: '#64748b' }}>{inv.customerId.email}</div>}
            {inv.customerId?.phone && <div style={{ color: '#64748b' }}>{inv.customerId.phone}</div>}
          </div>
          <div>
            <table style={{ width: '100%', fontSize: '.85rem' }}>
              <tbody>
                <tr><td style={{ color: '#64748b', padding: '3px 0' }}>رقم الفاتورة:</td><td style={{ fontWeight: 600, textAlign: 'left' }}>{inv.invoiceNumber}</td></tr>
                {inv.issueDate && <tr><td style={{ color: '#64748b', padding: '3px 0' }}>تاريخ الإصدار:</td><td style={{ fontWeight: 600, textAlign: 'left' }}>{new Date(inv.issueDate).toLocaleDateString('ar')}</td></tr>}
                {inv.dueDate && <tr><td style={{ color: '#64748b', padding: '3px 0' }}>تاريخ الاستحقاق:</td><td style={{ fontWeight: 600, textAlign: 'left' }}>{new Date(inv.dueDate).toLocaleDateString('ar')}</td></tr>}
                <tr><td style={{ color: '#64748b', padding: '3px 0' }}>الحالة:</td><td style={{ fontWeight: 600, textAlign: 'left' }}>{statusLabel[inv.status] || inv.status}</td></tr>
                {inv.projectId && <tr><td style={{ color: '#64748b', padding: '3px 0' }}>المشروع:</td><td style={{ fontWeight: 600, textAlign: 'left' }}>{inv.projectId.name}</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
          <thead>
            <tr style={{ background: '#f1f5f9' }}>
              <th style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, fontSize: '.85rem', borderBottom: '2px solid #e2e8f0' }}>البيان</th>
              <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 700, fontSize: '.85rem', borderBottom: '2px solid #e2e8f0' }}>المبلغ</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>
                {inv.projectId ? `خدمات - ${inv.projectId.name}` : 'خدمات'}
              </td>
              <td style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                {fmt(inv.subtotalOriginal)} {inv.currency}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="invoice-total">
          <div className="invoice-total-box">
            <table style={{ width: '100%', fontSize: '.9rem' }}>
              <tbody>
                <tr>
                  <td style={{ padding: '6px 0', color: '#64748b' }}>المجموع قبل الضريبة:</td>
                  <td style={{ padding: '6px 0', textAlign: 'left', fontWeight: 600 }}>{fmt(inv.subtotalOriginal)} {inv.currency}</td>
                </tr>
                {inv.taxRate > 0 && (
                  <tr>
                    <td style={{ padding: '6px 0', color: '#64748b' }}>الضريبة ({inv.taxRate}%):</td>
                    <td style={{ padding: '6px 0', textAlign: 'left', fontWeight: 600 }}>{fmt(inv.taxAmountOriginal)} {inv.currency}</td>
                  </tr>
                )}
                <tr style={{ borderTop: '2px solid #e2e8f0' }}>
                  <td style={{ padding: '10px 0 0', fontWeight: 700, fontSize: '1rem' }}>الإجمالي:</td>
                  <td style={{ padding: '10px 0 0', textAlign: 'left', fontWeight: 700, fontSize: '1.1rem', color: '#2563eb' }}>{fmt(inv.amountBase)} {settings?.baseCurrency || 'SAR'}</td>
                </tr>
                {inv.paidAmountBase > 0 && (
                  <tr>
                    <td style={{ padding: '4px 0', color: '#16a34a' }}>المدفوع:</td>
                    <td style={{ padding: '4px 0', textAlign: 'left', color: '#16a34a', fontWeight: 600 }}>{fmt(inv.paidAmountBase)} {settings?.baseCurrency || 'SAR'}</td>
                  </tr>
                )}
                {inv.remainingAmountBase > 0 && (
                  <tr>
                    <td style={{ padding: '4px 0', color: '#dc2626' }}>المتبقي:</td>
                    <td style={{ padding: '4px 0', textAlign: 'left', color: '#dc2626', fontWeight: 600 }}>{fmt(inv.remainingAmountBase)} {settings?.baseCurrency || 'SAR'}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ marginTop: '48px', paddingTop: '16px', borderTop: '1px solid #e2e8f0', color: '#94a3b8', fontSize: '.8rem', textAlign: 'center' }}>
          شكرًا لتعاملكم معنا • {settings?.companyName}
        </div>
      </div>
    </div>
  )
}
