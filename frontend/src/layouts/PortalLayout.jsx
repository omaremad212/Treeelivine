import React from 'react'
import { NavLink, Outlet, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTranslation } from '../hooks/useTranslation'
import LoadingSpinner from '../components/LoadingSpinner'

export default function PortalLayout() {
  const { user, loading, logout } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()

  if (loading) return <LoadingSpinner full />
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'client') return <Navigate to="/app" replace />

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="portal-layout">
      <nav className="portal-nav">
        <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>
          Tree<span style={{ color: 'var(--primary)' }}>elivine</span>
        </div>
        <div className="portal-nav-links">
          <NavLink to="/portal" end className={({ isActive }) => isActive ? 'active' : ''}>
            {t.portal.title}
          </NavLink>
          <NavLink to="/portal/projects" className={({ isActive }) => isActive ? 'active' : ''}>
            {t.portal.projects}
          </NavLink>
          <NavLink to="/portal/invoices" className={({ isActive }) => isActive ? 'active' : ''}>
            {t.portal.invoices}
          </NavLink>
        </div>
        <button className="btn btn-sm" onClick={handleLogout}>{t.auth.logout}</button>
      </nav>
      <div className="portal-content">
        <Outlet />
      </div>
    </div>
  )
}
