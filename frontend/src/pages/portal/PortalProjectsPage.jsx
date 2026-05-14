import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProjects } from '../../api'
import { useTranslation } from '../../hooks/useTranslation'
import StatusBadge from '../../components/StatusBadge'
import LoadingSpinner from '../../components/LoadingSpinner'

export default function PortalProjectsPage() {
  const { t } = useTranslation()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProjects().then(res => setProjects(res.data.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{t.portal.projects}</h1>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {projects.length === 0 && <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>{t.common.noData}</div>}
        {projects.map(p => (
          <div key={p._id} className="card card-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '6px' }}>{p.name}</div>
                {p.serviceDescription && <p style={{ color: 'var(--text-muted)', fontSize: '.85rem', marginBottom: '8px' }}>{p.serviceDescription}</p>}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <StatusBadge status={p.status} />
                  {p.briefTemplateId && <StatusBadge status={p.briefStatus || 'not_started'} />}
                  {p.projectType && <StatusBadge status={p.projectType} />}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                {p.startDate && <span style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>بداية: {new Date(p.startDate).toLocaleDateString('ar')}</span>}
                {p.briefTemplateId && (
                  <Link to={`/portal/briefs/${p._id}`} className="btn btn-primary btn-sm">{t.portal.openBrief}</Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
