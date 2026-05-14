'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useApp } from '@/contexts/AppContext'

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout, t, lang, setLang } = useApp()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.replace('/login')
    if (!loading && user && user.role !== 'client') router.replace('/app')
  }, [user, loading, router])

  if (loading || !user) return null

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <header style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '0 1.5rem', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <h1 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent)' }}>Treeelivine</h1>
          <nav style={{ display: 'flex', gap: '0.5rem' }}>
            {[{ href: '/portal', label: t.dashboard || 'Dashboard' }, { href: '/portal/projects', label: t.projects || 'Projects' }, { href: '/portal/invoices', label: t.invoices || 'Invoices' }].map(item => (
              <Link key={item.href} href={item.href} style={{ padding: '0.35rem 0.75rem', borderRadius: 6, fontSize: '0.875rem', color: 'var(--text)', textDecoration: 'none' }}>{item.label}</Link>
            ))}
          </nav>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{user.name || user.email}</span>
          <button className="btn btn-secondary" onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>{lang === 'ar' ? 'EN' : 'AR'}</button>
          <button className="btn btn-secondary" onClick={logout} style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}>Logout</button>
        </div>
      </header>
      <main style={{ padding: '1.5rem', maxWidth: 1100, margin: '0 auto' }}>{children}</main>
    </div>
  )
}
