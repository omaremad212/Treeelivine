'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

/* ─────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────── */
const C = {
  bg:       '#07070f',
  surface:  '#0f0f1c',
  surface2: '#16162a',
  border:   '#252540',
  border2:  '#1e1e38',
  purple:   '#7c3aed',
  purpleL:  '#9d63ff',
  purpleD:  '#5b21b6',
  green:    '#10b981',
  greenL:   '#34d399',
  white:    '#f0f0ff',
  muted:    '#8888aa',
  muted2:   '#5a5a7a',
  danger:   '#ef4444',
}

const glow = (color = C.purple, opacity = 0.18) =>
  `0 0 60px ${color}${Math.round(opacity * 255).toString(16).padStart(2,'0')}`

/* ─────────────────────────────────────────
   REUSABLE MICRO-COMPONENTS
───────────────────────────────────────── */
function GradientBadge({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '0.3rem 1rem',
      borderRadius: 999,
      fontSize: '0.75rem',
      fontWeight: 700,
      letterSpacing: '0.08em',
      background: `linear-gradient(135deg, ${C.purpleD}33, ${C.green}22)`,
      border: `1px solid ${C.purple}44`,
      color: C.purpleL,
      marginBottom: '1.25rem',
    }}>
      {children}
    </span>
  )
}

function GlassCard({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: `linear-gradient(135deg, ${C.surface2}cc, ${C.surface}99)`,
      border: `1px solid ${C.border}`,
      borderRadius: 16,
      padding: '1.75rem',
      backdropFilter: 'blur(12px)',
      transition: 'transform 0.2s, border-color 0.2s, box-shadow 0.2s',
      ...style,
    }}>
      {children}
    </div>
  )
}

function BtnPrimary({ children, onClick, href, style = {} }: any) {
  const s: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
    padding: '0.8rem 2rem', borderRadius: 10,
    fontSize: '0.95rem', fontWeight: 700,
    background: `linear-gradient(135deg, ${C.purple}, ${C.purpleD})`,
    color: '#fff', border: 'none', cursor: 'pointer',
    boxShadow: glow(C.purple, 0.35),
    transition: 'all 0.2s',
    textDecoration: 'none',
    ...style,
  }
  if (href) return <Link href={href} style={s}>{children}</Link>
  return <button style={s} onClick={onClick}>{children}</button>
}

function BtnOutline({ children, onClick, href, style = {} }: any) {
  const s: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
    padding: '0.8rem 2rem', borderRadius: 10,
    fontSize: '0.95rem', fontWeight: 600,
    background: 'transparent',
    color: C.white, border: `1px solid ${C.border}`,
    cursor: 'pointer', transition: 'all 0.2s',
    textDecoration: 'none',
    ...style,
  }
  if (href) return <Link href={href} style={s}>{children}</Link>
  return <button style={s} onClick={onClick}>{children}</button>
}

function BtnGreen({ children, onClick, style = {} }: any) {
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
      padding: '0.8rem 2rem', borderRadius: 10,
      fontSize: '0.95rem', fontWeight: 700,
      background: `linear-gradient(135deg, ${C.green}, #047857)`,
      color: '#fff', border: 'none', cursor: 'pointer',
      boxShadow: glow(C.green, 0.3),
      transition: 'all 0.2s',
      ...style,
    }}>
      {children}
    </button>
  )
}

/* ─────────────────────────────────────────
   DASHBOARD MOCKUP
───────────────────────────────────────── */
function DashboardMockup() {
  return (
    <div style={{
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: 18,
      overflow: 'hidden',
      boxShadow: `${glow(C.purple, 0.25)}, 0 40px 80px #00000066`,
      fontFamily: 'system-ui, sans-serif',
    }}>
      {/* Topbar */}
      <div style={{ background: C.surface2, borderBottom: `1px solid ${C.border}`, padding: '0.7rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {['#ef4444','#f59e0b','#10b981'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
        </div>
        <div style={{ flex: 1, background: `${C.border}88`, borderRadius: 6, height: 24, maxWidth: 260 }} />
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: `linear-gradient(135deg,${C.purple},${C.green})` }} />
      </div>

      <div style={{ display: 'flex', height: 380 }}>
        {/* Sidebar */}
        <div style={{ width: 56, background: C.surface2, borderRight: `1px solid ${C.border}`, padding: '1rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          {['📊','👥','📁','✅','💰','⚙️'].map((icon, i) => (
            <div key={i} style={{
              width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem',
              background: i === 0 ? `${C.purple}33` : 'transparent',
              border: i === 0 ? `1px solid ${C.purple}44` : '1px solid transparent',
            }}>{icon}</div>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '1rem', overflow: 'hidden' }}>
          {/* KPI Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 10 }}>
            {[
              { label: 'العملاء', value: '284', color: C.purple, icon: '👥' },
              { label: 'المشاريع', value: '47', color: C.green, icon: '📁' },
              { label: 'الإيرادات', value: '182K', color: '#f59e0b', icon: '💰' },
              { label: 'المهام', value: '1,204', color: '#06b6d4', icon: '✅' },
            ].map((kpi, i) => (
              <div key={i} style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 10, padding: '0.6rem 0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: '0.6rem', color: C.muted }}>{kpi.label}</span>
                  <span style={{ fontSize: '0.75rem' }}>{kpi.icon}</span>
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: kpi.color }}>{kpi.value}</div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 8, marginBottom: 10 }}>
            {/* Revenue chart mockup */}
            <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 10, padding: '0.75rem' }}>
              <div style={{ fontSize: '0.65rem', color: C.muted, marginBottom: 8, fontWeight: 600 }}>الإيرادات — آخر 6 أشهر</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 70 }}>
                {[40, 65, 48, 80, 60, 95].map((h, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <div style={{
                      width: '100%', height: `${h}%`, borderRadius: '3px 3px 0 0',
                      background: i === 5
                        ? `linear-gradient(180deg,${C.purple},${C.purpleD})`
                        : `${C.purple}44`,
                    }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Pipeline */}
            <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 10, padding: '0.75rem' }}>
              <div style={{ fontSize: '0.65rem', color: C.muted, marginBottom: 8, fontWeight: 600 }}>CRM Pipeline</div>
              {[
                { label: 'عملاء جدد', pct: 75, color: C.purple },
                { label: 'في التفاوض', pct: 45, color: C.green },
                { label: 'مكتملون', pct: 60, color: '#f59e0b' },
              ].map((row, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: '0.58rem', color: C.muted }}>{row.label}</span>
                    <span style={{ fontSize: '0.58rem', color: row.color }}>{row.pct}%</span>
                  </div>
                  <div style={{ height: 5, background: C.border, borderRadius: 3 }}>
                    <div style={{ width: `${row.pct}%`, height: '100%', background: row.color, borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tasks table */}
          <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 10, padding: '0.75rem' }}>
            <div style={{ fontSize: '0.65rem', color: C.muted, marginBottom: 8, fontWeight: 600 }}>المهام الأخيرة</div>
            {[
              { title: 'تصميم هوية بصرية — نور ميديا', status: 'in_progress', color: '#06b6d4' },
              { title: 'مراجعة عرض السعر — أكاديمية رواد', status: 'pending', color: '#f59e0b' },
              { title: 'تسليم تقرير SEO — سحاب تك', status: 'completed', color: C.green },
            ].map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: i < 2 ? `1px solid ${C.border}` : 'none' }}>
                <span style={{ fontSize: '0.6rem', color: C.white }}>{t.title}</span>
                <span style={{ fontSize: '0.55rem', color: t.color, background: `${t.color}22`, padding: '0.1rem 0.4rem', borderRadius: 4 }}>{t.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   SECTION WRAPPER
───────────────────────────────────────── */
function Section({ children, id, style = {} }: { children: React.ReactNode; id?: string; style?: React.CSSProperties }) {
  return (
    <section id={id} style={{ padding: '6rem 1.5rem', position: 'relative', ...style }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>{children}</div>
    </section>
  )
}

function SectionHeader({ badge, title, sub }: { badge?: string; title: string; sub?: string }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
      {badge && <GradientBadge>{badge}</GradientBadge>}
      <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: C.white, marginBottom: '1rem', lineHeight: 1.3 }}>{title}</h2>
      {sub && <p style={{ fontSize: '1.05rem', color: C.muted, maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>{sub}</p>}
    </div>
  )
}

/* ─────────────────────────────────────────
   FAQ ITEM
───────────────────────────────────────── */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{
      background: C.surface2, border: `1px solid ${open ? C.purple + '55' : C.border}`,
      borderRadius: 12, overflow: 'hidden', transition: 'border-color 0.2s',
    }}>
      <button onClick={() => setOpen(p => !p)} style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.1rem 1.4rem', background: 'none', border: 'none', color: C.white,
        fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', textAlign: 'right',
      }}>
        <span style={{ color: open ? C.purpleL : C.muted, fontSize: '1.1rem', transition: 'transform 0.2s', transform: open ? 'rotate(45deg)' : 'none' }}>+</span>
        {q}
      </button>
      {open && (
        <div style={{ padding: '0 1.4rem 1.1rem', color: C.muted, fontSize: '0.9rem', lineHeight: 1.7 }}>{a}</div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function LandingPage() {
  const router = useRouter()
  const [demoLoading, setDemoLoading] = useState(false)
  const [navScrolled, setNavScrolled] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 30)
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
      }
    } catch {
      alert('تعذّر تشغيل الديمو.')
    } finally {
      setDemoLoading(false)
    }
  }

  const navLinks = [
    { label: 'المميزات', href: '#why' },
    { label: 'الوحدات', href: '#modules' },
    { label: 'الأسعار', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ]

  const whyCards = [
    { icon: '🎯', title: 'إدارة مركزية', desc: 'كل عملياتك في لوحة تحكم واحدة — عملاء، مشاريع، مهام، وفواتير.' },
    { icon: '👥', title: 'متابعة العملاء', desc: 'تتبّع رحلة كل عميل من أول تواصل حتى إغلاق الصفقة.' },
    { icon: '📁', title: 'إدارة المشاريع', desc: 'أسند المشاريع، تابع التقدم، وشارك الـ Brief مع العملاء.' },
    { icon: '💳', title: 'الفواتير والمصروفات', desc: 'أنشئ فواتير احترافية، تتبّع المدفوعات، وراقب المصروفات.' },
    { icon: '📊', title: 'تقارير وتحليلات', desc: 'لوحة مؤشرات حية توضح الإيرادات والأرباح والأداء.' },
    { icon: '🔐', title: 'صلاحيات وأدوار', desc: 'تحكّم في وصول كل مستخدم بدقة — أدمن، مدير، فريق، عميل.' },
  ]

  const modules = [
    { icon: '📊', name: 'Dashboard', desc: 'KPIs & Analytics' },
    { icon: '👥', name: 'CRM', desc: 'إدارة العملاء' },
    { icon: '📁', name: 'Projects', desc: 'المشاريع والبريف' },
    { icon: '✅', name: 'Tasks', desc: 'المهام والتسليم' },
    { icon: '🏢', name: 'Team', desc: 'الفريق والرواتب' },
    { icon: '💰', name: 'Finance', desc: 'الفواتير والمصروفات' },
    { icon: '📄', name: 'Templates', desc: 'قوالب جاهزة' },
    { icon: '⚙️', name: 'Settings', desc: 'الإعدادات والأدوار' },
    { icon: '🌐', name: 'Client Portal', desc: 'بوابة العميل' },
  ]

  const stats = [
    { value: '500+', label: 'عميل تمت إدارته', icon: '👥' },
    { value: '12,000+', label: 'مهمة تم تتبعها', icon: '✅' },
    { value: '99%', label: 'نسبة التشغيل', icon: '⚡' },
    { value: '24/7', label: 'وصول بلا انقطاع', icon: '🌍' },
  ]

  const testimonials = [
    {
      text: 'Treelivine غيّر طريقة إدارتنا لفريق العمل. الآن كل شيء في مكان واحد ولا يفوتنا شيء.',
      name: 'أحمد الزهراني',
      role: 'مدير وكالة تسويق',
      avatar: 'أ',
    },
    {
      text: 'بوابة العميل رائعة! يقدر عملاؤنا يتابعون مشاريعهم ويوافقون على البريف بشكل مباشر.',
      name: 'سارة العمري',
      role: 'CEO — شركة إبداع الرقمي',
      avatar: 'س',
    },
    {
      text: 'الفواتير والمصروفات أصبحت سهلة جداً. وفّرنا ساعات من العمل اليدوي كل أسبوع.',
      name: 'فهد المطيري',
      role: 'مدير مالي',
      avatar: 'ف',
    },
  ]

  const faqs = [
    { q: 'هل يمكن تجربة النظام قبل إنشاء حساب؟', a: 'نعم! اضغط على "جرّب الديمو" وسيتم إنشاء بيانات تجريبية كاملة وتسجيل دخولك تلقائياً بدون أي خطوات إضافية.' },
    { q: 'هل يعمل النظام على الموبايل؟', a: 'نعم، النظام مصمم بشكل متجاوب يعمل على جميع الأجهزة — سطح المكتب والتابلت والموبايل.' },
    { q: 'هل يمكن إدارة العملاء والمشاريع؟', a: 'بالتأكيد. يوفر النظام وحدة CRM كاملة لإدارة العملاء ووحدة مشاريع متكاملة مع إدارة المهام والبريف.' },
    { q: 'هل يوجد بوابة للعميل؟', a: 'نعم! يمكن لعملائك الوصول لبوابة خاصة بهم لمتابعة المشاريع، والموافقة على البريف، وعرض الفواتير.' },
    { q: 'هل يمكن ربط قاعدة بيانات حقيقية؟', a: 'نعم، يستخدم النظام MongoDB Atlas ويمكن ربطه بقاعدة بياناتك الخاصة عبر إضافة MONGODB_URI في متغيرات البيئة.' },
  ]

  return (
    <div style={{ background: C.bg, color: C.white, minHeight: '100vh', fontFamily: "'Cairo', 'Segoe UI', system-ui, sans-serif", direction: 'rtl', overflowX: 'hidden' }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        a { text-decoration: none; color: inherit; }
        ::selection { background: ${C.purple}55; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${C.surface}; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
        .card-hover:hover { transform: translateY(-4px); border-color: ${C.purple}66 !important; box-shadow: ${glow(C.purple, 0.2)} !important; }
        .nav-link:hover { color: ${C.purpleL} !important; }
        .btn-p:hover { transform: scale(1.03); box-shadow: 0 0 40px ${C.purple}66; }
        .btn-o:hover { border-color: ${C.purple}88 !important; color: ${C.purpleL} !important; }
        .btn-g:hover { transform: scale(1.03); box-shadow: 0 0 40px ${C.green}66; }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes pulse-glow { 0%,100% { opacity:0.6 } 50% { opacity:1 } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.7s ease forwards; }
        .float { animation: float 5s ease-in-out infinite; }
        .glow-dot { animation: pulse-glow 3s ease-in-out infinite; }
      `}</style>

      {/* ── NOISE OVERLAY ── */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`, pointerEvents: 'none', zIndex: 0 }} />

      {/* ── GRADIENT ORBS ── */}
      <div style={{ position: 'fixed', top: -200, right: -200, width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(circle, ${C.purple}18, transparent 70%)`, pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: -200, left: -200, width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle, ${C.green}12, transparent 70%)`, pointerEvents: 'none', zIndex: 0 }} />

      {/* ══════════════════════════════════════
          1. NAVBAR
      ══════════════════════════════════════ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        padding: '0 1.5rem',
        height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'all 0.3s',
        background: navScrolled ? `${C.surface}f0` : 'transparent',
        borderBottom: navScrolled ? `1px solid ${C.border}` : '1px solid transparent',
        backdropFilter: navScrolled ? 'blur(20px)' : 'none',
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: `linear-gradient(135deg, ${C.purple}, ${C.green})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 800, color: '#fff', flexShrink: 0 }}>T</div>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', background: `linear-gradient(135deg, ${C.white}, ${C.purpleL})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Treelivine</span>
        </Link>

        {/* Desktop Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {navLinks.map(link => (
            <a key={link.href} href={link.href} className="nav-link" style={{ padding: '0.4rem 0.9rem', borderRadius: 8, fontSize: '0.9rem', color: C.muted, transition: 'color 0.2s' }}>{link.label}</a>
          ))}
        </div>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Link href="/login" style={{ padding: '0.45rem 1rem', borderRadius: 8, fontSize: '0.875rem', color: C.muted, transition: 'color 0.2s' }} className="nav-link">تسجيل الدخول</Link>
          <Link href="/register" style={{
            padding: '0.45rem 1.1rem', borderRadius: 8, fontSize: '0.875rem', fontWeight: 600,
            border: `1px solid ${C.border}`, color: C.white, transition: 'all 0.2s',
          }} className="btn-o">إنشاء حساب</Link>
          <button onClick={handleDemo} disabled={demoLoading} className="btn-p" style={{
            padding: '0.45rem 1.25rem', borderRadius: 8, fontSize: '0.875rem', fontWeight: 700,
            background: `linear-gradient(135deg, ${C.purple}, ${C.purpleD})`,
            color: '#fff', border: 'none', cursor: 'pointer',
            boxShadow: glow(C.purple, 0.4),
            transition: 'all 0.2s',
            opacity: demoLoading ? 0.7 : 1,
          }}>
            {demoLoading ? '...' : '🚀 جرّب الديمو'}
          </button>
        </div>
      </nav>

      {/* ══════════════════════════════════════
          2. HERO
      ══════════════════════════════════════ */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8rem 1.5rem 5rem', position: 'relative', textAlign: 'center' }}>
        {/* Live dot */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 1rem', borderRadius: 999, background: `${C.green}18`, border: `1px solid ${C.green}44`, marginBottom: '1.5rem' }}>
          <div className="glow-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: C.green }} />
          <span style={{ fontSize: '0.78rem', color: C.greenL, fontWeight: 600 }}>النظام يعمل الآن — جرّب بدون تسجيل</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(2.2rem, 6vw, 4.2rem)',
          fontWeight: 900, lineHeight: 1.15,
          maxWidth: 820, marginBottom: '1.25rem',
          background: `linear-gradient(135deg, ${C.white} 30%, ${C.purpleL} 70%, ${C.greenL} 100%)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          شغّل شركتك بالكامل<br />من منصة ERP واحدة
        </h1>

        <p style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)', color: C.muted, maxWidth: 620, lineHeight: 1.75, marginBottom: '2.5rem' }}>
          Treelivine ERP يساعد فرقك على إدارة العملاء، المشاريع، المهام، الفواتير، والمالية من لوحة تحكم واحدة قوية.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <BtnGreen onClick={handleDemo} style={{ fontSize: '1rem', padding: '0.85rem 2.25rem' }} className="btn-g">
            {demoLoading ? '⏳ جاري التحضير...' : '🚀 جرّب الديمو مجاناً'}
          </BtnGreen>
          <BtnPrimary href="/register" className="btn-p" style={{ fontSize: '1rem', padding: '0.85rem 2.25rem' }}>إنشاء حساب</BtnPrimary>
          <BtnOutline href="/login" className="btn-o" style={{ fontSize: '1rem', padding: '0.85rem 2.25rem' }}>تسجيل الدخول</BtnOutline>
        </div>

        <p style={{ fontSize: '0.82rem', color: C.muted2, display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}>
          <span>✓</span> يمكنك تجربة النظام قبل إنشاء حساب — بدون بطاقة ائتمانية
        </p>

        {/* Hero visual */}
        <div className="float" style={{ width: '100%', maxWidth: 900, marginTop: '4rem', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: -40, background: `radial-gradient(ellipse, ${C.purple}18, transparent 70%)`, borderRadius: '50%' }} />
          <DashboardMockup />
        </div>
      </section>

      {/* ══════════════════════════════════════
          3. WHY TREELIVINE
      ══════════════════════════════════════ */}
      <Section id="why">
        <SectionHeader badge="لماذا Treelivine؟" title="كل ما تحتاجه لإدارة شركتك" sub="منصة متكاملة تجمع كل أدوات إدارة الأعمال في مكان واحد، مصممة خصيصاً لوكالات التسويق والشركات الخدمية." />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {whyCards.map((card, i) => (
            <div key={i} className="card-hover" style={{
              background: `linear-gradient(135deg, ${C.surface2}cc, ${C.surface}99)`,
              border: `1px solid ${C.border}`,
              borderRadius: 16, padding: '1.75rem',
              transition: 'all 0.25s', cursor: 'default',
            }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `${C.purple}22`, border: `1px solid ${C.purple}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', marginBottom: '1rem' }}>
                {card.icon}
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: C.white, marginBottom: '0.5rem' }}>{card.title}</h3>
              <p style={{ fontSize: '0.88rem', color: C.muted, lineHeight: 1.7 }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ══════════════════════════════════════
          4. MODULES
      ══════════════════════════════════════ */}
      <Section id="modules" style={{ background: `linear-gradient(180deg, transparent, ${C.surface2}44, transparent)` }}>
        <SectionHeader badge="الوحدات" title="نظام متكامل من 9 وحدات" sub="كل وحدة مصممة لتحل مشكلة محددة وتتكامل مع باقي الوحدات." />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {modules.map((mod, i) => (
            <div key={i} className="card-hover" style={{
              background: C.surface2,
              border: `1px solid ${C.border}`,
              borderRadius: 14, padding: '1.4rem 1.25rem',
              textAlign: 'center', transition: 'all 0.25s', cursor: 'default',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.6rem' }}>{mod.icon}</div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: C.white, marginBottom: '0.25rem' }}>{mod.name}</h3>
              <p style={{ fontSize: '0.78rem', color: C.muted }}>{mod.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ══════════════════════════════════════
          5. DEMO SECTION
      ══════════════════════════════════════ */}
      <Section id="demo">
        <div style={{
          background: `linear-gradient(135deg, ${C.surface2}, ${C.surface})`,
          border: `1px solid ${C.border}`,
          borderRadius: 24,
          padding: 'clamp(2rem, 5vw, 4rem)',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem',
          alignItems: 'center',
          boxShadow: glow(C.purple, 0.12),
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -80, left: -80, width: 300, height: 300, borderRadius: '50%', background: `radial-gradient(circle, ${C.purple}15, transparent 70%)`, pointerEvents: 'none' }} />
          <div>
            <GradientBadge>⚡ جرّب الآن</GradientBadge>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, color: C.white, marginBottom: '1rem', lineHeight: 1.3 }}>
              جرّب Treelivine ERP<br />بدون إنشاء حساب
            </h2>
            <p style={{ color: C.muted, lineHeight: 1.8, marginBottom: '1.75rem', fontSize: '0.95rem' }}>
              يمكنك تجربة Treelivine ERP مباشرةً باستخدام بيانات تجريبية كاملة بدون إنشاء حساب. ستجد عملاء، مشاريع، مهام، وفواتير جاهزة للاستكشاف.
            </p>
            <BtnGreen onClick={handleDemo} className="btn-g" style={{ fontSize: '1rem' }}>
              {demoLoading ? '⏳ جاري التحضير...' : '🚀 ابدأ الديمو الآن'}
            </BtnGreen>
          </div>
          <div style={{
            background: C.bg,
            border: `1px solid ${C.border}`,
            borderRadius: 16, padding: '1.75rem',
          }}>
            <p style={{ fontSize: '0.78rem', color: C.muted, marginBottom: '1rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>بيانات الدخول التجريبية</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'البريد الإلكتروني', value: 'demo@treeelivine.com' },
                { label: 'كلمة المرور', value: 'demo1234' },
                { label: 'الدور', value: 'Admin — صلاحيات كاملة' },
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.9rem', background: C.surface2, borderRadius: 8, fontSize: '0.85rem' }}>
                  <span style={{ color: C.muted }}>{row.label}</span>
                  <span style={{ color: C.white, fontWeight: 600, direction: 'ltr' }}>{row.value}</span>
                </div>
              ))}
            </div>
            <button onClick={handleDemo} disabled={demoLoading} style={{
              width: '100%', padding: '0.75rem', borderRadius: 10,
              background: `linear-gradient(135deg, ${C.purple}, ${C.purpleD})`,
              color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem',
              opacity: demoLoading ? 0.7 : 1, transition: 'all 0.2s',
            }}>
              {demoLoading ? 'جاري فتح الديمو...' : 'Open Demo →'}
            </button>
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════
          6. STATS
      ══════════════════════════════════════ */}
      <Section>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem',
          background: `linear-gradient(135deg, ${C.surface2}99, ${C.surface}99)`,
          border: `1px solid ${C.border}`, borderRadius: 20, padding: '2.5rem',
        }}>
          {stats.map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
              <div style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 900, background: `linear-gradient(135deg, ${C.purpleL}, ${C.greenL})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.4rem' }}>{stat.value}</div>
              <div style={{ fontSize: '0.85rem', color: C.muted }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ══════════════════════════════════════
          7. PRICING
      ══════════════════════════════════════ */}
      <Section id="pricing">
        <SectionHeader badge="الأسعار" title="بسيط وشفاف" sub="ابدأ مجاناً واستكشف كامل إمكانيات النظام." />
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{
            background: `linear-gradient(135deg, ${C.surface2}, ${C.surface})`,
            border: `2px solid ${C.purple}55`,
            borderRadius: 24, padding: '3rem',
            maxWidth: 480, width: '100%', textAlign: 'center',
            boxShadow: glow(C.purple, 0.25),
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)', width: 200, height: 200, borderRadius: '50%', background: `radial-gradient(circle, ${C.purple}20, transparent 70%)` }} />
            <div style={{ display: 'inline-block', padding: '0.3rem 1rem', borderRadius: 999, background: `${C.purple}22`, border: `1px solid ${C.purple}44`, color: C.purpleL, fontSize: '0.78rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              🎉 متاح الآن
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: C.white, marginBottom: '0.5rem' }}>Treelivine ERP Demo</h3>
            <div style={{ fontSize: '4rem', fontWeight: 900, background: `linear-gradient(135deg, ${C.purpleL}, ${C.greenL})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.25rem' }}>FREE</div>
            <p style={{ color: C.muted, marginBottom: '2rem', fontSize: '0.9rem' }}>جرّب كل الوحدات بدون قيود</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', marginBottom: '2rem', textAlign: 'right' }}>
              {['✅ إدارة العملاء CRM', '✅ المشاريع والبريف', '✅ المهام والتسليم', '✅ الفواتير والمصروفات', '✅ بوابة العميل', '✅ التقارير والإحصائيات', '✅ بيانات تجريبية جاهزة'].map((f, i) => (
                <div key={i} style={{ fontSize: '0.9rem', color: C.muted, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>{f}</div>
              ))}
            </div>
            <BtnGreen onClick={handleDemo} style={{ width: '100%', fontSize: '1rem', padding: '0.9rem' }} className="btn-g">
              {demoLoading ? '⏳ ...' : '🚀 جرّب الديمو مجاناً'}
            </BtnGreen>
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════
          8. TESTIMONIALS
      ══════════════════════════════════════ */}
      <Section style={{ background: `linear-gradient(180deg, transparent, ${C.surface2}33, transparent)` }}>
        <SectionHeader badge="آراء العملاء" title="ماذا يقول مستخدمونا" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {testimonials.map((t, i) => (
            <div key={i} className="card-hover" style={{
              background: `linear-gradient(135deg, ${C.surface2}, ${C.surface})`,
              border: `1px solid ${C.border}`,
              borderRadius: 18, padding: '2rem',
              transition: 'all 0.25s',
            }}>
              <div style={{ fontSize: '1.75rem', color: C.purple, marginBottom: '1rem' }}>"</div>
              <p style={{ color: C.muted, lineHeight: 1.8, marginBottom: '1.5rem', fontSize: '0.92rem' }}>{t.text}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: `linear-gradient(135deg, ${C.purple}, ${C.green})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff', fontSize: '1rem', flexShrink: 0 }}>
                  {t.avatar}
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '0.9rem', color: C.white }}>{t.name}</p>
                  <p style={{ fontSize: '0.78rem', color: C.muted }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ══════════════════════════════════════
          9. FAQ
      ══════════════════════════════════════ */}
      <Section id="faq">
        <SectionHeader badge="الأسئلة الشائعة" title="أجوبة على أكثر الأسئلة شيوعاً" />
        <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {faqs.map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} />)}
        </div>
      </Section>

      {/* ══════════════════════════════════════
          10. FINAL CTA
      ══════════════════════════════════════ */}
      <Section>
        <div style={{
          textAlign: 'center',
          background: `linear-gradient(135deg, ${C.purple}22, ${C.surface2}, ${C.green}15)`,
          border: `1px solid ${C.purple}33`,
          borderRadius: 28, padding: 'clamp(3rem, 6vw, 5rem) 2rem',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: `radial-gradient(circle, ${C.purple}20, transparent 70%)`, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -80, left: -80, width: 300, height: 300, borderRadius: '50%', background: `radial-gradient(circle, ${C.green}15, transparent 70%)`, pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <GradientBadge>ابدأ الآن</GradientBadge>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 900, color: C.white, marginBottom: '1rem', lineHeight: 1.3 }}>
              جاهز لإدارة شركتك بذكاء؟
            </h2>
            <p style={{ fontSize: '1.05rem', color: C.muted, maxWidth: 480, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
              انضم إلى المئات من الشركات التي تستخدم Treelivine ERP لتبسيط عملياتها وزيادة إنتاجيتها.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <BtnGreen onClick={handleDemo} style={{ fontSize: '1rem', padding: '0.9rem 2.5rem' }} className="btn-g">
                {demoLoading ? '⏳ ...' : '🚀 جرّب الديمو'}
              </BtnGreen>
              <BtnPrimary href="/register" style={{ fontSize: '1rem', padding: '0.9rem 2.5rem' }} className="btn-p">إنشاء حساب</BtnPrimary>
            </div>
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════
          11. FOOTER
      ══════════════════════════════════════ */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: '3rem 1.5rem 2rem', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '2.5rem', marginBottom: '3rem' }}>
            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: `linear-gradient(135deg, ${C.purple}, ${C.green})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 800, color: '#fff' }}>T</div>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', background: `linear-gradient(135deg, ${C.white}, ${C.purpleL})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Treelivine</span>
              </div>
              <p style={{ color: C.muted, fontSize: '0.85rem', lineHeight: 1.7, maxWidth: 240 }}>
                منصة ERP متكاملة لإدارة وكالات التسويق والشركات الخدمية.
              </p>
            </div>

            {/* Links */}
            {[
              { title: 'المنتج', links: [{ label: 'المميزات', href: '#why' }, { label: 'الوحدات', href: '#modules' }, { label: 'الأسعار', href: '#pricing' }, { label: 'FAQ', href: '#faq' }] },
              { title: 'الحساب', links: [{ label: 'تسجيل الدخول', href: '/login' }, { label: 'إنشاء حساب', href: '/register' }, { label: 'الديمو', href: '#demo' }] },
              { title: 'الدعم', links: [{ label: 'التوثيق', href: '#' }, { label: 'تواصل معنا', href: '#' }] },
            ].map((col, i) => (
              <div key={i}>
                <p style={{ fontWeight: 700, fontSize: '0.85rem', color: C.white, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{col.title}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {col.links.map((link, j) => (
                    <a key={j} href={link.href} className="nav-link" style={{ fontSize: '0.875rem', color: C.muted, transition: 'color 0.2s' }}>{link.label}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: `1px solid ${C.border2}`, paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <p style={{ fontSize: '0.82rem', color: C.muted2 }}>© {new Date().getFullYear()} Treelivine ERP. جميع الحقوق محفوظة.</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {['سياسة الخصوصية', 'الشروط والأحكام'].map((label, i) => (
                <a key={i} href="#" className="nav-link" style={{ fontSize: '0.82rem', color: C.muted2, transition: 'color 0.2s' }}>{label}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
