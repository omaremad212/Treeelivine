'use client'
import Modal from './Modal'
import { useApp } from '@/contexts/AppContext'

interface Props {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message?: string
  danger?: boolean
  loading?: boolean
}

export default function ConfirmModal({ open, onClose, onConfirm, title, message, danger = true, loading }: Props) {
  const { t } = useApp()
  return (
    <Modal open={open} onClose={onClose} title={title || t.confirm || 'Confirm'} width={400}>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{message || t.areYouSure || 'Are you sure?'}</p>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
        <button className="btn btn-secondary" onClick={onClose}>{t.cancel || 'Cancel'}</button>
        <button className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm} disabled={loading}>
          {loading ? '...' : (t.confirm || 'Confirm')}
        </button>
      </div>
    </Modal>
  )
}
