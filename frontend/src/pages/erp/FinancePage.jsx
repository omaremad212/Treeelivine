import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getInvoices, createInvoice, updateInvoice, deleteInvoice, getExpenses, createExpense, deleteExpense, getSalaryTemplates, getCustomers, getProjects, getEmployees } from '../../api'
import { useTranslation } from '../../hooks/useTranslation'
import StatusBadge from '../../components/StatusBadge'
import Modal from '../../components/Modal'
import ConfirmModal from '../../components/ConfirmModal'
import KPICard from '../../components/KPICard'
import LoadingSpinner from '../../components/LoadingSpinner'

const INV_STATUSES = ['draft','issued','paid','overdue','cancelled','unpaid','partially_paid']

function InvoiceForm({ onSave, onClose, customers, projects, t, initial = {} }) {
  const [form, setForm] = useState({ customerId: '', projectId: '', subtotalOriginal: '', taxRate: 0, currency: 'SAR', exchangeRateToBase: 1, status: 'draft', issueDate: '', dueDate: '', ...initial })
  const [error, setError] = useState(''); const [loading, setLoading] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const submit = async () => {
    setError(''); setLoading(true)
    try { await onSave(form); onClose() }
    catch (err) { setError(err.response?.data?.message || t.common.error) }
    finally { setLoading(false) }
  }
  const sub = parseFloat(form.subtotalOriginal) || 0
  const tax = sub * ((parseFloat(form.taxRate) || 0) / 100)
  const total = sub + tax
  return (
    <>
      <div className="modal-body">
        {error && <div className="alert alert-error">{error}</div>}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">{t.common.customer} *</label>
            <select className="form-select" value={form.customerId} onChange={e => set('customerId', e.target.value)} required>
              <option value="">-</option>
              {customers.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">{t.common.project}</label>
            <select className="form-select" value={form.projectId} onChange={e => set('projectId', e.target.value)}>
              <option value="">-</option>
              {projects.filter(p => !form.customerId || p.customerId?._id === form.customerId || p.customerId === form.customerId).map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">{t.finance.subtotal} *</label>
            <input type="number" className="form-input" value={form.subtotalOriginal} onChange={e => set('subtotalOriginal', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">{t.finance.tax} %</label>
            <input type="number" className="form-input" value={form.taxRate} onChange={e => set('taxRate', e.target.value)} />
          </div>
        </div>
        <div style={{ padding: '10px', background: 'var(--surface2)', borderRadius: '6px', marginBottom: '12px', fontSize: '.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>{t.finance.subtotal}:</span><b>{sub.toLocaleString()} {form.currency}</b></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>{t.finance.tax}:</span><b>{tax.toLocaleString()} {form.currency}</b></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '6px', marginTop: '6px' }}><span>{t.finance.total}:</span><b style={{ color: 'var(--primary)' }}>{total.toLocaleString()} {form.currency}</b></div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">{t.finance.issueDate}</label>
            <input type="date" className="form-input" value={form.issueDate ? form.issueDate.slice(0,10) : ''} onChange={e => set('issueDate', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">{t.common.dueDate}</label>
            <input type="date" className="form-input" value={form.dueDate ? form.dueDate.slice(0,10) : ''} onChange={e => set('dueDate', e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">{t.common.status}</label>
          <select className="form-select" value={form.status} onChange={e => set('status', e.target.value)}>
            {INV_STATUSES.map(s => <option key={s} value={s}>{t.status[s]}</option>)}
          </select>
        </div>
      </div>
      <div className="modal-footer">
        <button className="btn" onClick={onClose}>{t.common.cancel}</button>
        <button className="btn btn-primary" onClick={submit} disabled={loading || !form.customerId || !form.subtotalOriginal}>
          {loading ? t.common.loading : t.common.save}
        </button>
      </div>
    </>
  )
}

function ExpenseForm({ onSave, onClose, employees, customers, t }) {
  const [form, setForm] = useState({ description: '', category: '', amount: '', expenseType: 'single', currency: 'SAR', exchangeRateToBase: 1, isTemplate: false, distributionMode: 'active_customers', active: true, salaryStartDate: '' })
  const [error, setError] = useState(''); const [loading, setLoading] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const submit = async () => {
    setError(''); setLoading(true)
    const data = { ...form, amountOriginal: form.amount, amountBase: (parseFloat(form.amount) || 0) * (parseFloat(form.exchangeRateToBase) || 1) }
    if (form.expenseType === 'salary') { data.isTemplate = true; data.salaryNextDueDate = form.salaryStartDate }
    try { await onSave(data); onClose() }
    catch (err) { setError(err.response?.data?.message || t.common.error) }
    finally { setLoading(false) }
  }
  return (
    <>
      <div className="modal-body">
        {error && <div className="alert alert-error">{error}</div>}
        <div className="form-group">
          <label className="form-label">{t.common.description} *</label>
          <input className="form-input" value={form.description} onChange={e => set('description', e.target.value)} required />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">{t.finance.expenseType}</label>
            <select className="form-select" value={form.expenseType} onChange={e => set('expenseType', e.target.value)}>
              <option value="single">{t.finance.single}</option>
              <option value="distributed">{t.finance.distributed}</option>
              <option value="salary">{t.finance.salary}</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">{t.finance.category}</label>
            <input className="form-input" value={form.category} onChange={e => set('category', e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">{t.common.amount} *</label>
            <input type="number" className="form-input" value={form.amount} onChange={e => set('amount', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">{t.common.currency}</label>
            <input className="form-input" value={form.currency} onChange={e => set('currency', e.target.value)} />
          </div>
        </div>
        {form.expenseType === 'salary' && (
          <>
            <div className="form-group">
              <label className="form-label">{t.finance.salaryEmployee}</label>
              <select className="form-select" value={form.employeeId || ''} onChange={e => set('employeeId', e.target.value)}>
                <option value="">-</option>
                {employees.map(e => <option key={e._id} value={e._id}>{e.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">{t.finance.salaryStart}</label>
              <input type="date" className="form-input" value={form.salaryStartDate} onChange={e => set('salaryStartDate', e.target.value)} />
            </div>
          </>
        )}
        {form.expenseType === 'distributed' && (
          <div className="form-group">
            <label className="form-label">{t.finance.distributionMode}</label>
            <select className="form-select" value={form.distributionMode} onChange={e => set('distributionMode', e.target.value)}>
              <option value="active_customers">{t.finance.activeCustomers}</option>
              <option value="selected_customers">{t.finance.selectedCustomers}</option>
            </select>
          </div>
        )}
      </div>
      <div className="modal-footer">
        <button className="btn" onClick={onClose}>{t.common.cancel}</button>
        <button className="btn btn-primary" onClick={submit} disabled={loading || !form.description || !form.amount}>
          {loading ? t.common.loading : t.common.save}
        </button>
      </div>
    </>
  )
}

export default function FinancePage() {
  const { t } = useTranslation()
  const [tab, setTab] = useState('invoices')
  const [invoices, setInvoices] = useState([])
  const [expenses, setExpenses] = useState([])
  const [salaryTemplates, setSalaryTemplates] = useState([])
  const [customers, setCustomers] = useState([])
  const [projects, setProjects] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddInvoice, setShowAddInvoice] = useState(false)
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteType, setDeleteType] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const [iRes, eRes, sRes, cRes, pRes, emRes] = await Promise.all([
        getInvoices(), getExpenses({ isTemplate: false }), getSalaryTemplates(),
        getCustomers(), getProjects(), getEmployees()
      ])
      setInvoices(iRes.data.data)
      setExpenses(eRes.data.data)
      setSalaryTemplates(sRes.data.data)
      setCustomers(cRes.data.data)
      setProjects(pRes.data.data)
      setEmployees(emRes.data.data)
    } catch {}
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const fmt = (n) => (n || 0).toLocaleString('ar-SA', { maximumFractionDigits: 0 })
  const totalCollected = invoices.filter(i => i.status === 'paid').reduce((a, i) => a + (i.amountBase || 0), 0)
  const totalUnpaid = invoices.filter(i => ['issued','unpaid','partially_paid','overdue'].includes(i.status)).reduce((a, i) => a + (i.remainingAmountBase || 0), 0)
  const totalExpenses = expenses.reduce((a, e) => a + (e.amountBase || 0), 0)

  const handleDeleteInvoice = async () => { await deleteInvoice(deleteTarget._id); load() }
  const handleDeleteExpense = async () => { await deleteExpense(deleteTarget._id); load() }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{t.finance.title}</h1>
      </div>

      <div className="kpi-grid" style={{ marginBottom: '20px' }}>
        <KPICard label={t.finance.collection} value={`${fmt(totalCollected)} ر.س`} icon="💵" color="green" />
        <KPICard label={`${t.finance.collection} (غير مدفوع)`} value={`${fmt(totalUnpaid)} ر.س`} icon="🧾" color="red" />
        <KPICard label={t.finance.expenses} value={`${fmt(totalExpenses)} ر.س`} icon="💸" color="yellow" />
        <KPICard label={t.finance.netProfit} value={`${fmt(totalCollected - totalExpenses)} ر.س`} icon="📈" color={totalCollected >= totalExpenses ? 'green' : 'red'} />
      </div>

      <div className="tabs">
        <button className={`tab-btn ${tab === 'invoices' ? 'active' : ''}`} onClick={() => setTab('invoices')}>{t.finance.invoices}</button>
        <button className={`tab-btn ${tab === 'expenses' ? 'active' : ''}`} onClick={() => setTab('expenses')}>{t.finance.expenses}</button>
        <button className={`tab-btn ${tab === 'salaries' ? 'active' : ''}`} onClick={() => setTab('salaries')}>{t.finance.salaryTemplates}</button>
      </div>

      {loading ? <LoadingSpinner /> : tab === 'invoices' ? (
        <>
          <div style={{ marginBottom: '12px' }}>
            <button className="btn btn-primary btn-sm" onClick={() => setShowAddInvoice(true)}>+ {t.finance.addInvoice}</button>
          </div>
          <div className="card">
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>{t.finance.invoiceNumber}</th>
                    <th>{t.common.customer}</th>
                    <th>{t.finance.subtotal}</th>
                    <th>{t.finance.total}</th>
                    <th>{t.common.status}</th>
                    <th>{t.finance.issueDate}</th>
                    <th>{t.common.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.length === 0 ? <tr><td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>{t.common.noData}</td></tr>
                  : invoices.map(inv => (
                    <tr key={inv._id}>
                      <td><b>{inv.invoiceNumber}</b></td>
                      <td>{inv.customerId?.name || '-'}</td>
                      <td>{fmt(inv.subtotalOriginal)} {inv.currency}</td>
                      <td>{fmt(inv.amountBase)} ر.س</td>
                      <td><StatusBadge status={inv.status} /></td>
                      <td>{inv.issueDate ? new Date(inv.issueDate).toLocaleDateString('ar') : '-'}</td>
                      <td>
                        <div className="table-actions">
                          <Link to={`/app/finance/invoices/${inv._id}/pdf`} className="btn btn-sm">{t.finance.viewPDF}</Link>
                          <button className="btn btn-sm btn-danger" onClick={() => { setDeleteTarget(inv); setDeleteType('invoice') }}>{t.common.delete}</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : tab === 'expenses' ? (
        <>
          <div style={{ marginBottom: '12px' }}>
            <button className="btn btn-primary btn-sm" onClick={() => setShowAddExpense(true)}>+ {t.finance.addExpense}</button>
          </div>
          <div className="card">
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>{t.common.description}</th>
                    <th>{t.finance.category}</th>
                    <th>{t.finance.expenseType}</th>
                    <th>{t.common.amount}</th>
                    <th>{t.common.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.length === 0 ? <tr><td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>{t.common.noData}</td></tr>
                  : expenses.map(exp => (
                    <tr key={exp._id}>
                      <td>{exp.description}</td>
                      <td>{exp.category || '-'}</td>
                      <td>{t.finance[exp.expenseType] || exp.expenseType}</td>
                      <td>{fmt(exp.amountBase)} ر.س</td>
                      <td>
                        <button className="btn btn-sm btn-danger" onClick={() => { setDeleteTarget(exp); setDeleteType('expense') }}>{t.common.delete}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <>
          <div style={{ marginBottom: '12px' }}>
            <button className="btn btn-primary btn-sm" onClick={() => setShowAddExpense(true)}>+ {t.finance.addSalary}</button>
          </div>
          <div className="card">
            <div className="table-wrapper">
              <table>
                <thead><tr><th>الموظف</th><th>{t.finance.salaryAmount}</th><th>تاريخ البداية</th><th>الحالة</th></tr></thead>
                <tbody>
                  {salaryTemplates.length === 0 ? <tr><td colSpan={4} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>{t.common.noData}</td></tr>
                  : salaryTemplates.map(s => (
                    <tr key={s._id}>
                      <td>{s.employeeId?.name || '-'}</td>
                      <td>{fmt(s.amountBase)} ر.س</td>
                      <td>{s.salaryStartDate ? new Date(s.salaryStartDate).toLocaleDateString('ar') : '-'}</td>
                      <td><StatusBadge status={s.active ? 'active' : 'inactive'} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {showAddInvoice && (
        <Modal title={t.finance.addInvoice} onClose={() => setShowAddInvoice(false)} size="lg">
          <InvoiceForm onSave={async (d) => { await createInvoice(d); load() }} onClose={() => setShowAddInvoice(false)} customers={customers} projects={projects} t={t} />
        </Modal>
      )}

      {showAddExpense && (
        <Modal title={tab === 'salaries' ? t.finance.addSalary : t.finance.addExpense} onClose={() => setShowAddExpense(false)} size="lg">
          <ExpenseForm onSave={async (d) => { await createExpense(d); load() }} onClose={() => setShowAddExpense(false)} employees={employees} customers={customers} t={t} />
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmModal
          message={`${t.common.deleteConfirm}`}
          onConfirm={deleteType === 'invoice' ? handleDeleteInvoice : handleDeleteExpense}
          onClose={() => setDeleteTarget(null)}
          danger
        />
      )}
    </div>
  )
}
