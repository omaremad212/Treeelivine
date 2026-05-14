import React from 'react'
import { Link } from 'react-router-dom'

const features = [
  { icon: '👥', title: 'إدارة العملاء (CRM)', desc: 'Pipeline كامل من العميل المحتمل حتى النشط مع سجل نشاط وتتبع تفصيلي' },
  { icon: '📁', title: 'المشاريع والبريف', desc: 'إدارة المشاريع مع workflow متسلسل ونظام بريف تفاعلي مع العميل' },
  { icon: '✅', title: 'إدارة المهام', desc: 'تتبع المهام والتسليم والمراجعة مع نظام handover وحساب كفاءة الأداء' },
  { icon: '💰', title: 'المالية الكاملة', desc: 'فواتير ومصروفات ورواتب مع دعم متعدد العملات ولقطات مالية دقيقة' },
  { icon: '🧑‍💼', title: 'إدارة الفريق', desc: 'ملفات الموظفين والأداء والإسناد الذكي بناءً على المهارات والتوفر' },
  { icon: '🔐', title: 'صلاحيات متقدمة', desc: 'نظام أدوار وصلاحيات مفصل مع إمكانية تخصيص صلاحيات كل مستخدم' },
]

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <nav style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>
          Tree<span style={{ color: 'var(--primary)' }}>elivine</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link to="/login" className="btn">تسجيل الدخول</Link>
          <Link to="/register" className="btn btn-primary">إنشاء حساب</Link>
        </div>
      </nav>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '80px 24px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px' }}>
            نظام ERP متكامل<br />
            <span style={{ color: 'var(--primary)' }}>لوكالات التسويق</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 32px' }}>
            مركز تشغيل موحد يجمع العملاء والمشاريع والمهام والمالية في مكان واحد.
            قل وداعًا للـ WhatsApp والـ Sheets المبعثرة.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/login" className="btn btn-primary" style={{ padding: '10px 28px', fontSize: '1rem' }}>ابدأ الآن</Link>
            <Link to="/register" className="btn" style={{ padding: '10px 28px', fontSize: '1rem' }}>إنشاء حساب عميل</Link>
          </div>
        </div>

        <div className="grid-3" style={{ gap: '20px', marginBottom: '60px' }}>
          {features.map((f, i) => (
            <div key={i} className="card card-body" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{f.icon}</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '.85rem', lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '.8rem', paddingTop: '24px', borderTop: '1px solid var(--border)', display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/privacy" style={{ color: 'var(--text-muted)' }}>سياسة الخصوصية</Link>
          <Link to="/terms" style={{ color: 'var(--text-muted)' }}>شروط الاستخدام</Link>
          <Link to="/support" style={{ color: 'var(--text-muted)' }}>الدعم الفني</Link>
          <span>© 2026 Treeelivine ERP</span>
        </div>
      </div>
    </div>
  )
}
