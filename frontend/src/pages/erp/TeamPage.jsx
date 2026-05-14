import React, { useState, useEffect } from 'react'
import { getEmployees, createEmployee, updateEmployee, deleteEmployee, getUsers, createUser, updateUser } from '../../api'
import { useTranslation } from '../../hooks/useTranslation'
import StatusBadge from '../../components/StatusBadge'
import Modal from '../../components/Modal'
import Drawer from '../../components/Drawer'
import ConfirmModal from '../../components/ConfirmModal'
import LoadingSpinner from '../../components/LoadingSpinner'

function EmployeeForm({ initial = {}, onSave, onClose, t }) {
  const [form, setForm] = useState({
    name: '', phone: '', email: '', internalRole: 'task_member',
    availabilityStatus: 'available', onLeave: false, isActive: true,
    skills: '', specializations: '', notes: '',
    ...initial,
    skills: (initial.skills || []).join(', '),
    specializations: (initial.specializations || []).join(', '),
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const submit = async () => {
    setError(''); setLoading(true)
    const data = {
      ...form,
      skills: form.skills ? form.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
      specializations: form.specializations ? form.specializations.split(',').map(s => s.trim()).filter(Boolean) : [],
    }
    try { await onSave(data); onClose() }
    catch (err) { setError(err.response?.data?.message || t.common.error) }
    finally { setLoading(false) }
  }

  return (
    <>
      <div className="modal-body">
        {error && <div className="alert alert-error">{error}</div>}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">{t.common.name} *</label>
            <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">{t.team.internalRole}</label>
            <select className="form-select" value={form.internalRole} onChange={e => set('internalRole', e.target.value)}>
              <option value="account_manager">{t.team.accountManager}</option>
              <option value="task_member">{t.team.taskMember}</option>
            </select>
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
            <label className="form-label">{t.team.availability}</label>
            <select className="form-select" value={form.availabilityStatus} onChange={e => set('availabilityStatus', e.target.value)}>
              <option value="available">{t.status.available}</option>
              <option value="busy">{t.status.busy}</option>
              <option value="unavailable">{t.status.unavailable}</option>
            </select>
          </div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '14px' }}>
            <label style={{ display: 'flex', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.onLeave} onChange={e => set('onLeave', e.target.checked)} />
              {t.team.onLeave}
            </label>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">{t.team.skills} (مفصولة بفاصلة)</label>
          <input className="form-input" value={form.skills} onChange={e => set('skills', e.target.value)} placeholder="Design, Video, Copywriting" />
        </div>
        <div className="form-group">
          <label className="form-label">{t.team.specializations} (مفصولة بفاصلة)</label>
          <input className="form-input" value={form.specializations} onChange={e => set('specializations', e.target.value)} />
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

function LinkAccountModal({ employee, onConfirm, onClose, t }) {
  const [mode, setMode] = useState('create')
  const [email, setEmail] = useState(employee.email || '')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async () => {
    setError(''); setLoading(true)
    try {
      await onConfirm({ email, password, role: 'team', referenceId: employee._id, roleRef: 'Employee' })
      onClose()
    } catch (err) { setError(err.response?.data?.message || t.common.error) }
    finally { setLoading(false) }
  }

  return (
    <Modal title={t.team.createAccount} onClose={onClose}>
      <div className="modal-body">
        {error && <div className="alert alert-error">{error}</div>}
        <div className="form-group">
          <label className="form-label">{t.common.email}</label>
          <input type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">{t.auth.password}</label>
          <input type="password" className="form-input" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
      </div>
      <div className="modal-footer">
        <button className="btn" onClick={onClose}>{t.common.cancel}</button>
        <button className="btn btn-primary" onClick={submit} disabled={loading || !email || !password}>
          {loading ? t.common.loading : t.team.createAccount}
        </button>
      </div>
    </Modal>
  )
}

export default function TeamPage() {
  const { t } = useTranslation()
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterRole, setFilterRole] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [selected, setSelected] = useState(null)
  const [editing, setEditing] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [linkTarget, setLinkTarget] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await getEmployees({ internalRole: filterRole })
      setEmployees(res.data.data)
    } catch {}
    setLoading(false)
  }

  useEffect(() => { load() }, [filterRole])

  const handleCreate = async (data) => { await createEmployee(data); load() }
  const handleUpdate = async (data) => { await updateEmployee(selected._id, data); load(); setSelected(null) }
  const handleDelete = async () => { await deleteEmployee(deleteTarget._id); load(); setSelected(null) }
  const handleCreateAccount = async (data) => { await createUser(data); load() }

  const toggleActive = async (emp) => {
    if (emp.user?._id) {
      await updateUser(emp.user._id, { isActive: !emp.user.isActive })
      load()
    }
  }

  return (
    <div>
      <div className="page-header flex-between">
        <h1 className="page-title">{t.team.title}</h1>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>+ {t.team.addEmployee}</button>
      </div>

      <div className="filters-bar">
        <select className="form-select" value={filterRole} onChange={e => setFilterRole(e.target.value)}>
          <option value="">{t.common.all}</option>
          <option value="account_manager">{t.team.accountManager}</option>
          <option value="task_member">{t.team.taskMember}</option>
        </select>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="grid-3" style={{ gap: '16px' }}>
          {employees.length === 0 && <div style={{ color: 'var(--text-muted)', gridColumn: '1/-1', textAlign: 'center', padding: '40px' }}>{t.common.noData}</div>}
          {employees.map(emp => (
            <div key={emp._id} className="card card-body" style={{ cursor: 'pointer' }} onClick={() => setSelected(emp)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ fontWeight: 700 }}>{emp.name}</div>
                <StatusBadge status={emp.availabilityStatus || 'available'} />
              </div>
              <div style={{ fontSize: '.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                {emp.internalRole === 'account_manager' ? t.team.accountManager : t.team.taskMember}
              </div>
              {emp.email && <div style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>{emp.email}</div>}
              {(emp.specializations || []).length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
                  {emp.specializations.slice(0,3).map(s => <span key={s} className="badge badge-blue" style={{ fontSize: '.7rem' }}>{s}</span>)}
                </div>
              )}
              {!emp.user && <div className="badge badge-yellow" style={{ marginTop: '8px', width: 'fit-content', fontSize: '.7rem' }}>لا يوجد حساب</div>}
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <Modal title={t.team.addEmployee} onClose={() => setShowAdd(false)} size="lg">
          <EmployeeForm onSave={handleCreate} onClose={() => setShowAdd(false)} t={t} />
        </Modal>
      )}

      {selected && !editing && (
        <Drawer title={selected.name} onClose={() => setSelected(null)}
          footer={<>
            <button className="btn" onClick={() => setEditing(true)}>{t.common.edit}</button>
            {!selected.user && <button className="btn btn-primary" onClick={() => setLinkTarget(selected)}>{t.team.createAccount}</button>}
            {selected.user && <button className="btn btn-sm" onClick={() => toggleActive(selected)}>{selected.user.isActive ? 'تعطيل الحساب' : 'تفعيل الحساب'}</button>}
            <button className="btn btn-danger" onClick={() => setDeleteTarget(selected)}>{t.common.delete}</button>
          </>}>
          <div className="info-row"><span className="info-label">{t.team.internalRole}</span><span className="info-value">{selected.internalRole === 'account_manager' ? t.team.accountManager : t.team.taskMember}</span></div>
          <div className="info-row"><span className="info-label">{t.common.email}</span><span className="info-value">{selected.email || '-'}</span></div>
          <div className="info-row"><span className="info-label">{t.common.phone}</span><span className="info-value">{selected.phone || '-'}</span></div>
          <div className="info-row"><span className="info-label">{t.team.availability}</span><span className="info-value"><StatusBadge status={selected.availabilityStatus || 'available'} /></span></div>
          <div className="info-row"><span className="info-label">{t.team.onLeave}</span><span className="info-value">{selected.onLeave ? 'نعم' : 'لا'}</span></div>
          {selected.skills?.length > 0 && <div className="info-row"><span className="info-label">{t.team.skills}</span><span className="info-value">{selected.skills.join(', ')}</span></div>}
          {selected.specializations?.length > 0 && <div className="info-row"><span className="info-label">{t.team.specializations}</span><span className="info-value">{selected.specializations.join(', ')}</span></div>}
          <div className="info-row"><span className="info-label">{t.team.linkedAccount}</span>
            <span className="info-value">
              {selected.user ? <><StatusBadge status={selected.user.isActive ? 'active' : 'inactive'} /> {selected.user.email}</> : <span style={{ color: 'var(--text-muted)' }}>-</span>}
            </span>
          </div>
        </Drawer>
      )}

      {selected && editing && (
        <Modal title={t.common.edit} onClose={() => { setEditing(false); setSelected(null) }} size="lg">
          <EmployeeForm initial={selected} onSave={handleUpdate} onClose={() => { setEditing(false); setSelected(null) }} t={t} />
        </Modal>
      )}

      {linkTarget && <LinkAccountModal employee={linkTarget} onConfirm={handleCreateAccount} onClose={() => setLinkTarget(null)} t={t} />}

      {deleteTarget && (
        <ConfirmModal message={`${t.common.deleteConfirm} ${deleteTarget.name}؟`} onConfirm={handleDelete} onClose={() => setDeleteTarget(null)} danger />
      )}
    </div>
  )
}
