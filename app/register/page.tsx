'use client'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/contexts/AppContext'
import Link from 'next/link'

export default function RegisterPage() {
  const { login, t } = useApp()
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', company: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!data.success) { setError(data.message || 'Registration failed'); setLoading(false); return }
      const ok = await login(form.email, form.password)
      if (ok) router.push('/portal')
    } catch {
      setError('Registration failed')
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent)' }}>Treeelivine</h1>
        </div>
        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem' }}>{t.register || 'Create Account'}</h2>
          {error && (
            <div style={{ background: '#3d1a1a', border: '1px solid var(--danger)', borderRadius: 8, padding: '0.75rem', marginBottom: '1rem', color: 'var(--danger)', fontSize: '0.875rem' }}>{error}</div>
          )}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="label">{t.name || 'Name'} *</label>
              <input className="input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
            </div>
            <div>
              <label className="label">{t.email || 'Email'} *</label>
              <input className="input" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
            </div>
            <div>
              <label className="label">{t.password || 'Password'} *</label>
              <input className="input" type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required minLength={6} />
            </div>
            <div>
              <label className="label">{t.phone || 'Phone'}</label>
              <input className="input" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
            </div>
            <div>
              <label className="label">{t.company || 'Company'}</label>
              <input className="input" value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} />
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
              {loading ? '...' : (t.register || 'Create Account')}
            </button>
          </form>
          <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {t.haveAccount || 'Already have an account?'}{' '}
            <Link href="/login" style={{ color: 'var(--accent)' }}>{t.login || 'Sign In'}</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
