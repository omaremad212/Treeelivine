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

/* ── Feature card ────────────────────────────────────────────────────── */
function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-2)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-6)',
      transition: 'box-shadow var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out)',
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-md)'
      ;(e.currentTarget as HTMLDivElement).style.borderColor = 'var(--brand-olive-200)'
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLDivElement).style.boxShadow = ''
      ;(e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-2)'
    }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 'var(--radius-md)',
        background: 'var(--brand-olive-50)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22, marginBottom: 'var(--space-4)',
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: 'var(--fs-base)', fontWeight: 'var(--fw-semibold)', color: 'var(--fg-1)', marginBottom: 'var(--space-2)' }}>{title}</h3>
      <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--fg-4)', lineHeight: 1.65 }}>{desc}</p>
    </div>
  )
}

/* ── Module badge ────────────────────────────────────────────────────── */
function ModuleBadge({ icon, name, desc }: { icon: string; name: string; desc: string }) {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-2)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-5)',
      textAlign: 'center',
      transition: 'border-color var(--dur-base) var(--ease-out)',
    }}
    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--brand-olive-300)'}
    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-2)'}
    >
      <div style={{ fontSize: 28, marginBottom: 'var(--space-2)' }}>{icon}</div>
      <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--fg-1)', marginBottom: 2 }}>{name}</div>
      <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-4)' }}>{desc}</div>
    </div>
  )
}

/* ── Testimonial card ────────────────────────────────────────────────── */
function TestimonialCard({ quote, name, role, initials }: { quote: string; name: string; role: string; initials: string }) {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-2)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-6)',
    }}>
      <div style={{ fontSize: 32, color: 'var(--brand-primary)', lineHeight: 1, marginBottom: 'var(--space-4)', opacity: 0.5 }}>"</div>
      <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--fg-3)', lineHeight: 1.7, marginBottom: 'var(--space-5)' }}>{quote}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <div style={{
          width: 38, height: 38, borderRadius: '50%',
          background: 'var(--brand-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 700, fontSize: 'var(--fs-sm)', flexShrink: 0,
        }}>{initials}</div>
        <div>
          <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--fg-1)' }}>{name}</div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-4)' }}>{role}</div>
        </div>
      </div>
    </div>
  )
}

/* ── FAQ item ────────────────────────────────────────────────────────── */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ border: '1px solid var(--border-2)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--bg-surface)' }}>
      <button
        onClick={() => setOpen(p => !p)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: 'var(--space-4) var(--space-5)',
          background: 'none', border: 'none', color: 'var(--fg-1)',
          fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)', cursor: 'pointer', textAlign: 'start',
          fontFamily: 'inherit', gap: 'var(--space-4)',
        }}
      >
        <span>{q}</span>
        <span style={{ color: 'var(--brand-primary)', fontSize: 18, fontWeight: 300, flexShrink: 0, transform: open ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>+</span>
      </button>
      {open && (
        <div style={{ padding: '0 var(--space-5) var(--space-4)', color: 'var(--fg-3)', fontSize: 'var(--fs-sm)', lineHeight: 1.7 }}>{a}</div>
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
    { icon: '👥', title: 'إدارة العملاء CRM', desc: 'تتبّع كل عميل من أول تواصل حتى إغلاق الصفقة، مع إدارة كاملة للحالة والأولوية والمسؤول.' },
    { icon: '📁', title: 'إدارة المشاريع', desc: 'أسند المشاريع، تابع التقدم، وشارك البريف مع العملاء مباشرةً من منصة واحدة.' },
    { icon: '✅', title: 'المهام والتسليمات', desc: 'نظام مهام مرن يربط الفريق بالمشاريع والعملاء، مع تتبع التقدم والمواعيد النهائية.' },
    { icon: '💳', title: 'الفواتير والمالية', desc: 'أنشئ فواتير احترافية، تتبّع المدفوعات، وراقب المصروفات والأرباح في لوحة مالية موحدة.' },
    { icon: '📊', title: 'تقارير وتحليلات', desc: 'لوحة مؤشرات حية توضح الإيرادات والأرباح والأداء — بأرقام حقيقية وفي الوقت الفعلي.' },
    { icon: '🔐', title: 'صلاحيات وأدوار', desc: 'تحكّم في وصول كل مستخدم بدقة — أدمن، مدير، فريق، عميل — مع صلاحيات تفصيلية لكل وحدة.' },
  ]

  const modules = [
    { icon: '📊', name: 'Dashboard', desc: 'لوحة التحكم' },
    { icon: '👥', name: 'CRM', desc: 'إدارة العملاء' },
    { icon: '📁', name: 'Projects', desc: 'المشاريع والبريف' },
    { icon: '✅', name: 'Tasks', desc: 'المهام والتسليم' },
    { icon: '🏢', name: 'Team', desc: 'الفريق والرواتب' },
    { icon: '💰', name: 'Finance', desc: 'الفواتير والمالية' },
    { icon: '📄', name: 'Templates', desc: 'قوالب جاهزة' },
    { icon: '⚙️', name: 'Settings', desc: 'الإعدادات' },
    { icon: '🌐', name: 'Client Portal', desc: 'بوابة العميل' },
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

  const sectionStyle: React.CSSProperties = { padding: 'clamp(56px, 8vw, 96px) clamp(16px, 5vw, 24px)', position: 'relative' }
  const containerStyle: React.CSSProperties = { maxWidth: 1200, margin: '0 auto' }
  const sectionLabelStyle: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--brand-primary)', marginBottom: 'var(--space-4)' }

  return (
    <div style={{ background: 'var(--bg-app)', color: 'var(--fg-2)', minHeight: '100vh', direction: 'rtl', overflowX: 'hidden' }}>
      <style>{`
        html { scroll-behavior: smooth; }
        .landing-nav-link { color: var(--fg-3); font-size: 14px; padding: 6px 12px; border-radius: 8px; text-decoration: none; transition: color 0.15s; }
        .landing-nav-link:hover { color: var(--fg-1); text-decoration: none; }
        .btn-hero-primary { display: inline-flex; align-items: center; gap: 6px; padding: 12px 24px; background: var(--brand-primary); color: white; border-radius: var(--radius-md); font-size: 15px; font-weight: 600; border: none; cursor: pointer; transition: background 0.15s, box-shadow 0.15s; text-decoration: none; font-family: inherit; }
        .btn-hero-primary:hover { background: var(--brand-primary-hover); box-shadow: 0 4px 16px rgba(79,104,49,0.28); text-decoration: none; color: white; }
        .btn-hero-secondary { display: inline-flex; align-items: center; gap: 6px; padding: 12px 24px; background: var(--bg-surface); color: var(--fg-1); border-radius: var(--radius-md); font-size: 15px; font-weight: 500; border: 1px solid var(--border-2); cursor: pointer; transition: background 0.15s, border-color 0.15s; text-decoration: none; font-family: inherit; }
        .btn-hero-secondary:hover { background: var(--bg-surface-2); border-color: var(--border-3); text-decoration: none; color: var(--fg-1); }
        .btn-hero-ghost { display: inline-flex; align-items: center; gap: 6px; padding: 12px 24px; background: transparent; color: var(--fg-2); border-radius: var(--radius-md); font-size: 15px; font-weight: 500; border: 1px solid var(--border-1); cursor: pointer; transition: background 0.15s; text-decoration: none; font-family: inherit; }
        .btn-hero-ghost:hover { background: var(--bg-hover); text-decoration: none; color: var(--fg-1); }
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
        background: navScrolled ? 'var(--bg-surface)' : 'transparent',
        borderBottom: navScrolled ? '1px solid var(--border-1)' : '1px solid transparent',
        backdropFilter: navScrolled ? 'blur(12px)' : 'none',
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'var(--brand-primary)' }}>
          <BrandMark size={24} />
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--fg-1)', letterSpacing: '-0.01em' }}>treeelivine</span>
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
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '4px 14px', borderRadius: 999, background: 'var(--status-active-bg)', border: '1px solid var(--brand-olive-100)', marginBottom: 'var(--space-6)' }}>
            <span className="animate-pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success-500)', display: 'inline-block' }} />
            <span style={{ fontSize: 12, color: 'var(--success-700)', fontWeight: 500 }}>النظام يعمل الآن — جرّب بدون تسجيل</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-16)', alignItems: 'center' }} className="hero-grid">
            {/* Left: copy */}
            <div>
              <h1 style={{ fontSize: 'clamp(28px, 4.5vw, 52px)', fontWeight: 800, lineHeight: 1.15, color: 'var(--fg-1)', letterSpacing: '-0.02em', marginBottom: 'var(--space-5)' }}>
                شغّل شركتك بالكامل<br />
                <span style={{ color: 'var(--brand-primary)' }}>من منصة ERP واحدة</span>
              </h1>
              <p style={{ fontSize: 'clamp(14px, 1.8vw, 17px)', color: 'var(--fg-3)', lineHeight: 1.75, marginBottom: 'var(--space-8)', maxWidth: 520 }}>
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
              <p style={{ fontSize: 12, color: 'var(--fg-5)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ color: 'var(--success-500)' }}>✓</span>
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
      <div style={{ borderTop: '1px solid var(--border-1)' }} />

      {/* ══════════════════════════════════════
          STATS STRIP
      ══════════════════════════════════════ */}
      <section style={{ padding: 'var(--space-10) clamp(16px, 5vw, 24px)', background: 'var(--bg-surface)' }}>
        <div style={{ ...containerStyle, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-6)', textAlign: 'center' }} className="stats-grid">
          {stats.map((stat, i) => (
            <div key={i} style={{ padding: 'var(--space-2) 0' }}>
              <div style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, color: 'var(--brand-primary)', fontVariantNumeric: 'tabular-nums', marginBottom: 'var(--space-1)' }}>{stat.value}</div>
              <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-4)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ borderTop: '1px solid var(--border-1)' }} />

      {/* ══════════════════════════════════════
          FEATURES
      ══════════════════════════════════════ */}
      <section id="features" style={sectionStyle}>
        <div style={containerStyle}>
          <div style={{ marginBottom: 'var(--space-12)' }}>
            <div style={sectionLabelStyle}>المميزات</div>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 700, color: 'var(--fg-1)', marginBottom: 'var(--space-3)', letterSpacing: '-0.01em' }}>
              كل ما تحتاجه لإدارة شركتك
            </h2>
            <p style={{ fontSize: 'var(--fs-base)', color: 'var(--fg-3)', maxWidth: 560, lineHeight: 1.7 }}>
              منصة متكاملة تجمع كل أدوات إدارة الأعمال في مكان واحد، مصممة خصيصاً لوكالات التسويق والشركات الخدمية.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-4)' }} className="features-grid">
            {features.map((f, i) => <FeatureCard key={i} {...f} />)}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          MODULES
      ══════════════════════════════════════ */}
      <section id="modules" style={{ ...sectionStyle, background: 'var(--bg-surface)' }}>
        <div style={{ borderTop: '1px solid var(--border-1)', borderBottom: '1px solid var(--border-1)', position: 'absolute', inset: 0, pointerEvents: 'none' }} />
        <div style={containerStyle}>
          <div style={{ marginBottom: 'var(--space-12)' }}>
            <div style={sectionLabelStyle}>الوحدات</div>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 700, color: 'var(--fg-1)', marginBottom: 'var(--space-3)', letterSpacing: '-0.01em' }}>
              نظام متكامل من 9 وحدات
            </h2>
            <p style={{ fontSize: 'var(--fs-base)', color: 'var(--fg-3)', maxWidth: 560, lineHeight: 1.7 }}>
              كل وحدة مصممة لتحل مشكلة محددة وتتكامل مع باقي الوحدات لتجربة سلسة من البداية للنهاية.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 'var(--space-3)' }} className="modules-grid">
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
            gap: 'var(--space-12)',
            alignItems: 'center',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-2)',
            borderRadius: 'var(--radius-xl)',
            padding: 'clamp(28px, 5vw, 56px)',
            position: 'relative',
            overflow: 'hidden',
          }} className="demo-grid">
            {/* Olive accent blob */}
            <div style={{ position: 'absolute', top: -60, insetInlineEnd: -60, width: 240, height: 240, borderRadius: '50%', background: 'var(--brand-olive-50)', pointerEvents: 'none' }} />

            {/* Left: copy */}
            <div style={{ position: 'relative' }}>
              <div style={{ ...sectionLabelStyle, marginBottom: 'var(--space-3)' }}>⚡ جرّب الآن</div>
              <h2 style={{ fontSize: 'clamp(20px, 2.8vw, 30px)', fontWeight: 700, color: 'var(--fg-1)', marginBottom: 'var(--space-4)', lineHeight: 1.25, letterSpacing: '-0.01em' }}>
                جرّب Treeelivine ERP<br />بدون إنشاء حساب
              </h2>
              <p style={{ color: 'var(--fg-3)', lineHeight: 1.7, marginBottom: 'var(--space-6)', fontSize: 'var(--fs-sm)' }}>
                بيانات تجريبية كاملة — عملاء، مشاريع، مهام، وفواتير — جاهزة فوراً.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                <button onClick={handleDemo} disabled={demoLoading} className="btn-hero-primary" style={{ opacity: demoLoading ? 0.7 : 1 }}>
                  {demoLoading ? '⏳ جاري الفتح...' : '🚀 ابدأ الديمو الآن'}
                </button>
                <Link href="/register" className="btn-hero-secondary">إنشاء حساب</Link>
              </div>
            </div>

            {/* Right: demo credentials */}
            <div style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-1)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', position: 'relative' }}>
              <div style={{ ...sectionLabelStyle, marginBottom: 'var(--space-4)' }}>بيانات الدخول التجريبية</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
                {[
                  { label: 'البريد الإلكتروني', value: 'demo@treeelivine.com' },
                  { label: 'كلمة المرور', value: 'demo1234' },
                  { label: 'الدور', value: 'Admin — صلاحيات كاملة' },
                ].map((row, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-2) var(--space-3)', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--fs-sm)' }}>
                    <span style={{ color: 'var(--fg-4)' }}>{row.label}</span>
                    <span style={{ color: 'var(--fg-1)', fontWeight: 600, direction: 'ltr', fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)' }}>{row.value}</span>
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
      <section style={{ ...sectionStyle, background: 'var(--bg-surface)' }}>
        <div style={{ borderTop: '1px solid var(--border-1)', borderBottom: '1px solid var(--border-1)', position: 'absolute', inset: 0, pointerEvents: 'none' }} />
        <div style={containerStyle}>
          <div style={{ marginBottom: 'var(--space-10)' }}>
            <div style={sectionLabelStyle}>آراء العملاء</div>
            <h2 style={{ fontSize: 'clamp(20px, 2.8vw, 30px)', fontWeight: 700, color: 'var(--fg-1)', letterSpacing: '-0.01em' }}>ماذا يقول مستخدمونا</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-4)' }} className="testimonials-grid">
            {testimonials.map((t, i) => <TestimonialCard key={i} {...t} />)}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FAQ
      ══════════════════════════════════════ */}
      <section id="faq" style={sectionStyle}>
        <div style={containerStyle}>
          <div style={{ marginBottom: 'var(--space-10)' }}>
            <div style={sectionLabelStyle}>الأسئلة الشائعة</div>
            <h2 style={{ fontSize: 'clamp(20px, 2.8vw, 30px)', fontWeight: 700, color: 'var(--fg-1)', letterSpacing: '-0.01em' }}>أجوبة على أكثر الأسئلة شيوعاً</h2>
          </div>
          <div style={{ maxWidth: 680, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {faqs.map((faq, i) => <FAQItem key={i} {...faq} />)}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════ */}
      <section style={{ ...sectionStyle, background: 'var(--brand-olive-600)' }}>
        <svg viewBox="0 0 600 300" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06, pointerEvents: 'none' }} fill="white" preserveAspectRatio="xMidYMid slice">
          <path d="M 60 200 C 180 60, 380 80, 540 180 C 380 165, 250 175, 160 240 C 130 225, 90 218, 60 200 Z" />
          <path d="M 80 200 C 200 130, 340 140, 500 185" fill="none" stroke="white" strokeWidth="3" />
        </svg>
        <div style={{ ...containerStyle, textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'inline-block', padding: '4px 16px', borderRadius: 999, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', fontSize: 12, color: 'white', fontWeight: 500, marginBottom: 'var(--space-5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            ابدأ الآن
          </div>
          <h2 style={{ fontSize: 'clamp(22px, 4vw, 40px)', fontWeight: 800, color: 'white', marginBottom: 'var(--space-4)', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
            جاهز لإدارة شركتك بذكاء؟
          </h2>
          <p style={{ fontSize: 'clamp(14px, 1.8vw, 17px)', color: 'rgba(255,255,255,0.75)', maxWidth: 480, margin: '0 auto var(--space-8)', lineHeight: 1.7 }}>
            انضم إلى المئات من الشركات التي تستخدم Treeelivine ERP لتبسيط عملياتها وزيادة إنتاجيتها.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={handleDemo}
              disabled={demoLoading}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, padding: '13px 28px',
                background: 'white', color: 'var(--brand-primary)',
                borderRadius: 'var(--radius-md)', fontSize: 15, fontWeight: 700,
                border: 'none', cursor: 'pointer', opacity: demoLoading ? 0.7 : 1,
                transition: 'opacity 0.15s', fontFamily: 'inherit',
              }}
            >
              {demoLoading ? '⏳ ...' : '🚀 جرّب الديمو'}
            </button>
            <Link href="/register" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '13px 28px',
              background: 'rgba(255,255,255,0.15)', color: 'white',
              borderRadius: 'var(--radius-md)', fontSize: 15, fontWeight: 600,
              border: '1px solid rgba(255,255,255,0.35)', textDecoration: 'none',
              transition: 'background 0.15s',
            }}>
              إنشاء حساب
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer style={{ borderTop: '1px solid var(--border-1)', padding: 'var(--space-10) clamp(16px, 5vw, 24px) var(--space-8)', background: 'var(--bg-surface)' }}>
        <div style={containerStyle}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 'var(--space-8)', marginBottom: 'var(--space-8)' }} className="footer-grid">
            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-4)', color: 'var(--brand-primary)' }}>
                <BrandMark size={22} />
                <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--fg-1)', letterSpacing: '-0.01em' }}>treeelivine</span>
              </div>
              <p style={{ color: 'var(--fg-4)', fontSize: 'var(--fs-sm)', lineHeight: 1.7, maxWidth: 220 }}>
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
                <p style={{ fontWeight: 600, fontSize: 'var(--fs-xs)', color: 'var(--fg-3)', marginBottom: 'var(--space-4)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)' }}>{col.title}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {col.links.map((link, j) => (
                    <a key={j} href={link.href} className="landing-nav-link" style={{ padding: 0 }}>{link.label}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: '1px solid var(--border-1)', paddingTop: 'var(--space-5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
            <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-5)' }}>© {new Date().getFullYear()} treeelivine ERP. جميع الحقوق محفوظة.</p>
            <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
              {[{ label: 'سياسة الخصوصية', href: '/privacy' }, { label: 'الشروط والأحكام', href: '/terms' }].map((link, i) => (
                <a key={i} href={link.href} style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-5)', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--fg-3)'}
                  onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--fg-5)'}
                >{link.label}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
