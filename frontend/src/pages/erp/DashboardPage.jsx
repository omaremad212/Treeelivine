import React, { useState, useEffect } from 'react'
import { getDashboard } from '../../api'
import { useTranslation } from '../../hooks/useTranslation'
import KPICard from '../../components/KPICard'
import LoadingSpinner from '../../components/LoadingSpinner'

const periods = ['today', '7d', '30d', 'month', 'quarter', 'custom']

export default function DashboardPage() {
  const { t } = useTranslation()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('month')
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const params = { period }
      if (period === 'custom') { params.startDate = customStart; params.endDate = customEnd }
      const res = await getDashboard(params)
      setData(res.data.data)
    } catch {}
    setLoading(false)
  }

  useEffect(() => { load() }, [period])

  const fmt = (n) => (n || 0).toLocaleString('ar-SA', { maximumFractionDigits: 0 })

  const periodLabels = {
    today: t.dashboard.today, '7d': t.dashboard.last7, '30d': t.dashboard.last30,
    month: t.dashboard.thisMonth, quarter: t.dashboard.thisQuarter, custom: t.dashboard.custom,
  }

  return (
    <div>
      <div className="page-header flex-between">
        <div>
          <h1 className="page-title">{t.dashboard.title}</h1>
        </div>
        <div className="flex gap-8" style={{ flexWrap: 'wrap' }}>
          <select className="form-select" style={{ width: 'auto' }} value={period} onChange={e => setPeriod(e.target.value)}>
            {periods.map(p => <option key={p} value={p}>{periodLabels[p]}</option>)}
          </select>
          {period === 'custom' && (
            <>
              <input type="date" className="form-input" style={{ width: 'auto' }} value={customStart} onChange={e => setCustomStart(e.target.value)} />
              <input type="date" className="form-input" style={{ width: 'auto' }} value={customEnd} onChange={e => setCustomEnd(e.target.value)} />
              <button className="btn btn-primary btn-sm" onClick={load}>{t.common.filter}</button>
            </>
          )}
        </div>
      </div>

      {loading ? <LoadingSpinner /> : !data ? null : (
        <>
          <div className="kpi-grid">
            <KPICard label={t.dashboard.activeCustomers} value={data.activeCustomers} icon="👥" color="blue" />
            <KPICard label={t.dashboard.activeProjects} value={data.activeProjects} icon="📁" color="blue" />
            <KPICard label={t.dashboard.openTasks} value={data.openTasks} icon="✅" color="blue" />
            <KPICard label={t.dashboard.overdueTasks} value={data.overdueTasks} icon="⚠️" color="red" />
            <KPICard label={t.dashboard.collected} value={`${fmt(data.collected)} ر.س`} icon="💵" color="green" />
            <KPICard label={t.dashboard.expenses} value={`${fmt(data.totalExpenses)} ر.س`} icon="💸" color="yellow" />
            <KPICard label={t.dashboard.net} value={`${fmt(data.net)} ر.س`} icon="📈" color={data.net >= 0 ? 'green' : 'red'} />
            <KPICard label={t.dashboard.unpaidInvoices} value={`${data.unpaidInvoices} (${fmt(data.unpaidAmt)} ر.س)`} icon="🧾" color="red" />
          </div>

          {data.overdueTasks > 0 && (
            <div className="alert alert-error" style={{ marginTop: '8px' }}>
              ⚠️ يوجد {data.overdueTasks} مهمة متأخرة تحتاج اهتمامًا فوريًا
            </div>
          )}
        </>
      )}
    </div>
  )
}
