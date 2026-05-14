'use client'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useApp } from '@/contexts/AppContext'

const NAV_ITEMS = [
  { href: '/app', label: 'dashboard', icon: '📊', perm: null },
  { href: '/app/crm', label: 'crm', icon: '👥', perm: 'crm.read' },
  { href: '/app/projects', label: 'projects', icon: '📁', perm: 'projects.read' },
  { href: '/app/tasks', label: 'tasks', icon: '✅', perm: 'tasks.read' },
  { href: '/app/team', label: 'team', icon: '🏢', perm: 'team.read' },
  { href: '/app/finance', label: 'finance', icon: '💰', perm: 'finance.read' },
  { href: '/app/templates', label: 'templates', icon: '📄', perm: 'templates.read' },
  { href: '/app/settings', label: 'settings', icon: '⚙️', perm: 'settings.read' },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout, hasPermission, t, lang, setLang, theme, setTheme } = useApp()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user) router.replace('/login')
    if (!loading && user && user.role === 'client') router.replace('/portal')
  }, [user, loading, router])

  if (loading || !user) return null

  const visibleNav = NAV_ITEMS.filter(item => !item.perm || hasPermission(item.perm))

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside style={{
        width: 'var(--sidebar-width)',
        background: 'var(--surface)',
        borderInlineEnd: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        overflow: 'auto',
      }}>
        <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid var(--border)' }}>
          <h1 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent)' }}>Treeelivine</h1>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>ERP System</p>
        </div>

        <nav style={{ flex: 1, padding: '0.75rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
          {visibleNav.map(item => {
            const isActive = item.href === '/app' ? pathname === '/app' : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.6rem',
                  padding: '0.6rem 0.75rem', borderRadius: 8,
                  fontSize: '0.875rem', fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--accent)' : 'var(--text)',
                  background: isActive ? 'var(--accent)11' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.15s',
                }}
              >
                <span>{item.icon}</span>
                <span>{(t as any)[item.label] || item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: '#fff', fontWeight: 600 }}>
              {(user.name || user.email || '?')[0].toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name || user.email}</p>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user.role}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <button className="btn btn-secondary" onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} style={{ flex: 1, justifyContent: 'center', fontSize: '0.75rem', padding: '0.35rem 0.5rem' }}>
              {lang === 'ar' ? 'EN' : 'AR'}
            </button>
            <button className="btn btn-secondary" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} style={{ flex: 1, justifyContent: 'center', fontSize: '0.75rem', padding: '0.35rem 0.5rem' }}>
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button className="btn btn-secondary" onClick={logout} style={{ flex: 1, justifyContent: 'center', fontSize: '0.75rem', padding: '0.35rem 0.5rem' }} title="Logout">
              ↩
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>
    </div>
  )
}
