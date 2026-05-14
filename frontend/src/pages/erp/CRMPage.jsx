import React, { useState, useEffect } from 'react'
import { getCustomers, createCustomer, updateCustomer, deleteCustomer, bulkCustomers, getEmployees } from '../../api'
import { useTranslation } from '../../hooks/useTranslation'
import StatusBadge from '../../components/StatusBadge'
import Modal from '../../components/Modal'
import Drawer from '../../components/Drawer'
import ConfirmModal from '../../components/ConfirmModal'
import LoadingSpinner from '../../components/LoadingSpinner'

const STATUSES = ['prospect','qualified','negotiation','active','inactive','suspended','lost']
const PRIORITIES = ['low','medium','high','urgent']

function CustomerForm({ initial = {}, onSave, onClose, employees, t }) {
  const [form, setForm] = useState({ name:'', company:'', phone:'', email:'', status:'prospect', priority:'medium', source:'', service:'', notes:'', assignedTo:'', ...initial })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [dupWarning, setDupWarning] = useState(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const submit = async (force = false) => {
    setError(''); setLoading(true)
    try {
      await onSave({ ...form, force })
      onClose()
    } catch (err) {
      if (err.response?.status === 409) {
        setDupWarning(err.response.data.duplicates)
      } else {
        setError(err.response?.data?.message || t.common.error)
      }
    } finally { setLoading(false) }
  }

  return (
    <>
      <div className="modal-body">
        {error && <div className="alert alert-error">{error}</div>}
        {dupWarning && (
          <div className="alert alert-info" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <b>{t.crm.duplicateFound}</b>
            {dupWarning.map(d => <span key={d._id}>• {d.name} ({d.email || d.phone})</span>)}
            <button className="btn btn-sm btn-primary mt-8" onClick={() => { setDupWarning(null); submit(true) }}>{t.crm.forceCreate}</button>
          </div>
        )}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">{t.common.name} *</label>
            <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">{t.common.company}</label>
            <input className="form-input" value={form.company} onChange={e => set('company', e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">{t.common.phone}</label>
            <input className="form-input" value={form.phone} onChange={e => set('phone', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">{t.common.email}</label>
            <input type="email" className="form-input" value={form.email} onChange={e => set('email', e.target.value)} />
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
            <label className="form-label">{t.crm.priority}</label>
            <select className="form-select" value={form.priority} onChange={e => set('priority', e.target.value)}>
              {PRIORITIES.map(p => <option key={p} value={p}>{t.status[p]}</option>)}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">{t.crm.source}</label>
            <input className="form-input" value={form.source} onChange={e => set('source', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">{t.crm.assignedTo}</label>
            <select className="form-select" value={form.assignedTo} onChange={e => set('assignedTo', e.target.value)}>
              <option value="">{t.common.all}</option>
              {employees.map(e => <option key={e._id} value={e._id}>{e.name}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">{t.common.notes}</label>
          <textarea className="form-textarea" value={form.notes} onChange={e => set('notes', e.target.value)} />
        </div>
      </div>
      <div className="modal-footer">
        <button className="btn" onClick={onClose}>{t.common.cancel}</button>
        <button className="btn btn-primary" onClick={() => submit(false)} disabled={loading || !form.name}>
          {loading ? t.common.loading : t.common.save}
        </button>
      </div>
    </>
  )
}

export default function CRMPage() {
  const { t } = useTranslation()
  const [customers, setCustomers] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [selected, setSelected] = useState(null)
  const [editing, setEditing] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [viewMode, setViewMode] = useState('list')
  const [selectedIds, setSelectedIds] = useState([])
  const [bulkAction, setBulkAction] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const [cRes, eRes] = await Promise.all([getCustomers({ search, status: filterStatus }), getEmployees()])
      setCustomers(cRes.data.data)
      setEmployees(eRes.data.data)
    } catch {}
    setLoading(false)
  }

  useEffect(() => { load() }, [search, filterStatus])

  const handleCreate = async (data) => {
    await createCustomer(data)
    load()
  }

  const handleUpdate = async (data) => {
    await updateCustomer(selected._id, data)
    load()
    setSelected(null)
  }

  const handleDelete = async () => {
    await deleteCustomer(deleteTarget._id)
    load()
    setSelected(null)
  }

  const handleBulk = async () => {
    if (!bulkAction || !selectedIds.length) return
    const [action, value] = bulkAction.split(':')
    await bulkCustomers({ ids: selectedIds, action, value })
    setSelectedIds([])
    setBulkAction('')
    load()
  }

  const exportCSV = () => {
    const rows = [['الاسم','الشركة','البريد','الهاتف','الحالة','المصدر']]
    customers.forEach(c => rows.push([c.name, c.company, c.email, c.phone, c.status, c.source]))
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'customers.csv'; a.click()
  }

  const pipelineGroups = STATUSES.map(s => ({ status: s, items: customers.filter(c => c.status === s) }))

  return (
    <div>
      <div className="page-header flex-between">
        <h1 className="page-title">{t.crm.title}</h1>
        <div className="flex gap-8">
          <button className="btn btn-sm" onClick={exportCSV}>{t.crm.exportCSV}</button>
          <button className="btn btn-sm" onClick={() => setViewMode(v => v === 'list' ? 'pipeline' : 'list')}>
            {viewMode === 'list' ? t.crm.pipeline : t.crm.list}
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>+ {t.crm.addCustomer}</button>
        </div>
      </div>

      <div className="filters-bar">
        <input className="form-input" placeholder={t.common.search} value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: '220px' }} />
        <select className="form-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">{t.common.all}</option>
          {STATUSES.map(s => <option key={s} value={s}>{t.status[s]}</option>)}
        </select>
        {selectedIds.length > 0 && (
          <>
            <select className="form-select" value={bulkAction} onChange={e => setBulkAction(e.target.value)}>
              <option value="">{t.crm.bulkAction}</option>
              {STATUSES.map(s => <option key={s} value={`status:${s}`}>{t.crm.updateStatus}: {t.status[s]}</option>)}
              <option value="archive">{t.crm.archive}</option>
            </select>
            <button className="btn btn-primary btn-sm" onClick={handleBulk}>{t.common.confirm} ({selectedIds.length})</button>
          </>
        )}
      </div>

      {loading ? <LoadingSpinner /> : viewMode === 'pipeline' ? (
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '12px' }}>
          {pipelineGroups.map(g => (
            <div key={g.status} style={{ minWidth: '200px', maxWidth: '220px', flex: '0 0 220px' }}>
              <div style={{ fontWeight: 700, fontSize: '.82rem', padding: '6px 8px', background: 'var(--surface2)', borderRadius: '6px 6px 0 0', display: 'flex', justifyContent: 'space-between' }}>
                <StatusBadge status={g.status} />
                <span style={{ color: 'var(--text-muted)' }}>{g.items.length}</span>
              </div>
              {g.items.map(c => (
                <div key={c._id} className="card card-body" style={{ margin: '4px 0', cursor: 'pointer', fontSize: '.82rem' }} onClick={() => setSelected(c)}>
                  <div style={{ fontWeight: 600 }}>{c.name}</div>
                  {c.company && <div style={{ color: 'var(--text-muted)' }}>{c.company}</div>}
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th><input type="checkbox" onChange={e => setSelectedIds(e.target.checked ? customers.map(c => c._id) : [])} /></th>
                  <th>{t.common.name}</th>
                  <th>{t.common.company}</th>
                  <th>{t.common.status}</th>
                  <th>{t.crm.priority}</th>
                  <th>{t.crm.assignedTo}</th>
                  <th>{t.common.actions}</th>
                </tr>
              </thead>
              <tbody>
                {customers.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>{t.common.noData}</td></tr>
                ) : customers.map(c => (
                  <tr key={c._id} style={{ cursor: 'pointer' }}>
                    <td onClick={e => e.stopPropagation()}>
                      <input type="checkbox" checked={selectedIds.includes(c._id)} onChange={e => setSelectedIds(ids => e.target.checked ? [...ids, c._id] : ids.filter(i => i !== c._id))} />
                    </td>
                    <td onClick={() => setSelected(c)}><b>{c.name}</b></td>
                    <td onClick={() => setSelected(c)}>{c.company}</td>
                    <td><StatusBadge status={c.status} /></td>
                    <td><StatusBadge status={c.priority || 'medium'} /></td>
                    <td>{c.assignedTo?.name || '-'}</td>
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-sm" onClick={() => { setSelected(c); setEditing(true) }}>{t.common.edit}</button>
                        <button className="btn btn-sm btn-danger" onClick={() => setDeleteTarget(c)}>{t.common.delete}</button>
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
        <Modal title={t.crm.addCustomer} onClose={() => setShowAdd(false)} size="lg">
          <CustomerForm onSave={handleCreate} onClose={() => setShowAdd(false)} employees={employees} t={t} />
        </Modal>
      )}

      {selected && !editing && (
        <Drawer title={selected.name} onClose={() => setSelected(null)}
          footer={<>
            <button className="btn" onClick={() => setEditing(true)}>{t.common.edit}</button>
            <button className="btn btn-danger" onClick={() => setDeleteTarget(selected)}>{t.common.delete}</button>
          </>}>
          <div className="info-row"><span className="info-label">{t.common.company}</span><span className="info-value">{selected.company || '-'}</span></div>
          <div className="info-row"><span className="info-label">{t.common.email}</span><span className="info-value">{selected.email || '-'}</span></div>
          <div className="info-row"><span className="info-label">{t.common.phone}</span><span className="info-value">{selected.phone || '-'}</span></div>
          <div className="info-row"><span className="info-label">{t.common.status}</span><span className="info-value"><StatusBadge status={selected.status} /></span></div>
          <div className="info-row"><span className="info-label">{t.crm.priority}</span><span className="info-value"><StatusBadge status={selected.priority || 'medium'} /></span></div>
          <div className="info-row"><span className="info-label">{t.crm.assignedTo}</span><span className="info-value">{selected.assignedTo?.name || '-'}</span></div>
          <div className="info-row"><span className="info-label">{t.crm.source}</span><span className="info-value">{selected.source || '-'}</span></div>
          {selected.notes && <div style={{ marginTop: '12px', padding: '10px', background: 'var(--surface2)', borderRadius: '6px', fontSize: '.85rem' }}>{selected.notes}</div>}
          {selected.activityLog?.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <div className="section-title" style={{ marginBottom: '8px' }}>سجل النشاط</div>
              {selected.activityLog.slice(-5).reverse().map((a, i) => (
                <div key={i} style={{ fontSize: '.8rem', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                  {a.action} • {new Date(a.timestamp).toLocaleDateString('ar')}
                </div>
              ))}
            </div>
          )}
        </Drawer>
      )}

      {selected && editing && (
        <Modal title={t.common.edit + ' ' + selected.name} onClose={() => { setEditing(false); setSelected(null) }} size="lg">
          <CustomerForm initial={selected} onSave={handleUpdate} onClose={() => { setEditing(false); setSelected(null) }} employees={employees} t={t} />
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmModal
          message={`${t.common.deleteConfirm} ${deleteTarget.name}؟`}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
          danger
        />
      )}
    </div>
  )
}
