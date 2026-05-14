import React, { useState, useEffect } from 'react'
import { getTemplates, createTemplate, updateTemplate, deleteTemplate, recommendAssignment } from '../../api'
import { useTranslation } from '../../hooks/useTranslation'
import StatusBadge from '../../components/StatusBadge'
import Modal from '../../components/Modal'
import Drawer from '../../components/Drawer'
import ConfirmModal from '../../components/ConfirmModal'
import LoadingSpinner from '../../components/LoadingSpinner'

const KINDS = ['workflow','project','brief','assignment_rule','stage']
const Q_TYPES = ['text','textarea','select','multi_select','boolean','date','number']

function TemplateForm({ initial = {}, onSave, onClose, t }) {
  const [form, setForm] = useState({ name: '', kind: 'brief', status: 'active', description: '', estimatedCost: '', billable: true, briefQuestions: [], workflowStages: [], assignmentRule: { specialtyWeight: 1, industryWeight: 1, availabilityWeight: 1, workloadWeight: 1, maxWorkloadTasks: 10 }, ...initial })
  const [error, setError] = useState(''); const [loading, setLoading] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const addQuestion = () => set('briefQuestions', [...(form.briefQuestions || []), { section: 'عام', question: '', type: 'text', options: [], required: false, order: (form.briefQuestions || []).length }])
  const updateQuestion = (i, k, v) => { const qs = [...(form.briefQuestions || [])]; qs[i] = { ...qs[i], [k]: v }; set('briefQuestions', qs) }
  const removeQuestion = (i) => set('briefQuestions', (form.briefQuestions || []).filter((_, idx) => idx !== i))

  const addStage = () => set('workflowStages', [...(form.workflowStages || []), { name: '', taskType: '', autoCreateTask: false, order: (form.workflowStages || []).length }])
  const updateStage = (i, k, v) => { const ss = [...(form.workflowStages || [])]; ss[i] = { ...ss[i], [k]: v }; set('workflowStages', ss) }
  const removeStage = (i) => set('workflowStages', (form.workflowStages || []).filter((_, idx) => idx !== i))

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
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">{t.common.name} *</label>
            <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">{t.templates.kind}</label>
            <select className="form-select" value={form.kind} onChange={e => set('kind', e.target.value)}>
              {KINDS.map(k => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">{t.common.description}</label>
          <textarea className="form-textarea" value={form.description} onChange={e => set('description', e.target.value)} />
        </div>

        {form.kind === 'brief' && (
          <div>
            <div className="section-header">
              <div className="section-title">{t.brief.questions}</div>
              <button className="btn btn-sm btn-primary" onClick={addQuestion}>+ {t.templates.addQuestion}</button>
            </div>
            {(form.briefQuestions || []).map((q, i) => (
              <div key={i} className="card card-body" style={{ marginBottom: '8px' }}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">السؤال</label>
                    <input className="form-input" value={q.question} onChange={e => updateQuestion(i, 'question', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">النوع</label>
                    <select className="form-select" value={q.type} onChange={e => updateQuestion(i, 'type', e.target.value)}>
                      {Q_TYPES.map(qt => <option key={qt} value={qt}>{qt}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">القسم</label>
                    <input className="form-input" value={q.section} onChange={e => updateQuestion(i, 'section', e.target.value)} />
                  </div>
                  <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '14px' }}>
                    <label style={{ display: 'flex', gap: '6px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={q.required} onChange={e => updateQuestion(i, 'required', e.target.checked)} />
                      {t.common.required}
                    </label>
                  </div>
                </div>
                {(q.type === 'select' || q.type === 'multi_select') && (
                  <div className="form-group">
                    <label className="form-label">الخيارات (مفصولة بفاصلة)</label>
                    <input className="form-input" value={(q.options || []).join(', ')} onChange={e => updateQuestion(i, 'options', e.target.value.split(',').map(o => o.trim()))} />
                  </div>
                )}
                <button className="btn btn-sm btn-danger" onClick={() => removeQuestion(i)}>{t.common.delete}</button>
              </div>
            ))}
          </div>
        )}

        {(form.kind === 'workflow' || form.kind === 'project') && (
          <div>
            <div className="section-header">
              <div className="section-title">المراحل</div>
              <button className="btn btn-sm btn-primary" onClick={addStage}>+ {t.templates.addStage}</button>
            </div>
            {(form.workflowStages || []).map((s, i) => (
              <div key={i} className="card card-body" style={{ marginBottom: '8px' }}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">اسم المرحلة</label>
                    <input className="form-input" value={s.name} onChange={e => updateStage(i, 'name', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">نوع المهمة</label>
                    <input className="form-input" value={s.taskType} onChange={e => updateStage(i, 'taskType', e.target.value)} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
                  <label style={{ display: 'flex', gap: '6px', cursor: 'pointer', fontSize: '.85rem' }}>
                    <input type="checkbox" checked={s.autoCreateTask} onChange={e => updateStage(i, 'autoCreateTask', e.target.checked)} />
                    إنشاء مهمة تلقائيًا
                  </label>
                </div>
                <button className="btn btn-sm btn-danger" onClick={() => removeStage(i)}>{t.common.delete}</button>
              </div>
            ))}
          </div>
        )}

        {form.kind === 'assignment_rule' && (
          <div>
            <div className="section-title" style={{ marginBottom: '12px' }}>أوزان الإسناد</div>
            {['specialtyWeight','industryWeight','availabilityWeight','workloadWeight'].map(w => (
              <div key={w} className="form-group">
                <label className="form-label">{t.templates[w] || w}: {form.assignmentRule?.[w] || 1}</label>
                <input type="range" min="0" max="5" step="0.5" style={{ width: '100%' }}
                  value={form.assignmentRule?.[w] || 1}
                  onChange={e => set('assignmentRule', { ...form.assignmentRule, [w]: parseFloat(e.target.value) })}
                />
              </div>
            ))}
            <div className="form-group">
              <label className="form-label">الحد الأقصى للمهام</label>
              <input type="number" className="form-input" value={form.assignmentRule?.maxWorkloadTasks || 10}
                onChange={e => set('assignmentRule', { ...form.assignmentRule, maxWorkloadTasks: parseInt(e.target.value) })}
              />
            </div>
          </div>
        )}
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

export default function TemplatesPage() {
  const { t } = useTranslation()
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterKind, setFilterKind] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [selected, setSelected] = useState(null)
  const [editing, setEditing] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [recommendations, setRecommendations] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await getTemplates({ kind: filterKind })
      setTemplates(res.data.data)
    } catch {}
    setLoading(false)
  }

  useEffect(() => { load() }, [filterKind])

  const handleCreate = async (data) => { await createTemplate(data); load() }
  const handleUpdate = async (data) => { await updateTemplate(selected._id, data); load(); setSelected(null) }
  const handleDelete = async () => { await deleteTemplate(deleteTarget._id); load(); setSelected(null) }

  const handleRecommend = async (tmpl) => {
    try {
      const res = await recommendAssignment(tmpl._id)
      setRecommendations({ template: tmpl, results: res.data.data })
    } catch (err) {
      alert(err.response?.data?.message || t.common.error)
    }
  }

  return (
    <div>
      <div className="page-header flex-between">
        <h1 className="page-title">{t.templates.title}</h1>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>+ {t.templates.addTemplate}</button>
      </div>

      <div className="filters-bar">
        <select className="form-select" value={filterKind} onChange={e => setFilterKind(e.target.value)}>
          <option value="">{t.common.all}</option>
          {KINDS.map(k => <option key={k} value={k}>{k}</option>)}
        </select>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead><tr><th>{t.common.name}</th><th>{t.templates.kind}</th><th>{t.common.status}</th><th>{t.common.actions}</th></tr></thead>
              <tbody>
                {templates.length === 0 ? <tr><td colSpan={4} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>{t.common.noData}</td></tr>
                : templates.map(tmpl => (
                  <tr key={tmpl._id}>
                    <td style={{ cursor: 'pointer' }} onClick={() => setSelected(tmpl)}><b>{tmpl.name}</b></td>
                    <td><span className="badge badge-blue">{tmpl.kind}</span></td>
                    <td><StatusBadge status={tmpl.status} /></td>
                    <td>
                      <div className="table-actions">
                        {tmpl.kind === 'assignment_rule' && <button className="btn btn-sm" onClick={() => handleRecommend(tmpl)}>{t.templates.recommend}</button>}
                        <button className="btn btn-sm" onClick={() => { setSelected(tmpl); setEditing(true) }}>{t.common.edit}</button>
                        <button className="btn btn-sm btn-danger" onClick={() => setDeleteTarget(tmpl)}>{t.common.delete}</button>
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
        <Modal title={t.templates.addTemplate} onClose={() => setShowAdd(false)} size="lg">
          <TemplateForm onSave={handleCreate} onClose={() => setShowAdd(false)} t={t} />
        </Modal>
      )}

      {selected && !editing && (
        <Drawer title={selected.name} onClose={() => setSelected(null)}
          footer={<button className="btn" onClick={() => setEditing(true)}>{t.common.edit}</button>}>
          <div className="info-row"><span className="info-label">{t.templates.kind}</span><span className="info-value">{selected.kind}</span></div>
          <div className="info-row"><span className="info-label">{t.common.status}</span><span className="info-value"><StatusBadge status={selected.status} /></span></div>
          {selected.description && <p style={{ color: 'var(--text-muted)', fontSize: '.85rem', marginTop: '8px' }}>{selected.description}</p>}
          {selected.briefQuestions?.length > 0 && <div style={{ marginTop: '12px' }}><b>الأسئلة: {selected.briefQuestions.length}</b></div>}
          {selected.workflowStages?.length > 0 && <div style={{ marginTop: '8px' }}><b>المراحل: {selected.workflowStages.length}</b></div>}
        </Drawer>
      )}

      {selected && editing && (
        <Modal title={t.common.edit} onClose={() => { setEditing(false); setSelected(null) }} size="lg">
          <TemplateForm initial={selected} onSave={handleUpdate} onClose={() => { setEditing(false); setSelected(null) }} t={t} />
        </Modal>
      )}

      {recommendations && (
        <Modal title={`اقتراح إسناد: ${recommendations.template.name}`} onClose={() => setRecommendations(null)}>
          <div className="modal-body">
            {recommendations.results.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>لا توجد اقتراحات</p>
            : recommendations.results.map((r, i) => (
              <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                <span><b>#{i+1}</b> {r.employee?.name}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '.82rem' }}>
                  نقاط: {r.score.toFixed(1)} | مهام: {r.load}
                </span>
              </div>
            ))}
          </div>
          <div className="modal-footer">
            <button className="btn" onClick={() => setRecommendations(null)}>{t.common.close}</button>
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmModal message={`${t.common.deleteConfirm} ${deleteTarget.name}؟`} onConfirm={handleDelete} onClose={() => setDeleteTarget(null)} danger />
      )}
    </div>
  )
}
