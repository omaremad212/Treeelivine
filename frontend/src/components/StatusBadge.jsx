import React from 'react'
import { useTranslation } from '../hooks/useTranslation'

const colorMap = {
  active: 'green', new: 'blue', in_progress: 'blue', prospect: 'blue',
  qualified: 'cyan', negotiation: 'yellow', draft: 'gray',
  completed: 'green', paid: 'green', approved: 'green', available: 'green',
  submitted: 'cyan', issued: 'cyan', reviewing: 'cyan',
  on_hold: 'yellow', suspended: 'yellow', partial: 'yellow',
  busy: 'yellow', changes_requested: 'yellow',
  inactive: 'gray', unassigned: 'gray', not_started: 'gray', viewer: 'gray',
  lost: 'red', cancelled: 'red', overdue: 'red', unavailable: 'red',
  handed_over: 'purple', under_review: 'purple', reopened: 'yellow',
  ready_for_handover: 'cyan', assigned: 'blue', urgent: 'red',
  high: 'red', medium: 'yellow', low: 'gray',
  partially_paid: 'yellow', unpaid: 'red', ready: 'green',
}

export default function StatusBadge({ status }) {
  const { t } = useTranslation()
  const color = colorMap[status] || 'gray'
  const label = t.status?.[status] || status
  return <span className={`badge badge-${color}`}>{label}</span>
}
