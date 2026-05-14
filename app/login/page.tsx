'use client'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/contexts/AppContext'
import Link from 'next/link'

export default function LoginPage() {
  const { login, t } = useApp()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [demoLoading, setDemoLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const ok = await login(email, password)
    if (ok) {
      router.push('/app')
    } else {
      setError(t.invalidCredentials || 'Invalid credentials')
      setLoading(false)
    }
  }

  async function handleDemo() {
    setDemoLoading(true)
    setError('')
    try {
      const res = await fetch('/api/seed', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        router.push('/app')
      } else {
        setError('Demo setup failed')
      }
    } catch {
      setError('Demo setup failed')
    } finally {
      setDemoLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent)' }}>Treeelivine</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>ERP System</p>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem' }}>{t.login || 'Sign In'}</h2>

          {error && (
            <div style={{ background: '#3d1a1a', border: '1px solid var(--danger)', borderRadius: 8, padding: '0.75rem', marginBottom: '1rem', color: 'var(--danger)', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="label">{t.email || 'Email'}</label>
              <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
            </div>
            <div>
              <label className="label">{t.password || 'Password'}</label>
              <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
              {loading ? '...' : (t.login || 'Sign In')}
            </button>
          </form>

          <div style={{ margin: '1rem 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>or</div>

          <button className="btn btn-secondary" onClick={handleDemo} disabled={demoLoading} style={{ width: '100%', justifyContent: 'center' }}>
            {demoLoading ? 'Setting up demo...' : '🚀 Try Demo'}
          </button>

          <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {t.noAccount || "Don't have an account?"}{' '}
            <Link href="/register" style={{ color: 'var(--accent)' }}>{t.register || 'Register'}</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
