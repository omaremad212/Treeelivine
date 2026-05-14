import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProjects, createProject, updateProject, deleteProject, getCustomers, getEmployees, getTemplates } from '../../api'
import { useTranslation } from '../../hooks/useTranslation'
import StatusBadge from '../../components/StatusBadge'
import Modal from '../../components/Modal'
import Drawer from '../../components/Drawer'
import ConfirmModal from '../../components/ConfirmModal'
import LoadingSpinner from '../../components/LoadingSpinner'

const STATUSES = ['draft','active','on_hold','completed','cancelled']

function ProjectForm({ initial = {}, onSave, onClose, customers, employees, templates, t }) {
  const [form, setForm] = useState({
    name: '', customerId: '', projectType: 'onetime', status: 'draft',
    workflowMode: 'manual', briefTemplateId: '', templateId: '', accountManagerId: '',
    estimatedCost: '', taxRate: 0, billable: true, notes: '', ...initial,
    assignedEmployeeIds: initial.assignedEmployeeIds?.map(e => e._id || e) || [],
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const submit = async () => {
    setError(''); setLoading(true)
    try {
      await onSave(form)
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || t.common.error)
    } finally { setLoading(false) }
  }

  const briefTemplates = templates.filter(t => t.kind === 'brief')
  const projectTemplates = templates.filter(t => t.kind === 'project' || t.kind === 'workflow')
  const accountManagers = employees.filter(e => e.internalRole === 'account_manager')

  return (
    <>
      <div className="modal-body">
        {error && <div className="alert alert-error">{error}</div>}
        <div className="form-group">
          <label className="form-label">{t.common.name} *</label>
          <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} required />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">{t.common.customer}</label>
            <select className="form-select" value={form.customerId} onChange={e => set('customerId', e.target.value)}>
              <option value="">-</option>
              {customers.map(c => <option key={c._id} value={c._id}>{c.name} {c.company ? `(${c.company})` : ''}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">{t.common.status}</label>
            <select className="form-select" value={form.status} onChange={e => set('status', e.target.value)}>
              {STATUSES.map(s => <option key={s} value={s}>{t.status[s]}</option>)}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">{t.common.type}</label>
            <select className="form-select" value={form.projectType} onChange={e => set('projectType', e.target.value)}>
              <option value="onetime">{t.status.onetime}</option>
              <option value="subscription">{t.status.subscription}</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">{t.projects.workflowMode}</label>
            <select className="form-select" value={form.workflowMode} onChange={e => set('workflowMode', e.target.value)}>
              <option value="manual">{t.projects.manual}</option>
              <option value="sequential">{t.projects.sequential}</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">{t.projects.accountManager}</label>
            <select className="form-select" value={form.accountManagerId} onChange={e => set('accountManagerId', e.target.value)}>
              <option value="">-</option>
              {accountManagers.map(e => <option key={e._id} value={e._id}>{e.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">{t.projects.briefTemplate}</label>
            <select className="form-select" value={form.briefTemplateId} onChange={e => set('briefTemplateId', e.target.value)}>
              <option value="">-</option>
              {briefTemplates.map(t2 => <option key={t2._id} value={t2._id}>{t2.name}</option>)}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">{t.projects.estimatedCost}</label>
            <input type="number" className="form-input" value={form.estimatedCost} onChange={e => set('estimatedCost', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">{t.projects.taxRate} %</label>
            <input type="number" className="form-input" value={form.taxRate} onChange={e => set('taxRate', e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">{t.common.notes}</label>
          <textarea className="form-textarea" value={form.notes} onChange={e => set('notes', e.target.value)} />
        </div>
      </div>
      <div className="modal-footer">
        <button className="btn" onClick={onClose}>{t.common.cancel}</button>
        <button className="btn btn-primary" onClick={submit} disabled={loading || !form.name}>
          {loading ? t.common.loading : t.common.save}
        </button>
      </div>
    </>
  )
}

export default function ProjectsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [customers, setCustomers] = useState([])
  const [employees, setEmployees] = useState([])
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [selected, setSelected] = useState(null)
  const [editing, setEditing] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const [pRes, cRes, eRes, tRes] = await Promise.all([
        getProjects({ status: filterStatus }),
        getCustomers(), getEmployees(), getTemplates()
      ])
      setProjects(pRes.data.data)
      setCustomers(cRes.data.data)
      setEmployees(eRes.data.data)
      setTemplates(tRes.data.data)
    } catch {}
    setLoading(false)
  }

  useEffect(() => { load() }, [filterStatus])

  const filtered = projects.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()))

  const handleCreate = async (data) => { await createProject(data); load() }
  const handleUpdate = async (data) => { await updateProject(selected._id, data); load(); setSelected(null) }
  const handleDelete = async () => { await deleteProject(deleteTarget._id); load(); setSelected(null) }

  const copyBriefLink = (p) => {
    const url = `${window.location.origin}/portal/briefs/${p._id}`
    navigator.clipboard.writeText(url)
    alert('تم نسخ الرابط')
  }

  return (
    <div>
      <div className="page-header flex-between">
        <h1 className="page-title">{t.projects.title}</h1>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>+ {t.projects.addProject}</button>
      </div>

      <div className="filters-bar">
        <input className="form-input" placeholder={t.common.search} value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: '220px' }} />
        <select className="form-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">{t.common.all}</option>
          {STATUSES.map(s => <option key={s} value={s}>{t.status[s]}</option>)}
        </select>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>{t.common.name}</th>
                  <th>{t.common.customer}</th>
                  <th>{t.common.status}</th>
                  <th>{t.projects.assignmentStatus}</th>
                  <th>{t.projects.briefTemplate}</th>
                  <th>{t.common.actions}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>{t.common.noData}</td></tr>
                ) : filtered.map(p => (
                  <tr key={p._id}>
                    <td style={{ cursor: 'pointer' }} onClick={() => setSelected(p)}><b>{p.name}</b></td>
                    <td>{p.customerId?.name || '-'}</td>
                    <td><StatusBadge status={p.status} /></td>
                    <td><StatusBadge status={p.assignmentStatus || 'unassigned'} /></td>
                    <td>{p.briefTemplateId ? <StatusBadge status={p.briefStatus || 'not_started'} /> : '-'}</td>
                    <td>
                      <div className="table-actions">
                        {p.briefTemplateId && <button className="btn btn-sm" onClick={() => navigate(`/app/projects/${p._id}/brief`)}>{t.projects.openBrief}</button>}
                        <button className="btn btn-sm" onClick={() => { setSelected(p); setEditing(true) }}>{t.common.edit}</button>
                        <button className="btn btn-sm btn-danger" onClick={() => setDeleteTarget(p)}>{t.common.delete}</button>
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
        <Modal title={t.projects.addProject} onClose={() => setShowAdd(false)} size="lg">
          <ProjectForm onSave={handleCreate} onClose={() => setShowAdd(false)} customers={customers} employees={employees} templates={templates} t={t} />
        </Modal>
      )}

      {selected && !editing && (
        <Drawer title={selected.name} onClose={() => setSelected(null)}
          footer={<>
            <button className="btn" onClick={() => setEditing(true)}>{t.common.edit}</button>
            {selected.briefTemplateId && <button className="btn btn-primary" onClick={() => navigate(`/app/projects/${selected._id}/brief`)}>{t.projects.openBrief}</button>}
            {selected.briefTemplateId && <button className="btn btn-sm" onClick={() => copyBriefLink(selected)}>🔗</button>}
          </>}>
          <div className="info-row"><span className="info-label">{t.common.customer}</span><span className="info-value">{selected.customerId?.name || '-'}</span></div>
          <div className="info-row"><span className="info-label">{t.common.status}</span><span className="info-value"><StatusBadge status={selected.status} /></span></div>
          <div className="info-row"><span className="info-label">{t.common.type}</span><span className="info-value"><StatusBadge status={selected.projectType} /></span></div>
          <div className="info-row"><span className="info-label">{t.projects.workflowMode}</span><span className="info-value">{selected.workflowMode}</span></div>
          <div className="info-row"><span className="info-label">{t.projects.accountManager}</span><span className="info-value">{selected.accountManagerId?.name || '-'}</span></div>
          <div className="info-row"><span className="info-label">{t.projects.estimatedCost}</span><span className="info-value">{selected.estimatedCost || '-'}</span></div>
          <div className="info-row"><span className="info-label">{t.brief.status}</span><span className="info-value"><StatusBadge status={selected.briefStatus || 'not_started'} /></span></div>
          {selected.notes && <div style={{ marginTop: '12px', padding: '10px', background: 'var(--surface2)', borderRadius: '6px', fontSize: '.85rem' }}>{selected.notes}</div>}
        </Drawer>
      )}

      {selected && editing && (
        <Modal title={t.common.edit} onClose={() => { setEditing(false); setSelected(null) }} size="lg">
          <ProjectForm initial={selected} onSave={handleUpdate} onClose={() => { setEditing(false); setSelected(null) }} customers={customers} employees={employees} templates={templates} t={t} />
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmModal message={`${t.common.deleteConfirm} ${deleteTarget.name}؟`} onConfirm={handleDelete} onClose={() => setDeleteTarget(null)} danger />
      )}
    </div>
  )
}
