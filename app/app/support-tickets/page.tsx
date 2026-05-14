'use client'
import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import StatusBadge from '@/components/ui/StatusBadge'
import Modal from '@/components/ui/Modal'
import ConfirmModal from '@/components/ui/ConfirmModal'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

const TICKET_STATUSES  = ['open', 'in_progress', 'resolved', 'closed']
const TICKET_PRIORITIES = ['low', 'medium', 'high', 'urgent']

const IC = ({ d, size = 16 }: { d: string | string[]; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    {(Array.isArray(d) ? d : [d]).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

function KpiPill({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '0.875rem 1.25rem' }}>
      <p style={{ fontSize: '0.72rem', color: 'var(--fg-4)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 500, marginBottom: '0.3rem' }}>{label}</p>
      <p style={{ fontSize: '1.5rem', fontWeight: 700, color }}>{value}</p>
    </div>
  )
}

export default function SupportTicketsPage() {
  const { t, hasPermission } = useApp()

  const [tickets,     setTickets]     = useState<any[]>([])
  const [customers,   setCustomers]   = useState<any[]>([])
  const [employees,   setEmployees]   = useState<any[]>([])
  const [loading,     setLoading]     = useState(true)
  const [search,      setSearch]      = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterPriority, setFilterPriority] = useState('')
  const [modalOpen,   setModalOpen]   = useState(false)
  const [editing,     setEditing]     = useState<any>(null)
  const [deleteTarget, setDeleteTarget] = useState<any>(null)
  const [deleting,    setDeleting]    = useState(false)
  const [form,        setForm]        = useState<any>({})
  const [saving,      setSaving]      = useState(false)

  async function fetchAll() {
    setLoading(true)
    const params = new URLSearchParams()
    if (search)         params.set('search', search)
    if (filterStatus)   params.set('status', filterStatus)
    if (filterPriority) params.set('priority', filterPriority)
    const [tkRes, cuRes, emRes] = await Promise.all([
      fetch(`/api/tickets?${params}`).then(r => r.json()),
      fetch('/api/customers').then(r => r.json()),
      fetch('/api/employees').then(r => r.json()),
    ])
    if (tkRes.success) setTickets(tkRes.data)
    if (cuRes.success) setCustomers(cuRes.data)
    if (emRes.success) setEmployees(emRes.data)
    setLoading(false)
  }
  useEffect(() => { fetchAll() }, [search, filterStatus, filterPriority])

  function openCreate() { setForm({ status: 'open', priority: 'medium' }); setEditing(null); setModalOpen(true) }
  function openEdit(tk: any) {
    setForm({ ...tk, customerId: tk.customer?._id || tk.customerId, assignedTo: tk.assignee?._id || tk.assignedTo })
    setEditing(tk); setModalOpen(true)
  }

  async function handleSave() {
    setSaving(true)
    const url    = editing ? `/api/tickets/${editing._id}` : '/api/tickets'
    const method = editing ? 'PUT' : 'POST'
    const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data   = await res.json()
    if (data.success) { setModalOpen(false); fetchAll() }
    setSaving(false)
  }

  async function handleDelete() {
    setDeleting(true)
    await fetch(`/api/tickets/${deleteTarget._id}`, { method: 'DELETE' })
    setDeleteTarget(null); setDeleting(false); fetchAll()
  }

  const counts = {
    open:       tickets.filter(tk => tk.status === 'open').length,
    inProgress: tickets.filter(tk => tk.status === 'in_progress').length,
    resolved:   tickets.filter(tk => tk.status === 'resolved' || tk.status === 'closed').length,
    urgent:     tickets.filter(tk => tk.priority === 'urgent' || tk.priority === 'high').length,
  }

  const priorityColor: Record<string, string> = {
    low: '#6b7280', medium: '#2563eb', high: '#d97706', urgent: '#dc2626'
  }

  return (
    <div style={{ padding: '1.75rem 2rem', flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--fg-1)' }}>{t['support.title']}</h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--fg-4)', marginTop: 2 }}>{t['support.subtitle']}</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <IC d="M12 5v14M5 12h14" /> {t['support.newTicket']}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.875rem', marginBottom: '1.5rem' }}>
        <KpiPill label={t['support.open']}       value={counts.open}       color="#2563eb" />
        <KpiPill label={t['support.inProgress']} value={counts.inProgress} color="#d97706" />
        <KpiPill label={t['support.resolved']}   value={counts.resolved}   color="#059669" />
        <KpiPill label={t['support.highUrgent']} value={counts.urgent}     color="#dc2626" />
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <input className="input" placeholder={t['support.searchTickets']} value={search} onChange={e => setSearch(e.target.value)} style={{ width: 220 }} />
        <select className="input" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ width: 150 }}>
          <option value="">{t['support.allStatuses']}</option>
          {TICKET_STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>)}
        </select>
        <select className="input" value={filterPriority} onChange={e => setFilterPriority(e.target.value)} style={{ width: 140 }}>
          <option value="">{t['support.allPriorities']}</option>
          {TICKET_PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
        </select>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface2)' }}>
                {[t['support.ticketNumber'], t['support.ticketTitle'], t['support.client'], t['support.assignedTo'], t['support.priority'], t['support.status'], t['support.created'], t['support.actions']].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'start', fontSize: '0.75rem', color: 'var(--fg-4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tickets.map(tk => (
                <tr key={tk._id} style={{ borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface2)')}
                  onMouseLeave={e => (e.currentTarget.style.background = '')}>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: 'var(--accent)', fontSize: '0.82rem' }}>{tk.ticketNumber}</td>
                  <td style={{ padding: '0.875rem 1rem', maxWidth: 240 }}>
                    <p style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--fg-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tk.title}</p>
                    {tk.description && <p style={{ fontSize: '0.72rem', color: 'var(--fg-4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tk.description}</p>}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: 'var(--fg-3)' }}>{tk.customer?.name || '—'}</td>
                  <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: 'var(--fg-3)' }}>{tk.assignee?.name || '—'}</td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: priorityColor[tk.priority] || 'var(--fg-3)', background: (priorityColor[tk.priority] || '#6b7280') + '15', padding: '0.2rem 0.6rem', borderRadius: 20 }}>
                      {(tk.priority || 'medium').toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}><StatusBadge status={tk.status} /></td>
                  <td style={{ padding: '0.875rem 1rem', fontSize: '0.78rem', color: 'var(--fg-4)' }}>{new Date(tk.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button className="btn btn-secondary" onClick={() => openEdit(tk)} style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}>{t.edit}</button>
                      <button className="btn btn-danger" onClick={() => setDeleteTarget(tk)} style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}>{t.delete}</button>
                    </div>
                  </td>
                </tr>
              ))}
              {tickets.length === 0 && (
                <tr><td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: 'var(--fg-4)' }}>
                  <p style={{ fontWeight: 500, marginBottom: '0.25rem' }}>{t['support.noTickets']}</p>
                  <p style={{ fontSize: '0.8rem' }}>{t['support.createFirstTicket']}</p>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? t['support.editTicket'] : t['support.newTicket']} width={520}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div><label className="label">{t['support.titleField']}</label><input className="input" value={form.title || ''} onChange={e => setForm((p: any) => ({ ...p, title: e.target.value }))} placeholder={t['support.issueBrief']} /></div>
          <div><label className="label">{t.description}</label><textarea className="input" value={form.description || ''} onChange={e => setForm((p: any) => ({ ...p, description: e.target.value }))} rows={3} placeholder={t['support.detailedDesc']} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
            <div>
              <label className="label">{t['support.client']}</label>
              <select className="input" value={form.customerId || ''} onChange={e => setForm((p: any) => ({ ...p, customerId: e.target.value }))}>
                <option value="">—</option>
                {customers.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">{t['support.assignTo']}</label>
              <select className="input" value={form.assignedTo || ''} onChange={e => setForm((p: any) => ({ ...p, assignedTo: e.target.value }))}>
                <option value="">{t['support.unassigned']}</option>
                {employees.map(e => <option key={e._id} value={e._id}>{e.name}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
            <div>
              <label className="label">{t.status}</label>
              <select className="input" value={form.status || 'open'} onChange={e => setForm((p: any) => ({ ...p, status: e.target.value }))}>
                {TICKET_STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>)}
              </select>
            </div>
            <div>
              <label className="label">{t.priority}</label>
              <select className="input" value={form.priority || 'medium'} onChange={e => setForm((p: any) => ({ ...p, priority: e.target.value }))}>
                {TICKET_PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>{t.cancel}</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? t['support.saving'] : editing ? t['support.saveChanges'] : t['support.createTicket']}</button>
          </div>
        </div>
      </Modal>

      <ConfirmModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title={t['support.deleteTicket']} message={`"${deleteTarget?.ticketNumber}" — ${t['support.cannotUndo']}`} loading={deleting} />
    </div>
  )
}
