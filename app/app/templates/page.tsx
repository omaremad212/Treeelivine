'use client'
import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import Modal from '@/components/ui/Modal'
import ConfirmModal from '@/components/ui/ConfirmModal'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

const TYPES = ['brief', 'contract', 'proposal', 'report', 'email', 'other']
const CATEGORIES = ['marketing', 'design', 'development', 'general']

export default function TemplatesPage() {
  const { t, hasPermission } = useApp()
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [viewModal, setViewModal] = useState<any>(null)
  const [editing, setEditing] = useState<any>(null)
  const [deleteTarget, setDeleteTarget] = useState<any>(null)
  const [deleting, setDeleting] = useState(false)
  const [form, setForm] = useState<any>({})
  const [saving, setSaving] = useState(false)

  async function fetchTemplates() {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (filterType) params.set('type', filterType)
    const res = await fetch(`/api/templates?${params}`)
    const data = await res.json()
    if (data.success) setTemplates(data.data)
    setLoading(false)
  }

  useEffect(() => { fetchTemplates() }, [search, filterType])

  function openCreate() { setForm({ type: 'brief', category: 'general' }); setEditing(null); setModalOpen(true) }
  function openEdit(tp: any) { setForm({ ...tp }); setEditing(tp); setModalOpen(true) }

  async function handleSave() {
    setSaving(true)
    const url = editing ? `/api/templates/${editing._id}` : '/api/templates'
    const res = await fetch(url, { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    if (data.success) { setModalOpen(false); fetchTemplates() }
    setSaving(false)
  }

  async function handleDelete() {
    setDeleting(true)
    await fetch(`/api/templates/${deleteTarget._id}`, { method: 'DELETE' })
    setDeleteTarget(null); setDeleting(false); fetchTemplates()
  }

  async function useTemplate(tp: any) {
    const res = await fetch(`/api/templates/${tp._id}`)
    const data = await res.json()
    if (data.success) setViewModal(data.data)
  }

  return (
    <div style={{ padding: '1.5rem', flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, flex: 1 }}>{t.templates || 'Templates'}</h2>
        <input className="input" placeholder={t.search || 'Search...'} value={search} onChange={e => setSearch(e.target.value)} style={{ width: 180 }} />
        <select className="input" value={filterType} onChange={e => setFilterType(e.target.value)} style={{ width: 140 }}>
          <option value="">All Types</option>
          {TYPES.map(tp => <option key={tp} value={tp}>{tp}</option>)}
        </select>
        {hasPermission('templates.write') && <button className="btn btn-primary" onClick={openCreate}>+ {t.addTemplate || 'Add Template'}</button>}
      </div>

      {loading ? <LoadingSpinner /> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {templates.map(tp => (
            <div key={tp._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.7rem', background: 'var(--accent)22', color: 'var(--accent)', padding: '0.15rem 0.5rem', borderRadius: 4, fontWeight: 600 }}>{tp.type}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Used {tp.usageCount || 0}×</span>
              </div>
              <h3 style={{ fontWeight: 600, fontSize: '0.95rem' }}>{tp.name}</h3>
              {tp.description && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{tp.description.substring(0, 80)}{tp.description.length > 80 ? '...' : ''}</p>}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                <button className="btn btn-primary" onClick={() => useTemplate(tp)} style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem' }}>Use</button>
                {hasPermission('templates.write') && <button className="btn btn-secondary" onClick={() => openEdit(tp)} style={{ fontSize: '0.8rem' }}>Edit</button>}
                {hasPermission('templates.write') && <button className="btn btn-danger" onClick={() => setDeleteTarget(tp)} style={{ fontSize: '0.8rem' }}>Del</button>}
              </div>
            </div>
          ))}
          {templates.length === 0 && <p style={{ color: 'var(--text-muted)', gridColumn: '1/-1' }}>No templates found</p>}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Template' : 'Add Template'} width={600}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div><label className="label">Name *</label><input className="input" value={form.name || ''} onChange={e => setForm((p: any) => ({ ...p, name: e.target.value }))} /></div>
          <div><label className="label">Description</label><input className="input" value={form.description || ''} onChange={e => setForm((p: any) => ({ ...p, description: e.target.value }))} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div><label className="label">Type</label>
              <select className="input" value={form.type || 'brief'} onChange={e => setForm((p: any) => ({ ...p, type: e.target.value }))}>
                {TYPES.map(tp => <option key={tp} value={tp}>{tp}</option>)}
              </select>
            </div>
            <div><label className="label">Category</label>
              <select className="input" value={form.category || 'general'} onChange={e => setForm((p: any) => ({ ...p, category: e.target.value }))}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div><label className="label">Content</label><textarea className="input" value={form.content || ''} onChange={e => setForm((p: any) => ({ ...p, content: e.target.value }))} rows={10} style={{ fontFamily: 'monospace', fontSize: '0.85rem' }} /></div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? '...' : 'Save'}</button>
          </div>
        </div>
      </Modal>

      <Modal open={!!viewModal} onClose={() => setViewModal(null)} title={viewModal?.name} width={700}>
        <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.875rem', lineHeight: 1.7, maxHeight: '60vh', overflow: 'auto', background: 'var(--surface2)', padding: '1rem', borderRadius: 8 }}>
          {viewModal?.content || 'No content'}
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button className="btn btn-secondary" onClick={() => { navigator.clipboard.writeText(viewModal?.content || ''); setViewModal(null) }}>Copy & Close</button>
          <button className="btn btn-secondary" onClick={() => setViewModal(null)}>Close</button>
        </div>
      </Modal>

      <ConfirmModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Template" message={`Delete "${deleteTarget?.name}"?`} loading={deleting} />
    </div>
  )
}
