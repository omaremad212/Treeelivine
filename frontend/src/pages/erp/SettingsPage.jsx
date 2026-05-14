import React, { useState, useEffect } from 'react'
import { getSettings, updateSettings, updateCurrencies } from '../../api'
import { useSettings } from '../../contexts/SettingsContext'
import { useTranslation } from '../../hooks/useTranslation'
import LoadingSpinner from '../../components/LoadingSpinner'

export default function SettingsPage() {
  const { t } = useTranslation()
  const { setSettings: setCtxSettings } = useSettings()
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState('general')
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const load = async () => {
    try { const res = await getSettings(); setSettings(res.data.data) }
    catch {}
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const save = async (data) => {
    setSaving(true); setError(''); setSuccess('')
    try {
      const res = await updateSettings(data)
      setSettings(res.data.data)
      setCtxSettings(res.data.data)
      setSuccess(t.common.success)
    } catch (err) {
      setError(err.response?.data?.message || t.common.error)
    } finally { setSaving(false) }
  }

  const set = (k, v) => setSettings(s => ({ ...s, [k]: v }))

  if (loading) return <LoadingSpinner />

  const allPerms = settings?.permissions || []
  const roles = settings?.roles || []

  return (
    <div>
      <div className="page-header flex-between">
        <h1 className="page-title">{t.settings.title}</h1>
        <button className="btn btn-primary" onClick={() => save(settings)} disabled={saving}>
          {saving ? t.common.loading : t.common.save}
        </button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="tabs">
        {['general','language','currency','permissions','audit'].map(tab2 => (
          <button key={tab2} className={`tab-btn ${tab === tab2 ? 'active' : ''}`} onClick={() => setTab(tab2)}>
            {t.settings[tab2]}
          </button>
        ))}
      </div>

      {tab === 'general' && (
        <div className="card card-body" style={{ maxWidth: '600px' }}>
          <div className="form-group">
            <label className="form-label">{t.settings.companyName}</label>
            <input className="form-input" value={settings?.companyName || ''} onChange={e => set('companyName', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">{t.settings.companyLogo} (URL)</label>
            <input className="form-input" value={settings?.companyLogo || ''} onChange={e => set('companyLogo', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">{t.settings.companyDesc}</label>
            <textarea className="form-textarea" value={settings?.companyDescription || ''} onChange={e => set('companyDescription', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">{t.settings.theme}</label>
            <select className="form-select" value={settings?.theme || 'light'} onChange={e => set('theme', e.target.value)}>
              <option value="light">{t.settings.light}</option>
              <option value="dark">{t.settings.dark}</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">{t.settings.primaryColor}</label>
            <input type="color" value={settings?.primaryColor || '#2563eb'} onChange={e => set('primaryColor', e.target.value)} style={{ height: '36px', width: '80px', borderRadius: '6px', border: '1px solid var(--border)', cursor: 'pointer' }} />
          </div>
        </div>
      )}

      {tab === 'language' && (
        <div className="card card-body" style={{ maxWidth: '400px' }}>
          <div className="form-group">
            <label className="form-label">{t.settings.defaultLanguage}</label>
            <select className="form-select" value={settings?.defaultLanguage || 'ar'} onChange={e => set('defaultLanguage', e.target.value)}>
              <option value="ar">العربية</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      )}

      {tab === 'currency' && (
        <div className="card card-body" style={{ maxWidth: '600px' }}>
          <div className="form-group">
            <label className="form-label">{t.settings.baseCurrency}</label>
            <input className="form-input" value={settings?.baseCurrency || 'SAR'} onChange={e => set('baseCurrency', e.target.value)} />
          </div>
          <div>
            <div className="section-header" style={{ marginTop: '16px' }}>
              <div className="section-title">{t.settings.exchangeRates}</div>
            </div>
            {Object.entries(settings?.exchangeRates || {}).map(([code, rate]) => (
              <div key={code} style={{ display: 'flex', gap: '12px', marginBottom: '8px', alignItems: 'center' }}>
                <input className="form-input" value={code} style={{ width: '80px' }} readOnly />
                <input type="number" className="form-input" value={rate} onChange={e => {
                  const rates = { ...settings.exchangeRates, [code]: parseFloat(e.target.value) }
                  set('exchangeRates', rates)
                }} />
              </div>
            ))}
            <button className="btn btn-sm" onClick={() => {
              const code = prompt('كود العملة (مثال: USD)')
              if (code) set('exchangeRates', { ...settings.exchangeRates, [code]: 1 })
            }}>+ إضافة عملة</button>
          </div>
        </div>
      )}

      {tab === 'permissions' && (
        <div>
          {roles.map((role, ri) => (
            <div key={role.role} className="card" style={{ marginBottom: '16px' }}>
              <div className="card-header"><h3 style={{ fontWeight: 700 }}>{role.label || role.role}</h3></div>
              <div className="card-body">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {allPerms.map(p => (
                    <label key={p.key} style={{ display: 'flex', gap: '6px', alignItems: 'center', cursor: 'pointer', fontSize: '.82rem', minWidth: '160px' }}>
                      <input type="checkbox"
                        checked={(role.permissions || []).includes(p.key)}
                        onChange={e => {
                          const updated = [...roles]
                          if (e.target.checked) updated[ri] = { ...role, permissions: [...(role.permissions || []), p.key] }
                          else updated[ri] = { ...role, permissions: (role.permissions || []).filter(x => x !== p.key) }
                          set('roles', updated)
                        }}
                      />
                      {p.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'audit' && (
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead><tr><th>الإجراء</th><th>التاريخ</th></tr></thead>
              <tbody>
                {(settings?.auditTrail || []).slice(-20).reverse().map((a, i) => (
                  <tr key={i}>
                    <td>{a.action}</td>
                    <td>{new Date(a.timestamp).toLocaleString('ar')}</td>
                  </tr>
                ))}
                {!settings?.auditTrail?.length && <tr><td colSpan={2} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>{t.common.noData}</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
