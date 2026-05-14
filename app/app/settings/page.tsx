'use client'
import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

type Tab = 'general' | 'permissions' | 'users' | 'currencies'

export default function SettingsPage() {
  const { t, hasPermission, settings: appSettings, setSettings } = useApp()
  const [tab, setTab] = useState<Tab>('general')
  const [settings, setLocalSettings] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/settings').then(r => r.json()),
      fetch('/api/users').then(r => r.json()),
    ]).then(([s, u]) => {
      if (s.success) setLocalSettings(s.data)
      if (u.success) setUsers(u.data)
      setLoading(false)
    })
  }, [])

  async function saveSettings() {
    setSaving(true)
    const res = await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) })
    const data = await res.json()
    if (data.success && setSettings) setSettings(data.data)
    setSaving(false)
  }

  async function updateUserPermissions(userId: string, effectivePermissions: string[]) {
    await fetch(`/api/users/${userId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ effectivePermissions }) })
    const res = await fetch('/api/users')
    const data = await res.json()
    if (data.success) setUsers(data.data)
  }

  if (loading) return <LoadingSpinner />

  const TABS: Tab[] = ['general', 'currencies', 'users', 'permissions']
  const ALL_PERMISSIONS = ['crm.read', 'crm.write', 'projects.read', 'projects.write', 'tasks.read', 'tasks.write', 'team.read', 'team.write', 'finance.read', 'finance.write', 'templates.read', 'templates.write', 'settings.read', 'settings.write']

  return (
    <div style={{ padding: '1.5rem', flex: 1 }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>{t.settings || 'Settings'}</h2>

      <div style={{ display: 'flex', gap: '0.25rem', background: 'var(--surface2)', borderRadius: 8, padding: '0.25rem', marginBottom: '1.5rem', width: 'fit-content' }}>
        {TABS.map(tb => (
          <button key={tb} className="btn" onClick={() => setTab(tb)} style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem', background: tab === tb ? 'var(--accent)' : 'transparent', color: tab === tb ? '#fff' : 'var(--text)', border: 'none' }}>
            {(t as any)[tb] || tb}
          </button>
        ))}
      </div>

      {tab === 'general' && settings && (
        <div className="card" style={{ maxWidth: 560 }}>
          <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>General Settings</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div><label className="label">Company Name</label><input className="input" value={settings.companyName || ''} onChange={e => setLocalSettings((p: any) => ({ ...p, companyName: e.target.value }))} /></div>
            <div><label className="label">Company Address</label><textarea className="input" value={settings.companyAddress || ''} onChange={e => setLocalSettings((p: any) => ({ ...p, companyAddress: e.target.value }))} rows={2} /></div>
            <div><label className="label">Default Currency</label>
              <input className="input" value={settings.defaultCurrency || ''} onChange={e => setLocalSettings((p: any) => ({ ...p, defaultCurrency: e.target.value }))} placeholder="SAR" />
            </div>
            <div><label className="label">Tax Rate (%)</label><input className="input" type="number" value={settings.defaultTaxRate || ''} onChange={e => setLocalSettings((p: any) => ({ ...p, defaultTaxRate: Number(e.target.value) }))} /></div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input type="checkbox" id="demoMode" checked={!!settings.demoMode} onChange={e => setLocalSettings((p: any) => ({ ...p, demoMode: e.target.checked })) } />
              <label htmlFor="demoMode" style={{ fontSize: '0.875rem' }}>Demo Mode</label>
            </div>
            <button className="btn btn-primary" onClick={saveSettings} disabled={saving} style={{ width: 'fit-content' }}>{saving ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </div>
      )}

      {tab === 'currencies' && settings && (
        <div className="card" style={{ maxWidth: 560 }}>
          <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Currencies</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
            {(settings.currencies || []).map((c: any, i: number) => (
              <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <input className="input" value={c.code || ''} placeholder="USD" onChange={e => {
                  const arr = [...settings.currencies]; arr[i] = { ...arr[i], code: e.target.value }
                  setLocalSettings((p: any) => ({ ...p, currencies: arr }))
                }} style={{ width: 80 }} />
                <input className="input" value={c.name || ''} placeholder="US Dollar" onChange={e => {
                  const arr = [...settings.currencies]; arr[i] = { ...arr[i], name: e.target.value }
                  setLocalSettings((p: any) => ({ ...p, currencies: arr }))
                }} />
                <input className="input" type="number" value={c.rate || 1} placeholder="Rate" onChange={e => {
                  const arr = [...settings.currencies]; arr[i] = { ...arr[i], rate: Number(e.target.value) }
                  setLocalSettings((p: any) => ({ ...p, currencies: arr }))
                }} style={{ width: 100 }} />
                <button className="btn btn-danger" onClick={() => setLocalSettings((p: any) => ({ ...p, currencies: settings.currencies.filter((_: any, j: number) => j !== i) }))} style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}>×</button>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-secondary" onClick={() => setLocalSettings((p: any) => ({ ...p, currencies: [...(settings.currencies || []), { code: '', name: '', rate: 1 }] }))}>+ Add Currency</button>
            <button className="btn btn-primary" onClick={saveSettings} disabled={saving}>{saving ? '...' : 'Save'}</button>
          </div>
        </div>
      )}

      {tab === 'users' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface2)' }}>
                {['Name / Email', 'Role', 'Active', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'start', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <p style={{ fontWeight: 500 }}>{u.name || '-'}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.email}</p>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>{u.role}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ color: u.isActive ? 'var(--success)' : 'var(--danger)', fontSize: '0.85rem' }}>{u.isActive ? 'Active' : 'Inactive'}</span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <button className="btn btn-secondary" onClick={() => fetch(`/api/users/${u._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !u.isActive }) }).then(() => fetch('/api/users').then(r => r.json()).then(d => { if (d.success) setUsers(d.data) }))} style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}>
                      Toggle Active
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'permissions' && (
        <div className="card" style={{ overflowX: 'auto' }}>
          <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>User Permissions</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'start', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, width: 160 }}>User</th>
                {ALL_PERMISSIONS.map(p => (
                  <th key={p} style={{ padding: '0.5rem 0.25rem', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, textAlign: 'center', writingMode: 'vertical-lr', height: 80 }}>{p}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.filter(u => u.role !== 'admin').map(u => (
                <tr key={u._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                    <p style={{ fontWeight: 500 }}>{u.name || u.email}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.role}</p>
                  </td>
                  {ALL_PERMISSIONS.map(perm => {
                    const has = (u.effectivePermissions || []).includes(perm)
                    return (
                      <td key={perm} style={{ textAlign: 'center', padding: '0.5rem 0.25rem' }}>
                        <input type="checkbox" checked={has} onChange={e => {
                          const current = u.effectivePermissions || []
                          const next = e.target.checked ? [...current, perm] : current.filter((x: string) => x !== perm)
                          updateUserPermissions(u._id, next)
                        }} />
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
