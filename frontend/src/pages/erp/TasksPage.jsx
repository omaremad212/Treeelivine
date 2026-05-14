import React, { useState, useEffect } from 'react'
import { getTasks, createTask, updateTask, deleteTask, handoverTask, updateTaskStatus, getProjects, getEmployees, getCustomers } from '../../api'
import { useAuth } from '../../contexts/AuthContext'
import { useTranslation } from '../../hooks/useTranslation'
import StatusBadge from '../../components/StatusBadge'
import Modal from '../../components/Modal'
import Drawer from '../../components/Drawer'
import ConfirmModal from '../../components/ConfirmModal'
import LoadingSpinner from '../../components/LoadingSpinner'

const STATUSES = ['new','assigned','in_progress','ready_for_handover','handed_over','under_review','reopened','completed','cancelled','on_hold']
const PRIORITIES = ['low','medium','high','urgent']

function TaskForm({ initial = {}, onSave, onClose, projects, employees, customers, t, isAdmin }) {
  const [form, setForm] = useState({ title: '', projectId: '', customerId: '', currentAssigneeId: '', status: 'new', priority: 'medium', description: '', dueDate: '', reviewRequired: false, taskType: '', ...initial })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const submit = async () => {
    setError(''); setLoading(true)
    try { await onSave(form); onClose() }
    catch (err) { setError(err.response?.data?.message || t.common.error) }
    finally { setLoading(false) }
  }

  return (
    <>
      <div className="modal-body">
        {error && <div className="alert alert-error">{error}</div>}
        <div className="form-group">
          <label className="form-label">{t.common.name} *</label>
          <input className="form-input" value={form.title} onChange={e => set('title', e.target.value)} required />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">{t.common.project}</label>
            <select className="form-select" value={form.projectId} onChange={e => set('projectId', e.target.value)}>
              <option value="">-</option>
              {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">{t.common.customer}</label>
            <select className="form-select" value={form.customerId} onChange={e => set('customerId', e.target.value)}>
              <option value="">-</option>
              {customers.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">{t.tasks.currentAssignee}</label>
            <select className="form-select" value={form.currentAssigneeId} onChange={e => set('currentAssigneeId', e.target.value)}>
              <option value="">-</option>
              {employees.map(e => <option key={e._id} value={e._id}>{e.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">{t.common.priority}</label>
            <select className="form-select" value={form.priority} onChange={e => set('priority', e.target.value)}>
              {PRIORITIES.map(p => <option key={p} value={p}>{t.status[p]}</option>)}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">{t.common.status}</label>
            <select className="form-select" value={form.status} onChange={e => set('status', e.target.value)}>
              {STATUSES.map(s => <option key={s} value={s}>{t.status[s]}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">{t.common.dueDate}</label>
            <input type="date" className="form-input" value={form.dueDate ? form.dueDate.slice(0,10) : ''} onChange={e => set('dueDate', e.target.value)} />
          </div>
        </div>
        {isAdmin && (
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t.tasks.teamDue}</label>
              <input type="number" className="form-input" value={form.teamDueOriginal || ''} onChange={e => set('teamDueOriginal', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">{t.tasks.paymentStatus}</label>
              <select className="form-select" value={form.teamPaymentStatus || 'not_applicable'} onChange={e => set('teamPaymentStatus', e.target.value)}>
                {['not_applicable','pending','partial','paid','on_hold'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        )}
        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input type="checkbox" checked={form.reviewRequired} onChange={e => set('reviewRequired', e.target.checked)} />
            {t.tasks.reviewRequired}
          </label>
        </div>
        <div className="form-group">
          <label className="form-label">{t.common.description}</label>
          <textarea className="form-textarea" value={form.description} onChange={e => set('description', e.target.value)} />
        </div>
      </div>
      <div className="modal-footer">
        <button className="btn" onClick={onClose}>{t.common.cancel}</button>
        <button className="btn btn-primary" onClick={submit} disabled={loading || !form.title}>
          {loading ? t.common.loading : t.common.save}
        </button>
      </div>
    </>
  )
}

function HandoverModal({ task, employees, onConfirm, onClose, t }) {
  const [toId, setToId] = useState('')
  const [note, setNote] = useState('')
  return (
    <Modal title={t.tasks.handover} onClose={onClose}>
      <div className="modal-body">
        <div className="form-group">
          <label className="form-label">{t.tasks.handoverTo}</label>
          <select className="form-select" value={toId} onChange={e => setToId(e.target.value)}>
            <option value="">-</option>
            {employees.filter(e => e._id !== task.currentAssigneeId?._id).map(e => <option key={e._id} value={e._id}>{e.name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">{t.tasks.handoverNote}</label>
          <textarea className="form-textarea" value={note} onChange={e => setNote(e.target.value)} />
        </div>
      </div>
      <div className="modal-footer">
        <button className="btn" onClick={onClose}>{t.common.cancel}</button>
        <button className="btn btn-primary" onClick={() => onConfirm(toId, note)} disabled={!toId}>{t.common.confirm}</button>
      </div>
    </Modal>
  )
}

export default function TasksPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [employees, setEmployees] = useState([])
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [filterPriority, setFilterPriority] = useState('')
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [selected, setSelected] = useState(null)
  const [editing, setEditing] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [handoverTarget, setHandoverTarget] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const [tRes, pRes, eRes, cRes] = await Promise.all([
        getTasks({ status: filterStatus }),
        getProjects(), getEmployees(), getCustomers()
      ])
      setTasks(tRes.data.data)
      setProjects(pRes.data.data)
      setEmployees(eRes.data.data)
      setCustomers(cRes.data.data)
    } catch {}
    setLoading(false)
  }

  useEffect(() => { load() }, [filterStatus])

  const filtered = tasks.filter(t2 => {
    if (search && !t2.title.toLowerCase().includes(search.toLowerCase())) return false
    if (filterPriority && t2.priority !== filterPriority) return false
    return true
  })

  const handleCreate = async (data) => { await createTask(data); load() }
  const handleUpdate = async (data) => { await updateTask(selected._id, data); load(); setSelected(null) }
  const handleDelete = async () => { await deleteTask(deleteTarget._id); load(); setSelected(null) }

  const quickStatus = async (task, status) => {
    await updateTaskStatus(task._id, { status })
    load()
  }

  const doHandover = async (toId, note) => {
    await handoverTask(handoverTarget._id, { toEmployeeId: toId, note })
    setHandoverTarget(null)
    load()
  }

  const quickBtns = (task) => {
    const btns = []
    if (task.status === 'new' || task.status === 'assigned') btns.push({ label: t.tasks.start, status: 'in_progress', cls: 'btn-primary' })
    if (task.status === 'in_progress') btns.push({ label: t.tasks.handover, action: () => setHandoverTarget(task) })
    if (task.status === 'in_progress' || task.status === 'handed_over') btns.push({ label: t.tasks.sendToReview, status: 'under_review' })
    if (task.status === 'under_review') btns.push({ label: t.tasks.complete, status: 'completed', cls: 'btn-success' })
    if (task.status === 'under_review') btns.push({ label: t.tasks.reopen, status: 'reopened' })
    if (!['completed','cancelled'].includes(task.status)) btns.push({ label: t.tasks.cancel, status: 'cancelled', cls: 'btn-danger' })
    return btns
  }

  return (
    <div>
      <div className="page-header flex-between">
        <h1 className="page-title">{t.tasks.title}</h1>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>+ {t.tasks.addTask}</button>
      </div>

      <div className="filters-bar">
        <input className="form-input" placeholder={t.common.search} value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: '200px' }} />
        <select className="form-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">{t.common.all}</option>
          {STATUSES.map(s => <option key={s} value={s}>{t.status[s]}</option>)}
        </select>
        <select className="form-select" value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
          <option value="">{t.common.all}</option>
          {PRIORITIES.map(p => <option key={p} value={p}>{t.status[p]}</option>)}
        </select>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>{t.common.name}</th>
                  <th>{t.common.project}</th>
                  <th>{t.common.status}</th>
                  <th>{t.common.priority}</th>
                  <th>{t.tasks.currentAssignee}</th>
                  <th>{t.common.dueDate}</th>
                  <th>{t.common.actions}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>{t.common.noData}</td></tr>
                ) : filtered.map(task => (
                  <tr key={task._id}>
                    <td style={{ cursor: 'pointer' }} onClick={() => setSelected(task)}><b>{task.title}</b></td>
                    <td>{task.projectId?.name || '-'}</td>
                    <td><StatusBadge status={task.status} /></td>
                    <td><StatusBadge status={task.priority} /></td>
                    <td>{task.currentAssigneeId?.name || '-'}</td>
                    <td style={{ color: task.dueDate && new Date(task.dueDate) < new Date() && !['completed','cancelled'].includes(task.status) ? 'var(--danger)' : undefined }}>
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString('ar') : '-'}
                    </td>
                    <td>
                      <div className="table-actions" style={{ flexWrap: 'wrap' }}>
                        {quickBtns(task).map((btn, i) => (
                          <button key={i} className={`btn btn-sm ${btn.cls || ''}`}
                            onClick={() => btn.action ? btn.action() : quickStatus(task, btn.status)}>
                            {btn.label}
                          </button>
                        ))}
                        <button className="btn btn-sm" onClick={() => { setSelected(task); setEditing(true) }}>{t.common.edit}</button>
                        <button className="btn btn-sm btn-danger" onClick={() => setDeleteTarget(task)}>{t.common.delete}</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showAdd && (
        <Modal title={t.tasks.addTask} onClose={() => setShowAdd(false)} size="lg">
          <TaskForm onSave={handleCreate} onClose={() => setShowAdd(false)} projects={projects} employees={employees} customers={customers} t={t} isAdmin={isAdmin} />
        </Modal>
      )}

      {selected && !editing && (
        <Drawer title={selected.title} onClose={() => setSelected(null)}
          footer={<>
            <button className="btn" onClick={() => setEditing(true)}>{t.common.edit}</button>
            <button className="btn btn-danger" onClick={() => setDeleteTarget(selected)}>{t.common.delete}</button>
          </>}>
          <div className="info-row"><span className="info-label">{t.common.status}</span><span className="info-value"><StatusBadge status={selected.status} /></span></div>
          <div className="info-row"><span className="info-label">{t.common.priority}</span><span className="info-value"><StatusBadge status={selected.priority} /></span></div>
          <div className="info-row"><span className="info-label">{t.common.project}</span><span className="info-value">{selected.projectId?.name || '-'}</span></div>
          <div className="info-row"><span className="info-label">{t.tasks.currentAssignee}</span><span className="info-value">{selected.currentAssigneeId?.name || '-'}</span></div>
          <div className="info-row"><span className="info-label">{t.common.dueDate}</span><span className="info-value">{selected.dueDate ? new Date(selected.dueDate).toLocaleDateString('ar') : '-'}</span></div>
          {selected.teamDueOriginal && (
            <div className="info-row"><span className="info-label">{t.tasks.teamDue}</span><span className="info-value">{selected.teamDueOriginal} {selected.teamDueCurrency || 'SAR'}</span></div>
          )}
          {selected.efficiencyScore != null && (
            <div className="info-row"><span className="info-label">{t.tasks.efficiencyScore}</span><span className="info-value">{Math.round(selected.efficiencyScore)}%</span></div>
          )}
          {selected.description && <div style={{ marginTop: '12px', padding: '10px', background: 'var(--surface2)', borderRadius: '6px', fontSize: '.85rem' }}>{selected.description}</div>}
          {selected.handoverHistory?.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <div className="section-title" style={{ marginBottom: '8px' }}>{t.tasks.handoverHistory}</div>
              {selected.handoverHistory.map((h, i) => (
                <div key={i} style={{ fontSize: '.8rem', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                  {new Date(h.timestamp).toLocaleDateString('ar')} - {h.note || 'تسليم'}
                </div>
              ))}
            </div>
          )}
        </Drawer>
      )}

      {selected && editing && (
        <Modal title={t.common.edit} onClose={() => { setEditing(false); setSelected(null) }} size="lg">
          <TaskForm initial={selected} onSave={handleUpdate} onClose={() => { setEditing(false); setSelected(null) }} projects={projects} employees={employees} customers={customers} t={t} isAdmin={isAdmin} />
        </Modal>
      )}

      {handoverTarget && (
        <HandoverModal task={handoverTarget} employees={employees} onConfirm={doHandover} onClose={() => setHandoverTarget(null)} t={t} />
      )}

      {deleteTarget && (
        <ConfirmModal message={`${t.common.deleteConfirm} ${deleteTarget.title}؟`} onConfirm={handleDelete} onClose={() => setDeleteTarget(null)} danger />
      )}
    </div>
  )
}
