import React from 'react'

export default function KPICard({ label, value, icon, color = 'blue' }) {
  return (
    <div className="kpi-card">
      {icon && <div className="kpi-icon">{icon}</div>}
      <div className="kpi-label">{label}</div>
      <div className="kpi-value" style={{ color: `var(--${color === 'green' ? 'success' : color === 'red' ? 'danger' : color === 'yellow' ? 'warning' : 'primary'})` }}>
        {value}
      </div>
    </div>
  )
}
