'use client'
import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import Modal from '@/components/ui/Modal'
import ConfirmModal from '@/components/ui/ConfirmModal'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

const EMP_ROLES = ['account_manager', 'project_manager', 'designer', 'developer', 'content_writer', 'copywriter', 'marketing', 'finance', 'hr', 'other']

const IC = ({ d, size = 16 }: { d: string | string[]; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    {(Array.isArray(d) ? d : [d]).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

function OvCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '0.875rem 1.25rem' }}>
      <p style={{ fontSize: '0.72rem', color: 'var(--fg-4)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 500, marginBottom: '0.3rem' }}>{label}</p>
      <p style={{ fontSize: '1.3rem', fontWeight: 700, color }}>{value}</p>
    </div>
  )
}

export default function HRPayrollPage() {
  const { hasPermission, settings } = useApp()
  const cur = settings?.defaultCurrency || 'SAR'

  const [employees,  setEmployees]  = useState<any[]>([])
  const [expenses,   setExpenses]   = useState<any[]>([])
  const [loading,    setLoading]    = useState(true)
  const [empModal,   setEmpModal]   = useState(false)
  const [payModal,   setPayModal]   = useState(false)
  const [editing,    setEditing]    = useState<any>(null)
  const [deleteTarget, setDeleteTarget] = useState<any>(null)
  const [deleting,   setDeleting]   = useState(false)
  const [empForm,    setEmpForm]    = useState<any>({})
  const [payForm,    setPayForm]    = useState<any>({})
  const [saving,     setSaving]     = useState(false)

  async function fetchAll() {
    setLoading(true)
    const [emRes, expRes] = await Promise.all([
      fetch('/api/employees').then(r => r.json()),
      fetch('/api/expenses').then(r => r.json()),
    ])
    if (emRes.success)  setEmployees(emRes.data)
    if (expRes.success) setExpenses(expRes.data.filter((e: any) => e.category === 'salary'))
    setLoading(false)
  }
  useEffect(() => { fetchAll() }, [])

  function openCreateEmp() { setEmpForm({}); setEditing(null); setEmpModal(true) }
  function openEditEmp(e: any) { setEmpForm({ ...e }); setEditing(e); setEmpModal(true) }
  function openPayroll(emp: any) { setPayForm({ employeeId: emp._id, employeeName: emp.name, amount: emp.salary || 0, category: 'salary', date: new Date().toISOString().substring(0, 10), description: `Salary — ${emp.name}` }); setPayModal(true) }

  async function handleSaveEmp() {
    setSaving(true)
    const url    = editing ? `/api/employees/${editing._id}` : '/api/employees'
    const method = editing ? 'PUT' : 'POST'
    const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(empForm) })
    const data   = await res.json()
    if (data.success) { setEmpModal(false); fetchAll() }
    setSaving(false)
  }

  async function handlePayroll() {
    setSaving(true)
    const res  = await fetch('/api/expenses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payForm) })
    const data = await res.json()
    if (data.success) { setPayModal(false); fetchAll() }
    setSaving(false)
  }

  async function handleDelete() {
    setDeleting(true)
    await fetch(`/api/employees/${deleteTarget._id}`, { method: 'DELETE' })
    setDeleteTarget(null); setDeleting(false); fetchAll()
  }

  const totalSalaryBudget = employees.reduce((s, e) => s + (e.salary || 0), 0)
  const paidThisMonth     = expenses.filter(e => {
    const d = new Date(e.date || e.createdAt)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).reduce((s, e) => s + (e.amount || 0), 0)

  const COLORS = ['#4f6831','#2563eb','#7c3aed','#d97706','#059669','#ef4444','#0891b2','#ca8a04']

  return (
    <div style={{ padding: '1.75rem 2rem', flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--fg-1)' }}>HR & Payroll</h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--fg-4)', marginTop: 2 }}>Manage employees and salary disbursements</p>
        </div>
        {hasPermission('team.write') && (
          <button className="btn btn-primary" onClick={openCreateEmp} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <IC d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M8.5 11a4 4 0 100-8 4 4 0 000 8zM20 8v6M23 11h-6" /> Add Employee
          </button>
        )}
      </div>

      {loading ? <LoadingSpinner /> : (
        <>
          {/* Overview */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '0.875rem', marginBottom: '1.75rem' }}>
            <OvCard label="Total Employees"    value={String(employees.length)}                     color="var(--fg-1)" />
            <OvCard label="Monthly Budget"     value={`${cur} ${totalSalaryBudget.toLocaleString()}`} color="#4f6831" />
            <OvCard label="Paid This Month"    value={`${cur} ${paidThisMonth.toLocaleString()}`}   color="#059669" />
            <OvCard label="Payroll Records"    value={String(expenses.length)}                      color="#2563eb" />
          </div>

          {/* Employee grid */}
          <h2 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--fg-1)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Employees</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {employees.map((emp, idx) => (
              <div key={emp._id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1rem' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: COLORS[idx % COLORS.length], display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff', fontSize: '1.1rem', flexShrink: 0 }}>
                    {(emp.name || '?')[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--fg-1)' }}>{emp.name}</p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--fg-4)', textTransform: 'capitalize' }}>{(emp.internalRole || 'employee').replace('_', ' ')}</p>
                  </div>
                  <div style={{ textAlign: 'end' }}>
                    <p style={{ fontWeight: 700, color: '#4f6831', fontSize: '0.95rem' }}>{cur} {(emp.salary || 0).toLocaleString()}</p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--fg-4)' }}>/ month</p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '1rem', fontSize: '0.8rem', color: 'var(--fg-3)' }}>
                  {emp.email && <span>{emp.email}</span>}
                  {emp.phone && <span>{emp.phone}</span>}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {hasPermission('team.write') && (
                    <>
                      <button className="btn btn-secondary" onClick={() => openEditEmp(emp)} style={{ flex: 1, justifyContent: 'center', fontSize: '0.78rem' }}>Edit</button>
                      <button className="btn btn-primary" onClick={() => openPayroll(emp)} style={{ flex: 1, justifyContent: 'center', fontSize: '0.78rem' }}>Pay Salary</button>
                      <button className="btn btn-danger" onClick={() => setDeleteTarget(emp)} style={{ fontSize: '0.78rem' }}>Remove</button>
                    </>
                  )}
                </div>
              </div>
            ))}
            {employees.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'var(--fg-4)' }}>
                <p style={{ fontWeight: 500 }}>No employees yet</p>
                <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Add your first employee to manage payroll</p>
              </div>
            )}
          </div>

          {/* Payroll log */}
          <h2 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--fg-1)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Payroll History</h2>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface2)' }}>
                  {['Employee', 'Description', 'Amount', 'Date'].map(h => (
                    <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'start', fontSize: '0.75rem', color: 'var(--fg-4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {expenses.map(exp => (
                  <tr key={exp._id} style={{ borderBottom: '1px solid var(--border)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface2)')}
                    onMouseLeave={e => (e.currentTarget.style.background = '')}>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: 'var(--fg-2)', fontWeight: 500 }}>{exp.employeeId?.name || employees.find(e => e._id === (exp.employeeId?._id || exp.employeeId))?.name || '—'}</td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: 'var(--fg-3)' }}>{exp.description || '—'}</td>
                    <td style={{ padding: '0.875rem 1rem', fontWeight: 700, color: '#4f6831' }}>{cur} {(exp.amount || 0).toLocaleString()}</td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.82rem', color: 'var(--fg-4)' }}>{exp.date ? new Date(exp.date).toLocaleDateString() : '—'}</td>
                  </tr>
                ))}
                {expenses.length === 0 && (
                  <tr><td colSpan={4} style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--fg-4)' }}>No payroll records yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Add/Edit Employee Modal */}
      <Modal open={empModal} onClose={() => setEmpModal(false)} title={editing ? 'Edit Employee' : 'Add Employee'} width={480}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
            <div><label className="label">Full Name *</label><input className="input" value={empForm.name || ''} onChange={e => setEmpForm((p: any) => ({ ...p, name: e.target.value }))} /></div>
            <div><label className="label">Email</label><input className="input" type="email" value={empForm.email || ''} onChange={e => setEmpForm((p: any) => ({ ...p, email: e.target.value }))} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
            <div><label className="label">Phone</label><input className="input" value={empForm.phone || ''} onChange={e => setEmpForm((p: any) => ({ ...p, phone: e.target.value }))} /></div>
            <div>
              <label className="label">Role / Position</label>
              <select className="input" value={empForm.internalRole || ''} onChange={e => setEmpForm((p: any) => ({ ...p, internalRole: e.target.value }))}>
                <option value="">Select role…</option>
                {EMP_ROLES.map(r => <option key={r} value={r}>{r.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>)}
              </select>
            </div>
          </div>
          <div><label className="label">Monthly Salary ({cur})</label><input className="input" type="number" value={empForm.salary || ''} onChange={e => setEmpForm((p: any) => ({ ...p, salary: Number(e.target.value) }))} /></div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button className="btn btn-secondary" onClick={() => setEmpModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSaveEmp} disabled={saving}>{saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Employee'}</button>
          </div>
        </div>
      </Modal>

      {/* Pay Salary Modal */}
      <Modal open={payModal} onClose={() => setPayModal(false)} title={`Pay Salary — ${payForm.employeeName || ''}`} width={440}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div><label className="label">Description</label><input className="input" value={payForm.description || ''} onChange={e => setPayForm((p: any) => ({ ...p, description: e.target.value }))} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
            <div><label className="label">Amount ({cur}) *</label><input className="input" type="number" value={payForm.amount || ''} onChange={e => setPayForm((p: any) => ({ ...p, amount: Number(e.target.value) }))} /></div>
            <div><label className="label">Date</label><input className="input" type="date" value={payForm.date || ''} onChange={e => setPayForm((p: any) => ({ ...p, date: e.target.value }))} /></div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button className="btn btn-secondary" onClick={() => setPayModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handlePayroll} disabled={saving}>{saving ? 'Processing…' : 'Disburse Salary'}</button>
          </div>
        </div>
      </Modal>

      <ConfirmModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Remove Employee" message={`Remove "${deleteTarget?.name}" from the team? This cannot be undone.`} loading={deleting} />
    </div>
  )
}
