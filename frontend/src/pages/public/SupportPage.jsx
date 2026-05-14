import React from 'react'
import { Link } from 'react-router-dom'
export default function SupportPage() {
  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 24px' }}>
      <Link to="/" className="btn btn-sm" style={{ marginBottom: '20px', display: 'inline-flex' }}>← الرئيسية</Link>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '20px' }}>الدعم الفني</h1>
      <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
        للتواصل مع فريق الدعم الفني يرجى مراسلتنا عبر البريد الإلكتروني الداخلي للوكالة.
        في حال نسيت كلمة المرور، تواصل مع مسؤول النظام لإعادة تعيينها.
      </p>
    </div>
  )
}
