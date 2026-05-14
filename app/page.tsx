'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

/* ── Brand SVG ───────────────────────────────────────────────────────── */
function BrandMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="currentColor">
      <path d="M32 12 C 32 28, 32 44, 32 56" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M32 22 C 24 21, 16 17, 12 11 C 18 12, 26 16, 32 22 Z" />
      <path d="M32 30 C 40 30, 48 27, 52 21 C 46 22, 38 25, 32 30 Z" />
      <path d="M32 40 C 26 41, 20 39, 16 34 C 21 35, 27 36, 32 40 Z" />
      <ellipse cx="36" cy="48" rx="3.2" ry="4.2" transform="rotate(20 36 48)" />
    </svg>
  )
}

/* ── Dashboard Mockup ────────────────────────────────────────────────── */
function DashboardMockup() {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-2)',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-xl)',
      fontFamily: 'var(--font-sans)',
    }}>
      {/* Topbar */}
      <div style={{ background: 'var(--bg-surface-2)', borderBottom: '1px solid var(--border-1)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ display: 'flex', gap: 5 }}>
          {['#c0392b', '#c98b15', '#2f8a3e'].map(c => (
            <div key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c, opacity: 0.8 }} />
          ))}
        </div>
        <div style={{ flex: 1, background: 'var(--border-1)', borderRadius: 5, height: 20, maxWidth: 220 }} />
        <div className="av av-md" style={{ fontSize: 9 }}>سع</div>
      </div>

      <div style={{ display: 'flex', height: 360 }}>
        {/* Mini sidebar */}
        <div style={{ width: 52, background: 'var(--bg-surface)', borderInlineEnd: '1px solid var(--border-1)', padding: '12px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          {[
            { color: 'var(--brand-primary)', active: true },
            ...Array(5).fill({ color: 'var(--fg-5)', active: false }),
          ].map((item, i) => (
            <div key={i} style={{
              width: 32, height: 28, borderRadius: 6,
              background: item.active ? 'var(--bg-selected)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ width: 14, height: 14, borderRadius: 3, background: item.active ? 'var(--brand-primary)' : 'var(--border-2)', opacity: item.active ? 1 : 0.6 }} />
            </div>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '14px 14px', overflow: 'hidden', background: 'var(--bg-app)' }}>
          {/* KPI Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 12 }}>
            {[
              { label: 'العملاء', value: '284', accent: 'var(--brand-primary)' },
              { label: 'المشاريع', value: '47', accent: 'var(--info-500)' },
              { label: 'الإيرادات', value: '182K', accent: 'var(--brand-clay-500)' },
              { label: 'المهام', value: '1,204', accent: 'var(--success-500)' },
            ].map((kpi, i) => (
              <div key={i} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-2)', borderRadius: 8, padding: '8px 10px' }}>
                <div style={{ fontSize: 9, color: 'var(--fg-4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{kpi.label}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: kpi.accent, fontVariantNumeric: 'tabular-nums' }}>{kpi.value}</div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 8, marginBottom: 10 }}>
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-2)', borderRadius: 8, padding: '10px 12px' }}>
              <div style={{ fontSize: 9, color: 'var(--fg-4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>الإيرادات — آخر 6 أشهر</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 60 }}>
                {[35, 55, 42, 72, 55, 90].map((h, i) => (
                  <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: '2px 2px 0 0', background: i === 5 ? 'var(--brand-primary)' : 'var(--brand-olive-100)' }} />
                ))}
              </div>
            </div>
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-2)', borderRadius: 8, padding: '10px 12px' }}>
              <div style={{ fontSize: 9, color: 'var(--fg-4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>CRM Pipeline</div>
              {[
                { label: 'عملاء جدد', pct: 72, color: 'var(--brand-primary)' },
                { label: 'في التفاوض', pct: 48, color: 'var(--info-500)' },
                { label: 'مكتملون', pct: 64, color: 'var(--success-500)' },
              ].map((row, i) => (
                <div key={i} style={{ marginBottom: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                    <span style={{ fontSize: 9, color: 'var(--fg-4)' }}>{row.label}</span>
                    <span style={{ fontSize: 9, color: row.color, fontWeight: 600 }}>{row.pct}%</span>
                  </div>
                  <div style={{ height: 4, background: 'var(--border-1)', borderRadius: 2 }}>
                    <div style={{ width: `${row.pct}%`, height: '100%', background: row.color, borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tasks table */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-2)', borderRadius: 8, padding: '10px 12px' }}>
            <div style={{ fontSize: 9, color: 'var(--fg-4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>المهام الأخيرة</div>
            {[
              { title: 'تصميم هوية بصرية — نور ميديا', status: 'نشط', color: 'var(--status-active-fg)', bg: 'var(--status-active-bg)' },
              { title: 'مراجعة عرض السعر — أكاديمية رواد', status: 'معلّق', color: 'var(--status-pending-fg)', bg: 'var(--status-pending-bg)' },
              { title: 'تسليم تقرير SEO — سحاب تك', status: 'مكتمل', color: 'var(--status-completed-fg)', bg: 'var(--status-completed-bg)' },
            ].map((t, i, arr) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--border-1)' : 'none' }}>
                <span style={{ fontSize: 9, color: 'var(--fg-2)', flex: 1 }}>{t.title}</span>
                <span style={{ fontSize: 8, color: t.color, background: t.bg, padding: '1px 5px', borderRadius: 4, fontWeight: 600 }}>{t.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Clean SVG icons (Lucide line style) ─────────────────────────────── */
function Ico({ d, size = 22 }: { d: string | string[]; size?: number }) {
  const paths = Array.isArray(d) ? d : [d]
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      {paths.map((p, i) => <path key={i} d={p} />)}
    </svg>
  )
}
const FeatureIcons: Record<string, React.ReactNode> = {
  crm:      <Ico d={['M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2','M23 21v-2a4 4 0 00-3-3.87','M16 3.13a4 4 0 010 7.75','M9 11a4 4 0 100-8 4 4 0 000 8z']} />,
  projects: <Ico d={['M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z']} />,
  tasks:    <Ico d={['M9 11l3 3L22 4','M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11']} />,
  finance:  <Ico d={['M12 2v20','M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6']} />,
  analytics:<Ico d={['M3 3v18h18','M18 9l-5 5-2-2-4 4']} />,
  roles:    <Ico d={['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z']} />,
}
const ModuleIcons: Record<string, React.ReactNode> = {
  dashboard: <Ico size={20} d={['M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z','M9 22V12h6v10']} />,
  crm:       <Ico size={20} d={['M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2','M9 11a4 4 0 100-8 4 4 0 000 8z']} />,
  projects:  <Ico size={20} d={['M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z']} />,
  tasks:     <Ico size={20} d={['M9 11l3 3L22 4','M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11']} />,
  team:      <Ico size={20} d={['M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2','M23 21v-2a4 4 0 00-3-3.87','M16 3.13a4 4 0 010 7.75','M9 11a4 4 0 100-8 4 4 0 000 8z']} />,
  finance:   <Ico size={20} d={['M20 12V22H4V12','M22 7H2v5h20V7z','M12 22V7','M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z','M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z']} />,
  templates: <Ico size={20} d={['M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z','M14 2v6h6','M16 13H8M16 17H8M10 9H8']} />,
  settings:  <Ico size={20} d={['M12 15a3 3 0 100-6 3 3 0 000 6z','M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z']} />,
  portal:    <Ico size={20} d={['M12 2a10 10 0 100 20A10 10 0 0012 2z','M2 12h20','M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z']} />,
}

/* ── Feature card ────────────────────────────────────────────────────── */
function FeatureCard({ iconKey, title, desc }: { iconKey: string; title: string; desc: string }) {
  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e6e2d9',
      borderRadius: '12px',
      padding: '24px',
      transition: 'box-shadow 180ms ease, border-color 180ms ease',
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 12px rgba(23,22,19,0.06)'
      ;(e.currentTarget as HTMLDivElement).style.borderColor = '#c9d6ac'
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLDivElement).style.boxShadow = ''
      ;(e.currentTarget as HTMLDivElement).style.borderColor = '#e6e2d9'
    }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: '8px',
        background: '#f3f6ee',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#4f6831', marginBottom: '16px', flexShrink: 0,
      }}>
        {FeatureIcons[iconKey]}
      </div>
      <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#292723', marginBottom: '8px' }}>{title}</h3>
      <p style={{ fontSize: '13px', color: '#75705f', lineHeight: 1.65 }}>{desc}</p>
    </div>
  )
}

/* ── Module badge ────────────────────────────────────────────────────── */
function ModuleBadge({ iconKey, name, desc }: { iconKey: string; name: string; desc: string }) {
  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e6e2d9',
      borderRadius: '12px',
      padding: '20px',
      textAlign: 'center',
      transition: 'border-color 180ms ease',
    }}
    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = '#a9bd80'}
    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = '#e6e2d9'}
    >
      <div style={{ color: '#4f6831', display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
        {ModuleIcons[iconKey]}
      </div>
      <div style={{ fontSize: '13px', fontWeight: 600, color: '#292723', marginBottom: 2 }}>{name}</div>
      <div style={{ fontSize: '11px', color: '#75705f' }}>{desc}</div>
    </div>
  )
}

/* ── Testimonial card ────────────────────────────────────────────────── */
function TestimonialCard({ quote, name, role, initials }: { quote: string; name: string; role: string; initials: string }) {
  return (
    <div style={{ background: '#ffffff', border: '1px solid #e6e2d9', borderRadius: '12px', padding: '24px' }}>
      <div style={{ fontSize: 32, color: '#4f6831', lineHeight: 1, marginBottom: '16px', opacity: 0.4 }}>"</div>
      <p style={{ fontSize: '13px', color: '#57534a', lineHeight: 1.7, marginBottom: '20px' }}>{quote}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#4f6831', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '13px', flexShrink: 0 }}>{initials}</div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#292723' }}>{name}</div>
          <div style={{ fontSize: '11px', color: '#75705f' }}>{role}</div>
        </div>
      </div>
    </div>
  )
}

/* ── FAQ item ────────────────────────────────────────────────────────── */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ border: '1px solid #e6e2d9', borderRadius: '8px', overflow: 'hidden', background: '#ffffff' }}>
      <button
        onClick={() => setOpen(p => !p)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', background: 'none', border: 'none', color: '#292723',
          fontSize: '13px', fontWeight: 500, cursor: 'pointer', textAlign: 'start',
          fontFamily: 'inherit', gap: '16px',
        }}
      >
        <span>{q}</span>
        <span style={{ color: '#4f6831', fontSize: 18, fontWeight: 300, flexShrink: 0, transform: open ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>+</span>
      </button>
      {open && (
        <div style={{ padding: '0 20px 16px', color: '#57534a', fontSize: '13px', lineHeight: 1.7 }}>{a}</div>
      )}
    </div>
  )
}

/* ── Main landing page ───────────────────────────────────────────────── */
export default function LandingPage() {
  const router = useRouter()
  const [demoLoading, setDemoLoading] = useState(false)
  const [navScrolled, setNavScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  async function handleDemo() {
    setDemoLoading(true)
    try {
      const res = await fetch('/api/seed', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        router.push('/app')
      } else {
        alert('تعذّر تشغيل الديمو. تأكد من اتصال قاعدة البيانات.')
        setDemoLoading(false)
      }
    } catch {
      alert('تعذّر تشغيل الديمو.')
      setDemoLoading(false)
    }
  }

  const features = [
    { iconKey: 'crm',      title: 'إدارة العملاء CRM', desc: 'تتبّع كل عميل من أول تواصل حتى إغلاق الصفقة، مع إدارة كاملة للحالة والأولوية والمسؤول.' },
    { iconKey: 'projects', title: 'إدارة المشاريع', desc: 'أسند المشاريع، تابع التقدم، وشارك البريف مع العملاء مباشرةً من منصة واحدة.' },
    { iconKey: 'tasks',    title: 'المهام والتسليمات', desc: 'نظام مهام مرن يربط الفريق بالمشاريع والعملاء، مع تتبع التقدم والمواعيد النهائية.' },
    { iconKey: 'finance',  title: 'الفواتير والمالية', desc: 'أنشئ فواتير احترافية، تتبّع المدفوعات، وراقب المصروفات والأرباح في لوحة مالية موحدة.' },
    { iconKey: 'analytics',title: 'تقارير وتحليلات', desc: 'لوحة مؤشرات حية توضح الإيرادات والأرباح والأداء — بأرقام حقيقية وفي الوقت الفعلي.' },
    { iconKey: 'roles',    title: 'صلاحيات وأدوار', desc: 'تحكّم في وصول كل مستخدم بدقة — أدمن، مدير، فريق، عميل — مع صلاحيات تفصيلية لكل وحدة.' },
  ]

  const modules = [
    { iconKey: 'dashboard', name: 'Dashboard', desc: 'لوحة التحكم' },
    { iconKey: 'crm',       name: 'CRM', desc: 'إدارة العملاء' },
    { iconKey: 'projects',  name: 'Projects', desc: 'المشاريع والبريف' },
    { iconKey: 'tasks',     name: 'Tasks', desc: 'المهام والتسليم' },
    { iconKey: 'team',      name: 'Team', desc: 'الفريق والرواتب' },
    { iconKey: 'finance',   name: 'Finance', desc: 'الفواتير والمالية' },
    { iconKey: 'templates', name: 'Templates', desc: 'قوالب جاهزة' },
    { iconKey: 'settings',  name: 'Settings', desc: 'الإعدادات' },
    { iconKey: 'portal',    name: 'Client Portal', desc: 'بوابة العميل' },
  ]

  const stats = [
    { value: '500+', label: 'عميل تمت إدارته' },
    { value: '12,000+', label: 'مهمة تم تتبعها' },
    { value: '99%', label: 'نسبة التشغيل' },
    { value: '24/7', label: 'وصول بلا انقطاع' },
  ]

  const testimonials = [
    { quote: 'Treeelivine غيّر طريقة إدارتنا للفريق. الآن كل شيء في مكان واحد ولا يفوتنا شيء.', name: 'أحمد الزهراني', role: 'مدير وكالة تسويق', initials: 'أز' },
    { quote: 'بوابة العميل رائعة! يقدر عملاؤنا يتابعون مشاريعهم ويوافقون على البريف مباشرةً.', name: 'سارة العمري', role: 'CEO — إبداع الرقمي', initials: 'سع' },
    { quote: 'الفواتير والمصروفات أصبحت سهلة جداً. وفّرنا ساعات من العمل اليدوي كل أسبوع.', name: 'فهد المطيري', role: 'مدير مالي', initials: 'فم' },
  ]

  const faqs = [
    { q: 'هل يمكن تجربة النظام قبل إنشاء حساب؟', a: 'نعم! اضغط على "جرّب الديمو" وسيتم إنشاء بيانات تجريبية كاملة وتسجيل دخولك تلقائياً بدون أي خطوات إضافية.' },
    { q: 'هل يعمل النظام على الموبايل؟', a: 'نعم، النظام مصمم بشكل متجاوب يعمل على جميع الأجهزة — سطح المكتب والتابلت والموبايل.' },
    { q: 'ما الوحدات المتوفرة في النظام؟', a: 'يضم النظام 9 وحدات: لوحة تحكم، CRM، مشاريع، مهام، فريق، مالية، قوالب، إعدادات، وبوابة عميل.' },
    { q: 'هل يوجد بوابة للعميل؟', a: 'نعم! يمكن لعملائك الوصول لبوابة خاصة لمتابعة المشاريع، والموافقة على البريف، وعرض الفواتير.' },
    { q: 'هل النظام مصمم للعربية؟', a: 'نعم، النظام عربي-أول مع دعم كامل للغة الإنجليزية، مع تصميم RTL أصيل وليس مجرد ترجمة.' },
  ]

  /* Light-mode explicit values — landing page is always light regardless of user theme */
  const L = {
    bg:       '#faf7f1',
    surface:  '#ffffff',
    border:   '#e6e2d9',
    border2:  '#d8d3c7',
    fg1:      '#292723',
    fg2:      '#3e3b34',
    fg3:      '#57534a',
    fg4:      '#75705f',
    fg5:      '#98927f',
    olive:    '#4f6831',
    oliveL:   '#f3f6ee',
    olive2:   '#e4ebd5',
    navBg:    'rgba(255,255,255,0.92)',
  }

  const sectionStyle: React.CSSProperties = { padding: 'clamp(56px, 8vw, 96px) clamp(16px, 5vw, 24px)', position: 'relative' }
  const containerStyle: React.CSSProperties = { maxWidth: 1200, margin: '0 auto' }
  const sectionLabelStyle: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: L.olive, marginBottom: '16px' }

  return (
    <div style={{ background: L.bg, color: L.fg2, minHeight: '100vh', direction: 'rtl', overflowX: 'hidden' }}>
      <style>{`
        html { scroll-behavior: smooth; }
        .landing-nav-link { color: ${L.fg4}; font-size: 14px; padding: 6px 12px; border-radius: 8px; text-decoration: none; transition: color 0.15s; }
        .landing-nav-link:hover { color: ${L.fg1}; text-decoration: none; }
        .btn-hero-primary { display: inline-flex; align-items: center; gap: 6px; padding: 12px 24px; background: ${L.olive}; color: white; border-radius: 8px; font-size: 15px; font-weight: 600; border: none; cursor: pointer; transition: background 0.15s, box-shadow 0.15s; text-decoration: none; font-family: inherit; }
        .btn-hero-primary:hover { background: #3d5128; box-shadow: 0 4px 16px rgba(79,104,49,0.28); text-decoration: none; color: white; }
        .btn-hero-secondary { display: inline-flex; align-items: center; gap: 6px; padding: 12px 24px; background: ${L.surface}; color: ${L.fg1}; border-radius: 8px; font-size: 15px; font-weight: 500; border: 1px solid ${L.border}; cursor: pointer; transition: background 0.15s; text-decoration: none; font-family: inherit; }
        .btn-hero-secondary:hover { background: ${L.bg}; text-decoration: none; color: ${L.fg1}; }
        .btn-hero-ghost { display: inline-flex; align-items: center; gap: 6px; padding: 12px 24px; background: transparent; color: ${L.fg2}; border-radius: 8px; font-size: 15px; font-weight: 500; border: 1px solid ${L.border}; cursor: pointer; transition: background 0.15s; text-decoration: none; font-family: inherit; }
        .btn-hero-ghost:hover { background: rgba(79,104,49,0.06); text-decoration: none; color: ${L.fg1}; }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .modules-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .testimonials-grid { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .demo-grid { grid-template-columns: 1fr !important; }
          .nav-links-desktop { display: none !important; }
          .kpi-grid-mock { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      {/* ══════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════ */}
      <nav style={{
        position: 'fixed', top: 0, insetInline: 0, zIndex: 1000,
        height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(16px, 4vw, 40px)',
        transition: 'background 0.3s, border-bottom 0.3s, backdrop-filter 0.3s',
        background: navScrolled ? L.navBg : 'transparent',
        borderBottom: navScrolled ? `1px solid ${L.border}` : '1px solid transparent',
        backdropFilter: navScrolled ? 'blur(12px)' : 'none',
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: L.olive }}>
          <BrandMark size={24} />
          <span style={{ fontSize: 15, fontWeight: 600, color: L.fg1, letterSpacing: '-0.01em' }}>treeelivine</span>
        </Link>

        {/* Desktop nav links */}
        <div className="nav-links-desktop" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {[
            { label: 'المميزات', href: '#features' },
            { label: 'الوحدات', href: '#modules' },
            { label: 'الأسعار', href: '#pricing' },
            { label: 'FAQ', href: '#faq' },
          ].map(link => (
            <a key={link.href} href={link.href} className="landing-nav-link">{link.label}</a>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href="/login" className="landing-nav-link" style={{ display: 'inline-block' }}>تسجيل الدخول</Link>
          <Link href="/register" className="btn-hero-secondary" style={{ padding: '6px 14px', fontSize: 13 }}>إنشاء حساب</Link>
          <button
            onClick={handleDemo}
            disabled={demoLoading}
            className="btn-hero-primary"
            style={{ padding: '6px 14px', fontSize: 13, opacity: demoLoading ? 0.7 : 1 }}
          >
            {demoLoading ? '⏳' : '🚀'} {demoLoading ? '...' : 'جرّب الديمو'}
          </button>
        </div>
      </nav>

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section style={{ ...sectionStyle, paddingTop: 'clamp(96px, 14vw, 140px)', paddingBottom: 'clamp(56px, 8vw, 80px)' }}>
        <div style={containerStyle}>
          {/* Live badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '4px 14px', borderRadius: 999, background: '#ecf6ec', border: '1px solid #cfe8cf', marginBottom: '24px' }}>
            <span className="animate-pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#2f8a3e', display: 'inline-block' }} />
            <span style={{ fontSize: 12, color: '#1b5024', fontWeight: 500 }}>النظام يعمل الآن — جرّب بدون تسجيل</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }} className="hero-grid">
            {/* Left: copy */}
            <div>
              <h1 style={{ fontSize: 'clamp(28px, 4.5vw, 52px)', fontWeight: 800, lineHeight: 1.15, color: L.fg1, letterSpacing: '-0.02em', marginBottom: '20px' }}>
                شغّل شركتك بالكامل<br />
                <span style={{ color: L.olive }}>من منصة ERP واحدة</span>
              </h1>
              <p style={{ fontSize: 'clamp(14px, 1.8vw, 17px)', color: L.fg3, lineHeight: 1.75, marginBottom: '32px', maxWidth: 520 }}>
                Treeelivine ERP يساعد فرقك على إدارة العملاء، المشاريع، المهام، الفواتير، والمالية من لوحة تحكم واحدة مصممة لوكالات التسويق.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
                <button
                  onClick={handleDemo}
                  disabled={demoLoading}
                  className="btn-hero-primary"
                  style={{ opacity: demoLoading ? 0.7 : 1 }}
                >
                  {demoLoading ? '⏳ جاري التحضير...' : '🚀 جرّب الديمو مجاناً'}
                </button>
                <Link href="/register" className="btn-hero-secondary">إنشاء حساب</Link>
                <Link href="/login" className="btn-hero-ghost">تسجيل الدخول</Link>
              </div>
              <p style={{ fontSize: 12, color: L.fg5, display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ color: '#2f8a3e' }}>✓</span>
                تجربة كاملة بدون إنشاء حساب — لا بطاقة ائتمانية
              </p>
            </div>

            {/* Right: dashboard mockup */}
            <div className="animate-float">
              <DashboardMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ── Divider line ─── */}
      <div style={{ borderTop: `1px solid ${L.border}` }} />

      {/* ══════════════════════════════════════
          STATS STRIP
      ══════════════════════════════════════ */}
      <section style={{ padding: '40px clamp(16px, 5vw, 24px)', background: L.surface }}>
        <div style={{ ...containerStyle, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', textAlign: 'center' }} className="stats-grid">
          {stats.map((stat, i) => (
            <div key={i} style={{ padding: '8px 0' }}>
              <div style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, color: L.olive, fontVariantNumeric: 'tabular-nums', marginBottom: 4 }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: L.fg4 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ borderTop: `1px solid ${L.border}` }} />

      {/* ══════════════════════════════════════
          FEATURES
      ══════════════════════════════════════ */}
      <section id="features" style={sectionStyle}>
        <div style={containerStyle}>
          <div style={{ marginBottom: '48px' }}>
            <div style={sectionLabelStyle}>المميزات</div>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 700, color: L.fg1, marginBottom: '12px', letterSpacing: '-0.01em' }}>
              كل ما تحتاجه لإدارة شركتك
            </h2>
            <p style={{ fontSize: '14px', color: L.fg3, maxWidth: 560, lineHeight: 1.7 }}>
              منصة متكاملة تجمع كل أدوات إدارة الأعمال في مكان واحد، مصممة خصيصاً لوكالات التسويق والشركات الخدمية.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }} className="features-grid">
            {features.map((f, i) => <FeatureCard key={i} {...f} />)}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          MODULES
      ══════════════════════════════════════ */}
      <section id="modules" style={{ ...sectionStyle, background: L.surface, borderTop: `1px solid ${L.border}`, borderBottom: `1px solid ${L.border}` }}>
        <div style={containerStyle}>
          <div style={{ marginBottom: '48px' }}>
            <div style={sectionLabelStyle}>الوحدات</div>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 700, color: L.fg1, marginBottom: '12px', letterSpacing: '-0.01em' }}>
              نظام متكامل من 9 وحدات
            </h2>
            <p style={{ fontSize: '14px', color: L.fg3, maxWidth: 560, lineHeight: 1.7 }}>
              كل وحدة مصممة لتحل مشكلة محددة وتتكامل مع باقي الوحدات لتجربة سلسة من البداية للنهاية.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }} className="modules-grid">
            {modules.map((m, i) => <ModuleBadge key={i} {...m} />)}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          DEMO CTA SECTION
      ══════════════════════════════════════ */}
      <section id="pricing" style={sectionStyle}>
        <div style={containerStyle}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '48px',
            alignItems: 'center',
            background: L.surface,
            border: `1px solid ${L.border2}`,
            borderRadius: '16px',
            padding: 'clamp(28px, 5vw, 56px)',
            position: 'relative',
            overflow: 'hidden',
          }} className="demo-grid">
            {/* Olive accent blob */}
            <div style={{ position: 'absolute', top: -60, insetInlineEnd: -60, width: 240, height: 240, borderRadius: '50%', background: L.oliveL, pointerEvents: 'none' }} />

            {/* Left: copy */}
            <div style={{ position: 'relative' }}>
              <div style={{ ...sectionLabelStyle, marginBottom: '12px' }}>⚡ جرّب الآن</div>
              <h2 style={{ fontSize: 'clamp(20px, 2.8vw, 30px)', fontWeight: 700, color: L.fg1, marginBottom: '16px', lineHeight: 1.25, letterSpacing: '-0.01em' }}>
                جرّب Treeelivine ERP<br />بدون إنشاء حساب
              </h2>
              <p style={{ color: L.fg3, lineHeight: 1.7, marginBottom: '24px', fontSize: '13px' }}>
                بيانات تجريبية كاملة — عملاء، مشاريع، مهام، وفواتير — جاهزة فوراً.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                <button onClick={handleDemo} disabled={demoLoading} className="btn-hero-primary" style={{ opacity: demoLoading ? 0.7 : 1 }}>
                  {demoLoading ? '⏳ جاري الفتح...' : '🚀 ابدأ الديمو الآن'}
                </button>
                <Link href="/register" className="btn-hero-secondary">إنشاء حساب</Link>
              </div>
            </div>

            {/* Right: demo credentials */}
            <div style={{ background: L.bg, border: `1px solid ${L.border}`, borderRadius: '12px', padding: '20px', position: 'relative' }}>
              <div style={{ ...sectionLabelStyle, marginBottom: '16px' }}>بيانات الدخول التجريبية</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                {[
                  { label: 'البريد الإلكتروني', value: 'demo@treeelivine.com' },
                  { label: 'كلمة المرور', value: 'demo1234' },
                  { label: 'الدور', value: 'Admin — صلاحيات كاملة' },
                ].map((row, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: L.surface, borderRadius: '5px', fontSize: '13px' }}>
                    <span style={{ color: L.fg4 }}>{row.label}</span>
                    <span style={{ color: L.fg1, fontWeight: 600, direction: 'ltr', fontFamily: 'monospace', fontSize: '12px' }}>{row.value}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={handleDemo}
                disabled={demoLoading}
                className="btn-hero-primary"
                style={{ width: '100%', opacity: demoLoading ? 0.7 : 1 }}
              >
                {demoLoading ? 'جاري فتح الديمو...' : 'Open Demo →'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════ */}
      <section style={{ ...sectionStyle, background: L.surface, borderTop: `1px solid ${L.border}`, borderBottom: `1px solid ${L.border}` }}>
        <div style={containerStyle}>
          <div style={{ marginBottom: '40px' }}>
            <div style={sectionLabelStyle}>آراء العملاء</div>
            <h2 style={{ fontSize: 'clamp(20px, 2.8vw, 30px)', fontWeight: 700, color: L.fg1, letterSpacing: '-0.01em' }}>ماذا يقول مستخدمونا</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }} className="testimonials-grid">
            {testimonials.map((t, i) => <TestimonialCard key={i} {...t} />)}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FAQ
      ══════════════════════════════════════ */}
      <section id="faq" style={sectionStyle}>
        <div style={containerStyle}>
          <div style={{ marginBottom: '40px' }}>
            <div style={sectionLabelStyle}>الأسئلة الشائعة</div>
            <h2 style={{ fontSize: 'clamp(20px, 2.8vw, 30px)', fontWeight: 700, color: L.fg1, letterSpacing: '-0.01em' }}>أجوبة على أكثر الأسئلة شيوعاً</h2>
          </div>
          <div style={{ maxWidth: 680, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {faqs.map((faq, i) => <FAQItem key={i} {...faq} />)}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════ */}
      <section style={{ ...sectionStyle, background: '#4f6831' }}>
        <svg viewBox="0 0 600 300" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06, pointerEvents: 'none' }} fill="white" preserveAspectRatio="xMidYMid slice">
          <path d="M 60 200 C 180 60, 380 80, 540 180 C 380 165, 250 175, 160 240 C 130 225, 90 218, 60 200 Z" />
          <path d="M 80 200 C 200 130, 340 140, 500 185" fill="none" stroke="white" strokeWidth="3" />
        </svg>
        <div style={{ ...containerStyle, textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'inline-block', padding: '4px 16px', borderRadius: 999, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', fontSize: 12, color: 'white', fontWeight: 500, marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            ابدأ الآن
          </div>
          <h2 style={{ fontSize: 'clamp(22px, 4vw, 40px)', fontWeight: 800, color: 'white', marginBottom: '16px', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
            جاهز لإدارة شركتك بذكاء؟
          </h2>
          <p style={{ fontSize: 'clamp(14px, 1.8vw, 17px)', color: 'rgba(255,255,255,0.75)', maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.7 }}>
            انضم إلى المئات من الشركات التي تستخدم Treeelivine ERP لتبسيط عملياتها وزيادة إنتاجيتها.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={handleDemo}
              disabled={demoLoading}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, padding: '13px 28px',
                background: 'white', color: '#4f6831',
                borderRadius: '8px', fontSize: 15, fontWeight: 700,
                border: 'none', cursor: 'pointer', opacity: demoLoading ? 0.7 : 1,
                transition: 'opacity 0.15s', fontFamily: 'inherit',
              }}
            >
              {demoLoading ? '⏳ ...' : '🚀 جرّب الديمو'}
            </button>
            <Link href="/register" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '13px 28px',
              background: 'rgba(255,255,255,0.15)', color: 'white',
              borderRadius: '8px', fontSize: 15, fontWeight: 600,
              border: '1px solid rgba(255,255,255,0.35)', textDecoration: 'none',
            }}>
              إنشاء حساب
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer style={{ borderTop: `1px solid ${L.border}`, padding: '40px clamp(16px, 5vw, 24px) 32px', background: L.surface }}>
        <div style={containerStyle}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '32px', marginBottom: '32px' }} className="footer-grid">
            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '16px', color: L.olive }}>
                <BrandMark size={22} />
                <span style={{ fontSize: 15, fontWeight: 600, color: L.fg1, letterSpacing: '-0.01em' }}>treeelivine</span>
              </div>
              <p style={{ color: L.fg4, fontSize: '13px', lineHeight: 1.7, maxWidth: 220 }}>
                منصة ERP متكاملة لإدارة وكالات التسويق والشركات الخدمية.
              </p>
            </div>

            {/* Link columns */}
            {[
              { title: 'المنتج', links: [{ label: 'المميزات', href: '#features' }, { label: 'الوحدات', href: '#modules' }, { label: 'الأسعار', href: '#pricing' }, { label: 'FAQ', href: '#faq' }] },
              { title: 'الحساب', links: [{ label: 'تسجيل الدخول', href: '/login' }, { label: 'إنشاء حساب', href: '/register' }, { label: 'الديمو', href: '#pricing' }] },
              { title: 'الدعم', links: [{ label: 'سياسة الخصوصية', href: '/privacy' }, { label: 'الشروط والأحكام', href: '/terms' }, { label: 'الدعم الفني', href: '/support' }] },
            ].map((col, i) => (
              <div key={i}>
                <p style={{ fontWeight: 600, fontSize: '11px', color: L.fg3, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{col.title}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {col.links.map((link, j) => (
                    <a key={j} href={link.href} className="landing-nav-link" style={{ padding: 0 }}>{link.label}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: `1px solid ${L.border}`, paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <p style={{ fontSize: '12px', color: L.fg5 }}>© {new Date().getFullYear()} treeelivine ERP. جميع الحقوق محفوظة.</p>
            <div style={{ display: 'flex', gap: '16px' }}>
              {[{ label: 'سياسة الخصوصية', href: '/privacy' }, { label: 'الشروط والأحكام', href: '/terms' }].map((link, i) => (
                <a key={i} href={link.href} style={{ fontSize: '12px', color: L.fg5, textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = L.fg3}
                  onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = L.fg5}
                >{link.label}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
