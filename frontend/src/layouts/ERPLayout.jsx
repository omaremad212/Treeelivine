import React from 'react'
import { NavLink, Outlet, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useSettings } from '../contexts/SettingsContext'
import { useTranslation } from '../hooks/useTranslation'
import LoadingSpinner from '../components/LoadingSpinner'

const navItems = [
  { key: 'dashboard', path: '/app', icon: '📊', perm: 'dashboard.read', exact: true },
  { key: 'crm', path: '/app/crm', icon: '👥', perm: 'crm.read' },
  { key: 'projects', path: '/app/projects', icon: '📁', perm: 'projects.read' },
  { key: 'tasks', path: '/app/tasks', icon: '✅', perm: 'tasks.read' },
  { key: 'team', path: '/app/team', icon: '🧑‍💼', perm: 'team.read' },
  { key: 'finance', path: '/app/finance', icon: '💰', perm: 'finance.read' },
  { key: 'templates', path: '/app/templates', icon: '📋', perm: 'templates.read' },
  { key: 'settings', path: '/app/settings', icon: '⚙️', perm: 'settings.read' },
]

export default function ERPLayout() {
  const { user, loading, logout, hasPermission } = useAuth()
  const { lang, setLang, theme, setTheme } = useSettings()
  const { t } = useTranslation()
  const navigate = useNavigate()

  if (loading) return <LoadingSpinner full />
  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'client') return <Navigate to="/portal" replace />

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-logo">
          Tree<span>elivine</span>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => {
            if (item.perm && !hasPermission(item.perm) && user.role !== 'admin') return null
            return (
              <NavLink
                key={item.key}
                to={item.path}
                end={item.exact}
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                <span className="nav-icon">{item.icon}</span>
                {t.nav[item.key]}
              </NavLink>
            )
          })}
        </nav>
        <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,.1)' }}>
          <div style={{ color: '#94a3b8', fontSize: '.78rem', marginBottom: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user.email}
          </div>
          <button
            className="btn btn-sm"
            style={{ width: '100%', background: 'rgba(255,255,255,.08)', color: '#cbd5e1', border: 'none' }}
            onClick={handleLogout}
          >
            {t.auth.logout}
          </button>
        </div>
      </aside>

      <div className="main-content">
        <header className="topbar">
          <div style={{ fontWeight: 600, fontSize: '.9rem' }}>
            {user.role === 'admin' ? '👑 Admin' : user.role}
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            >
              {lang === 'ar' ? 'EN' : 'ع'}
            </button>
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </header>
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
