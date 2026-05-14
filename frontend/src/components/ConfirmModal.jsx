import React from 'react'
import Modal from './Modal'
import { useTranslation } from '../hooks/useTranslation'

export default function ConfirmModal({ message, onConfirm, onClose, danger }) {
  const { t } = useTranslation()
  return (
    <Modal title={t.common.areYouSure} onClose={onClose}>
      <div className="modal-body">
        <p>{message || t.common.deleteConfirm}</p>
      </div>
      <div className="modal-footer">
        <button className="btn" onClick={onClose}>{t.common.cancel}</button>
        <button className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={() => { onConfirm(); onClose(); }}>
          {t.common.confirm}
        </button>
      </div>
    </Modal>
  )
}
