import React from 'react'

export default function LoadingSpinner({ full }) {
  return (
    <div className={full ? 'flex-center' : 'spinner-center'} style={full ? { minHeight: '100vh' } : {}}>
      <div className="spinner" />
    </div>
  )
}
