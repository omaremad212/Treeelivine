import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProject, getBrief, updateBrief, addBriefComment } from '../../api'
import { useTranslation } from '../../hooks/useTranslation'
import StatusBadge from '../../components/StatusBadge'
import LoadingSpinner from '../../components/LoadingSpinner'

function QuestionField({ question, value, onChange, disabled }) {
  const { type, question: label, options = [] } = question
  if (type === 'textarea') return <textarea className="form-textarea" value={value || ''} onChange={e => onChange(e.target.value)} disabled={disabled} />
  if (type === 'select') return (
    <select className="form-select" value={value || ''} onChange={e => onChange(e.target.value)} disabled={disabled}>
      <option value="">-</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  )
  if (type === 'multi_select') return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {options.map(o => (
        <label key={o} style={{ display: 'flex', gap: '4px', alignItems: 'center', cursor: 'pointer', fontSize: '.85rem' }}>
          <input type="checkbox" checked={(value || []).includes(o)} onChange={e => {
            const arr = value || []
            onChange(e.target.checked ? [...arr, o] : arr.filter(x => x !== o))
          }} disabled={disabled} />
          {o}
        </label>
      ))}
    </div>
  )
  if (type === 'boolean') return (
    <div style={{ display: 'flex', gap: '16px' }}>
      {['yes','no'].map(v => (
        <label key={v} style={{ display: 'flex', gap: '4px', alignItems: 'center', cursor: 'pointer' }}>
          <input type="radio" name={label} value={v} checked={value === v} onChange={() => onChange(v)} disabled={disabled} />
          {v === 'yes' ? 'نعم' : 'لا'}
        </label>
      ))}
    </div>
  )
  if (type === 'date') return <input type="date" className="form-input" value={value || ''} onChange={e => onChange(e.target.value)} disabled={disabled} />
  if (type === 'number') return <input type="number" className="form-input" value={value || ''} onChange={e => onChange(e.target.value)} disabled={disabled} />
  return <input className="form-input" value={value || ''} onChange={e => onChange(e.target.value)} disabled={disabled} />
}

export default function PortalBriefPage() {
  const { projectId } = useParams()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [brief, setBrief] = useState(null)
  const [answers, setAnswers] = useState({})
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const load = async () => {
    try {
      const [pRes, bRes] = await Promise.all([getProject(projectId), getBrief(projectId)])
      setProject(pRes.data.data)
      setBrief(bRes.data.data)
      setAnswers(bRes.data.data.briefAnswers || {})
    } catch (err) {
      setError(err.response?.data?.message || t.common.error)
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [projectId])

  const save = async (status) => {
    setSaving(true); setError(''); setSuccessMsg('')
    try {
      const res = await updateBrief(projectId, { briefAnswers: answers, briefStatus: status })
      setBrief(b => ({ ...b, ...res.data.data }))
      setSuccessMsg(status === 'submitted' ? 'تم إرسال البريف بنجاح!' : 'تم الحفظ')
    } catch (err) {
      setError(err.response?.data?.message || t.common.error)
    } finally { setSaving(false) }
  }

  const submitComment = async () => {
    if (!comment.trim()) return
    try {
      await addBriefComment(projectId, { text: comment })
      setComment('')
      load()
    } catch {}
  }

  const canEdit = brief?.briefStatus !== 'approved'
  const sections = {}
  ;(brief?.briefQuestionsSnapshot || []).forEach(q => {
    const sec = q.section || 'عام'
    if (!sections[sec]) sections[sec] = []
    sections[sec].push(q)
  })

  if (loading) return <LoadingSpinner />

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <button className="btn btn-sm" onClick={() => navigate('/portal/projects')}>← رجوع</button>
        <h1 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{t.brief.title}: {project?.name}</h1>
        <StatusBadge status={brief?.briefStatus || 'not_started'} />
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      {brief?.briefStatus === 'changes_requested' && (
        <div className="alert alert-info">يتطلب البريف تعديلات. يرجى مراجعة التعليقات وإعادة الإرسال.</div>
      )}
      {brief?.briefStatus === 'approved' && (
        <div className="alert alert-success">تم اعتماد البريف. شكرًا لتعاونكم!</div>
      )}

      {Object.keys(sections).length === 0 ? (
        <div className="card card-body"><p style={{ color: 'var(--text-muted)' }}>لا توجد أسئلة في هذا البريف</p></div>
      ) : Object.entries(sections).map(([sec, questions]) => (
        <div key={sec} className="card" style={{ marginBottom: '16px' }}>
          <div className="card-header"><h3 style={{ fontWeight: 700 }}>{sec}</h3></div>
          <div className="card-body">
            {questions.sort((a, b) => (a.order || 0) - (b.order || 0)).map((q, i) => (
              <div key={i} className="form-group">
                <label className="form-label">
                  {q.question}
                  {q.required && <span style={{ color: 'var(--danger)', marginRight: '4px' }}>*</span>}
                </label>
                <QuestionField
                  question={q}
                  value={answers[q.question]}
                  onChange={v => setAnswers(a => ({ ...a, [q.question]: v }))}
                  disabled={!canEdit}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      {canEdit && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          <button className="btn" onClick={() => save('draft')} disabled={saving}>{t.common.saveDraft}</button>
          <button className="btn btn-primary" onClick={() => save('submitted')} disabled={saving}>{t.brief.submitBrief}</button>
        </div>
      )}

      <div className="card">
        <div className="card-header"><h3 style={{ fontWeight: 700 }}>{t.brief.comments}</h3></div>
        <div className="card-body">
          {(brief?.briefComments || []).length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '.85rem' }}>لا توجد تعليقات بعد</p>}
          {(brief?.briefComments || []).map((c, i) => (
            <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <b style={{ color: 'var(--primary)' }}>{c.userName}</b>
                <span style={{ color: 'var(--text-muted)' }}>{new Date(c.timestamp).toLocaleString('ar')}</span>
              </div>
              <p>{c.text}</p>
            </div>
          ))}
          <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
            <input className="form-input" value={comment} onChange={e => setComment(e.target.value)} placeholder={t.brief.addComment} onKeyDown={e => e.key === 'Enter' && submitComment()} />
            <button className="btn btn-primary btn-sm" onClick={submitComment}>{t.common.submit}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
