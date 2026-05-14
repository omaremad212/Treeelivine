import React from 'react'
import { Link } from 'react-router-dom'
export default function TermsPage() {
  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 24px' }}>
      <Link to="/" className="btn btn-sm" style={{ marginBottom: '20px', display: 'inline-flex' }}>← الرئيسية</Link>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '20px' }}>شروط الاستخدام</h1>
      <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
        باستخدام نظام Treeelivine ERP توافق على استخدامه للأغراض المشروعة المتعلقة بتشغيل الوكالة فقط.
        يُمنع مشاركة بيانات الدخول مع أطراف خارجية. الإدارة تحتفظ بحق تعديل الصلاحيات وتعطيل الحسابات.
      </p>
    </div>
  )
}
