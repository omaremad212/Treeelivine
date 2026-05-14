import React from 'react'
import { Link } from 'react-router-dom'
export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 24px' }}>
      <Link to="/" className="btn btn-sm" style={{ marginBottom: '20px', display: 'inline-flex' }}>← الرئيسية</Link>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '20px' }}>سياسة الخصوصية</h1>
      <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
        نظام Treeelivine ERP يحترم خصوصية المستخدمين. البيانات المدخلة في النظام تُستخدم فقط لأغراض التشغيل الداخلي للوكالة ولا تُشارك مع أطراف خارجية.
        يتم حفظ البيانات في قاعدة بيانات آمنة ويتم الوصول إليها فقط من قبل المخولين.
      </p>
    </div>
  )
}
