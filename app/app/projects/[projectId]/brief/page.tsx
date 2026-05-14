'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useApp } from '@/contexts/AppContext'
import StatusBadge from '@/components/ui/StatusBadge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function BriefPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const { t, user, hasPermission } = useApp()
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [briefText, setBriefText] = useState('')
  const [comment, setComment] = useState('')
  const [saving, setSaving] = useState(false)

  async function fetchBrief() {
    const res = await fetch(`/api/projects/${projectId}/brief`)
    const data = await res.json()
    if (data.success) { setProject(data.data); setBriefText(data.data.brief || '') }
    setLoading(false)
  }

  useEffect(() => { fetchBrief() }, [projectId])

  async function saveBrief() {
    setSaving(true)
    await fetch(`/api/projects/${projectId}/brief`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ brief: briefText }) })
    setSaving(false); setEditing(false); fetchBrief()
  }

  async function handleAction(action: string) {
    setSaving(true)
    await fetch(`/api/projects/${projectId}/brief`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action }) })
    setSaving(false); fetchBrief()
  }

  async function addComment() {
    if (!comment.trim()) return
    await fetch(`/api/projects/${projectId}/brief/comment`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: comment }) })
    setComment(''); fetchBrief()
  }

  if (loading) return <LoadingSpinner />

  return (
    <div style={{ padding: '1.5rem', flex: 1, maxWidth: 800, margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <Link href="/app/projects" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>← {t.projects || 'Projects'}</Link>
        <span style={{ color: 'var(--border)' }}>/</span>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{project?.name} — Brief</h2>
        {project?.briefStatus && <StatusBadge status={project.briefStatus} />}
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Project Brief</h3>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {hasPermission('projects.write') && !editing && (
              <>
                <button className="btn btn-secondary" onClick={() => setEditing(true)} style={{ fontSize: '0.8rem' }}>Edit</button>
                {project?.briefStatus !== 'approved' && (
                  <button className="btn btn-primary" onClick={() => handleAction('approve')} disabled={saving} style={{ fontSize: '0.8rem' }}>Approve</button>
                )}
                {project?.briefStatus === 'approved' && (
                  <button className="btn btn-danger" onClick={() => handleAction('reject')} disabled={saving} style={{ fontSize: '0.8rem' }}>Reject</button>
                )}
              </>
            )}
          </div>
        </div>

        {editing ? (
          <div>
            <textarea className="input" value={briefText} onChange={e => setBriefText(e.target.value)} rows={12} style={{ fontFamily: 'inherit', lineHeight: 1.7 }} />
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveBrief} disabled={saving}>{saving ? '...' : 'Save'}</button>
            </div>
          </div>
        ) : (
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, color: project?.brief ? 'var(--text)' : 'var(--text-muted)', minHeight: 80 }}>
            {project?.brief || 'No brief written yet.'}
          </div>
        )}
      </div>

      <div className="card">
        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem' }}>Comments ({project?.briefComments?.length || 0})</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
          {(project?.briefComments || []).map((c: any, i: number) => (
            <div key={i} style={{ background: 'var(--surface2)', borderRadius: 8, padding: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{c.authorName}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{new Date(c.createdAt).toLocaleString()}</span>
              </div>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>{c.text}</p>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input className="input" placeholder="Add a comment..." value={comment} onChange={e => setComment(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addComment() }} />
          <button className="btn btn-primary" onClick={addComment}>Send</button>
        </div>
      </div>
    </div>
  )
}
