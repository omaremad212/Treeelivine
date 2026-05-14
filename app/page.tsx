'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useApp } from '@/contexts/AppContext'

/* ── Brand logo ──────────────────────────────────────────────────────── */
function BrandMark({ size = 28 }: { size?: number }) {
  return <img src="/logo.png" alt="Treeelivine" width={size} height={size} style={{ objectFit: 'contain' }} />
}

/* ── Icons ───────────────────────────────────────────────────────────── */
function Ico({ d, size = 22 }: { d: string | string[]; size?: number }) {
  const paths = Array.isArray(d) ? d : [d]
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      {paths.map((p, i) => <path key={i} d={p} />)}
    </svg>
  )
}

/* ── Word-by-word animated headline (triggered by .revealed parent) ── */
function AnimatedWords({ text, baseDelay = 0 }: { text: string; baseDelay?: number }) {
  return (
    <>
      {text.split(' ').map((word, i) => (
        <span key={i} className="aw-wrap">
          <span className="aw-word" style={{ transitionDelay: `${baseDelay + i * 70}ms` }}>
            {word}
          </span>
          {' '}
        </span>
      ))}
    </>
  )
}



/* ── Feature card ─────────────────────────────────────────────────────── */
const FeatureIcons: Record<string, React.ReactNode> = {
  crm:      <Ico d={['M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2','M23 21v-2a4 4 0 00-3-3.87','M16 3.13a4 4 0 010 7.75','M9 11a4 4 0 100-8 4 4 0 000 8z']} />,
  projects: <Ico d={['M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z']} />,
  tasks:    <Ico d={['M9 11l3 3L22 4','M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11']} />,
  finance:  <Ico d={['M12 2v20','M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6']} />,
  analytics:<Ico d={['M3 3v18h18','M18 9l-5 5-2-2-4 4']} />,
  roles:    <Ico d={['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z']} />,
}

function FeatureCard({ iconKey, title, desc }: { iconKey: string; title: string; desc: string }) {
  return (
    <div className="fade-card feature-card" style={{
      background: 'var(--bg-surface)', border: '1px solid var(--border-1)', borderRadius: 12, padding: 24,
    }}>
      <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--brand-primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-primary)', marginBottom: 16 }}>
        {FeatureIcons[iconKey]}
      </div>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-1)', marginBottom: 8 }}>{title}</h3>
      <p style={{ fontSize: 13, color: 'var(--fg-4)', lineHeight: 1.65 }}>{desc}</p>
    </div>
  )
}

/* ── Module badge ─────────────────────────────────────────────────────── */
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

function ModuleBadge({ iconKey, name, desc }: { iconKey: string; name: string; desc: string }) {
  return (
    <div className="fade-card module-badge" style={{
      background: 'var(--bg-surface)', border: '1px solid var(--border-1)', borderRadius: 12, padding: 20,
      textAlign: 'center',
    }}>
      <div style={{ color: 'var(--brand-primary)', display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
        {ModuleIcons[iconKey]}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-1)', marginBottom: 2 }}>{name}</div>
      <div style={{ fontSize: 11, color: 'var(--fg-4)' }}>{desc}</div>
    </div>
  )
}

/* ── Testimonial ──────────────────────────────────────────────────────── */
function TestimonialCard({ quote, name, role, initials }: { quote: string; name: string; role: string; initials: string }) {
  return (
    <div className="fade-card" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-1)', borderRadius: 12, padding: 24 }}>
      <div style={{ fontSize: 32, color: 'var(--brand-primary)', lineHeight: 1, marginBottom: 16, opacity: 0.4 }}>"</div>
      <p style={{ fontSize: 13, color: 'var(--fg-3)', lineHeight: 1.7, marginBottom: 20 }}>{quote}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{initials}</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-1)' }}>{name}</div>
          <div style={{ fontSize: 11, color: 'var(--fg-4)' }}>{role}</div>
        </div>
      </div>
    </div>
  )
}

/* ── FAQ ──────────────────────────────────────────────────────────────── */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ border: '1px solid var(--border-1)', borderRadius: 8, overflow: 'hidden', background: 'var(--bg-surface)' }}>
      <button
        onClick={() => setOpen(p => !p)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'none', border: 'none', color: 'var(--fg-1)', fontSize: 13, fontWeight: 500, cursor: 'pointer', textAlign: 'start', fontFamily: 'inherit', gap: 16 }}
      >
        <span>{q}</span>
        <span style={{ color: 'var(--brand-primary)', fontSize: 18, fontWeight: 300, flexShrink: 0, transform: open ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>+</span>
      </button>
      {open && <div style={{ padding: '0 20px 16px', color: 'var(--fg-3)', fontSize: 13, lineHeight: 1.7 }}>{a}</div>}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const router = useRouter()
  const { theme, setTheme } = useApp()
  const [demoLoading, setDemoLoading] = useState(false)
  const [navScrolled, setNavScrolled] = useState(false)

  /* ── All scroll effects in one useEffect ── */
  useEffect(() => {
    let ticking = false

    const updateTilt = () => {
      const el = document.getElementById('hero-dashboard')
      if (el) {
        const sy = window.scrollY
        const progress = Math.min(sy / 520, 1)
        // ease-out-cubic
        const ease = 1 - Math.pow(1 - progress, 3)
        const rotX  = 20 * (1 - ease)
        const scale  = 0.84 + 0.16 * ease
        const transY = 30 * (1 - ease)
        el.style.transform = `perspective(1400px) rotateX(${rotX}deg) translateY(${transY}px) scale(${scale})`
      }
      ticking = false
    }

    const onScroll = () => {
      setNavScrolled(window.scrollY > 40)
      if (!ticking) {
        requestAnimationFrame(updateTilt)
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    updateTilt()

    /* IntersectionObserver for section reveals */
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('revealed') }),
      { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
    )
    document.querySelectorAll('.reveal-section').forEach(el => io.observe(el))

    /* Stagger .fade-card children within revealed parents */
    const io2 = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) {
          const cards = e.target.querySelectorAll('.fade-card')
          cards.forEach((card, i) => {
            setTimeout(() => card.classList.add('card-visible'), i * 80)
          })
        }
      }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.cards-container').forEach(el => io2.observe(el))

    return () => {
      window.removeEventListener('scroll', onScroll)
      io.disconnect()
      io2.disconnect()
    }
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
    { iconKey: 'crm',       title: 'إدارة العملاء CRM',     desc: 'تتبّع كل عميل من أول تواصل حتى إغلاق الصفقة، مع إدارة كاملة للحالة والأولوية والمسؤول.' },
    { iconKey: 'projects',  title: 'إدارة المشاريع',         desc: 'أسند المشاريع، تابع التقدم، وشارك البريف مع العملاء مباشرةً من منصة واحدة.' },
    { iconKey: 'tasks',     title: 'المهام والتسليمات',      desc: 'نظام مهام مرن يربط الفريق بالمشاريع والعملاء، مع تتبع التقدم والمواعيد النهائية.' },
    { iconKey: 'finance',   title: 'الفواتير والمالية',      desc: 'أنشئ فواتير احترافية، تتبّع المدفوعات، وراقب المصروفات والأرباح في لوحة مالية موحدة.' },
    { iconKey: 'analytics', title: 'تقارير وتحليلات',        desc: 'لوحة مؤشرات حية توضح الإيرادات والأرباح والأداء — بأرقام حقيقية وفي الوقت الفعلي.' },
    { iconKey: 'roles',     title: 'صلاحيات وأدوار',         desc: 'تحكّم في وصول كل مستخدم بدقة — أدمن، مدير، فريق، عميل — مع صلاحيات تفصيلية لكل وحدة.' },
  ]

  const modules = [
    { iconKey: 'dashboard', name: 'Dashboard',     desc: 'لوحة التحكم' },
    { iconKey: 'crm',       name: 'CRM',           desc: 'إدارة العملاء' },
    { iconKey: 'projects',  name: 'Projects',      desc: 'المشاريع والبريف' },
    { iconKey: 'tasks',     name: 'Tasks',         desc: 'المهام والتسليم' },
    { iconKey: 'team',      name: 'Team',          desc: 'الفريق والرواتب' },
    { iconKey: 'finance',   name: 'Finance',       desc: 'الفواتير والمالية' },
    { iconKey: 'templates', name: 'Templates',     desc: 'قوالب جاهزة' },
    { iconKey: 'settings',  name: 'Settings',      desc: 'الإعدادات' },
    { iconKey: 'portal',    name: 'Client Portal', desc: 'بوابة العميل' },
  ]

  const stats = [
    { value: '500+',    label: 'عميل تمت إدارته' },
    { value: '12,000+', label: 'مهمة تم تتبعها' },
    { value: '99%',     label: 'نسبة التشغيل' },
    { value: '24/7',    label: 'وصول بلا انقطاع' },
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

  const isDark = theme === 'dark'
  const L = {
    bg: 'var(--bg-app)',
    surface: 'var(--bg-surface)',
    border: 'var(--border-1)',
    border2: 'var(--border-2)',
    fg1: 'var(--fg-1)',
    fg2: 'var(--fg-2)',
    fg3: 'var(--fg-3)',
    fg4: 'var(--fg-4)',
    fg5: 'var(--fg-5)',
    olive: 'var(--brand-primary)',
    oliveL: 'var(--brand-primary-soft)',
    olive2: 'var(--brand-olive-100)',
    navBg: isDark ? 'rgba(20,20,15,0.92)' : 'rgba(255,255,255,0.92)',
  }

  return (
    <div style={{ background: 'var(--bg-app)', color: 'var(--fg-2)', minHeight: '100vh', direction: 'rtl', overflowX: 'hidden' }}>

      {/* ═══════════════════ GLOBAL STYLES ═══════════════════ */}
      <style>{`
        html { scroll-behavior: smooth; }

        /* ── Nav ── */
        .ln-link { color: ${L.fg4}; font-size:14px; padding:6px 12px; border-radius:8px; text-decoration:none; transition:color 0.15s; }
        .ln-link:hover { color:${L.fg1}; text-decoration:none; }

        /* ── Buttons ── */
        .btn-primary {
          display:inline-flex; align-items:center; gap:6px;
          padding:13px 26px; background:${L.olive}; color:#fff;
          border-radius:10px; font-size:15px; font-weight:600;
          border:none; cursor:pointer; font-family:inherit; text-decoration:none;
          transition:background 0.15s, box-shadow 0.15s, transform 0.12s;
        }
        .btn-primary:hover { background:#3d5128; box-shadow:0 6px 20px rgba(79,104,49,0.32); color:#fff; text-decoration:none; transform:translateY(-1px); }
        .btn-primary:active { transform:translateY(0); }
        .btn-secondary {
          display:inline-flex; align-items:center; gap:6px;
          padding:13px 24px; background:${L.surface}; color:${L.fg1};
          border-radius:10px; font-size:15px; font-weight:500;
          border:1px solid ${L.border}; cursor:pointer; font-family:inherit; text-decoration:none;
          transition:background 0.15s, transform 0.12s;
        }
        .btn-secondary:hover { background:${L.bg}; text-decoration:none; color:${L.fg1}; transform:translateY(-1px); }
        .btn-sm { padding:7px 16px !important; font-size:13px !important; border-radius:8px !important; }

        /* ── Word-by-word reveal (scroll triggered) ── */
        .aw-wrap {
          display:inline-block; overflow:hidden;
          vertical-align:bottom;
        }
        .aw-word {
          display:inline-block;
          transform:translateX(50px);
          opacity:0;
          transition:transform 0.6s cubic-bezier(0.22,0.61,0.36,1),
                      opacity 0.5s ease;
        }
        .reveal-section.revealed .aw-word { transform:translateX(0); opacity:1; }

        /* ── Hero headline (immediate on load) ── */
        @keyframes wordIn {
          from { transform:translateX(44px); opacity:0; }
          to   { transform:translateX(0);    opacity:1; }
        }
        .hero-word {
          display:inline-block;
          animation: wordIn 0.65s cubic-bezier(0.22,0.61,0.36,1) both;
        }

        /* ── Fade-up cards ── */
        .fade-card {
          opacity:0; transform:translateY(28px);
          transition:opacity 0.55s ease, transform 0.55s cubic-bezier(0.22,0.61,0.36,1);
        }
        .fade-card.card-visible { opacity:1; transform:translateY(0); }

        /* ── Dashboard tilt container ── */
        #hero-dashboard {
          transform-origin:center bottom;
          will-change:transform;
        }

        /* ── Feature card hover ── */
        .feature-card { transition:box-shadow 0.18s ease, border-color 0.18s ease, opacity 0.55s ease, transform 0.55s cubic-bezier(0.22,0.61,0.36,1) !important; }
        .feature-card:hover { box-shadow:0 6px 20px rgba(23,22,19,0.08); border-color:#c9d6ac !important; }

        /* ── Module badge hover ── */
        .module-badge { transition:border-color 0.18s ease, transform 0.18s ease, opacity 0.55s ease, transform 0.55s cubic-bezier(0.22,0.61,0.36,1) !important; }
        .module-badge:hover { border-color:#a9bd80 !important; transform:translateY(-3px); }

        /* ── Responsive ── */
        @media (max-width:900px) {
          .nav-links-d { display:none !important; }
        }
        @media (max-width:640px) {
          .stats-row { grid-template-columns:repeat(2,1fr) !important; }
          .features-g { grid-template-columns:1fr !important; }
          .modules-g  { grid-template-columns:repeat(3,1fr) !important; }
          .testimonials-g { grid-template-columns:1fr !important; }
          .footer-g   { grid-template-columns:1fr 1fr !important; }
          .hero-btns  { flex-direction:column; align-items:stretch !important; }
          .hero-btns .btn-primary, .hero-btns .btn-secondary { justify-content:center; }
        }
      `}</style>

      {/* ═══════════════════ NAVBAR ═══════════════════ */}
      <nav style={{
        position: 'fixed', top: 0, insetInline: 0, zIndex: 1000,
        height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(16px,4vw,48px)',
        transition: 'background 0.3s, backdrop-filter 0.3s, border-bottom 0.3s',
        background: navScrolled ? L.navBg : 'transparent',
        borderBottom: navScrolled ? `1px solid ${L.border}` : '1px solid transparent',
        backdropFilter: navScrolled ? 'blur(14px)' : 'none',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <BrandMark size={26} />
          <span style={{ fontSize: 15, fontWeight: 700, color: L.fg1, letterSpacing: '-0.01em' }}>treeelivine</span>
        </Link>
        <div className="nav-links-d" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {[{ label: 'المميزات', href: '#features' }, { label: 'الوحدات', href: '#modules' }, { label: 'الأسعار', href: '#pricing' }, { label: 'FAQ', href: '#faq' }].map(l => (
            <a key={l.href} href={l.href} className="ln-link">{l.label}</a>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="btn-secondary btn-sm"
            style={{ padding: '7px 10px', fontSize: 14 }}
            title={isDark ? 'وضع فاتح' : 'وضع داكن'}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
          <Link href="/login" className="ln-link" style={{ display: 'inline-block' }}>دخول</Link>
          <Link href="/register" className="btn-secondary btn-sm">حساب جديد</Link>
          <button onClick={handleDemo} disabled={demoLoading} className="btn-primary btn-sm" style={{ opacity: demoLoading ? 0.75 : 1 }}>
            {demoLoading ? 'جاري...' : 'جرّب الديمو'}
          </button>
        </div>
      </nav>

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section style={{ paddingTop: 'clamp(90px,12vw,130px)', paddingBottom: 0, textAlign: 'center', position: 'relative' }}>

        {/* Subtle radial glow */}
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 800, height: 500, background: 'radial-gradient(ellipse at center top, rgba(79,104,49,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 clamp(16px,4vw,24px)', position: 'relative' }}>
          {/* Trust badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '6px 16px 6px 10px', borderRadius: 999, background: L.surface, border: `1px solid ${L.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 28, animation: 'wordIn 0.6s ease both' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {['#4f6831','#2f6bbf','#c87a52'].map((c, i) => (
                <div key={i} style={{ width: 22, height: 22, borderRadius: '50%', background: c, border: '2px solid #fff', marginInlineEnd: i < 2 ? -6 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, color: '#fff', fontWeight: 700 }}>
                  {['أد','سع','فم'][i]}
                </div>
              ))}
            </div>
            <span style={{ fontSize: 12, color: L.fg3, fontWeight: 500 }}>موثوق من مئات الوكالات</span>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2f8a3e', display: 'inline-block', flexShrink: 0 }} />
          </div>

          {/* Main headline — word by word on load */}
          <h1 style={{ fontSize: 'clamp(30px,5.5vw,62px)', fontWeight: 800, lineHeight: 1.12, color: L.fg1, letterSpacing: '-0.025em', marginBottom: 18 }}>
            {['شغّل', 'شركتك', 'بالكامل'].map((w, i) => (
              <span key={i} className="hero-word" style={{ animationDelay: `${i * 90}ms` }}>{w} </span>
            ))}
            <br />
            <span style={{ color: L.olive }}>
              {['من', 'منصة', 'ERP', 'واحدة'].map((w, i) => (
                <span key={i} className="hero-word" style={{ animationDelay: `${270 + i * 90}ms` }}>{w} </span>
              ))}
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{ fontSize: 'clamp(14px,1.9vw,18px)', color: L.fg4, lineHeight: 1.75, maxWidth: 580, margin: '0 auto 28px', animation: 'wordIn 0.7s ease 0.5s both' }}>
            إدارة العملاء، المشاريع، المهام، الفواتير، والمالية — كل شيء في لوحة تحكم واحدة مصممة لوكالات التسويق.
          </p>

          {/* CTAs */}
          <div className="hero-btns" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 10, animation: 'wordIn 0.7s ease 0.7s both' }}>
            <button onClick={handleDemo} disabled={demoLoading} className="btn-primary" style={{ opacity: demoLoading ? 0.75 : 1, fontSize: 16, padding: '14px 30px' }}>
              {demoLoading ? 'جاري الفتح...' : 'جرّب الديمو مجاناً'}
            </button>
            <Link href="/register" className="btn-secondary" style={{ fontSize: 16, padding: '14px 28px' }}>إنشاء حساب</Link>
          </div>
          <p style={{ fontSize: 12, color: L.fg5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, animation: 'wordIn 0.7s ease 0.85s both' }}>
            <span style={{ color: '#2f8a3e', fontWeight: 700 }}>✓</span>
            بدون بطاقة ائتمانية · بدون تسجيل
          </p>
        </div>

        {/* ── Dashboard with perspective tilt ── */}
        <div style={{ marginTop: 16, position: 'relative', padding: '0 clamp(8px,3vw,24px)' }}>
          {/* Bottom fade mask */}
          <div style={{ position: 'absolute', bottom: 0, insetInline: 0, height: '20%', background: `linear-gradient(to top, var(--bg-app), transparent)`, zIndex: 2, pointerEvents: 'none' }} />

          {/* Glow under mockup */}
          <div style={{ position: 'absolute', bottom: '8%', left: '50%', transform: 'translateX(-50%)', width: '60%', height: 80, background: 'rgba(79,104,49,0.2)', filter: 'blur(52px)', pointerEvents: 'none', zIndex: 0 }} />

          <div id="hero-dashboard" style={{ maxWidth: 1060, margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div style={{
              borderRadius: 18,
              overflow: 'hidden',
              boxShadow: '0 2px 0 1px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.14), 0 32px 80px rgba(0,0,0,0.22), 0 64px 120px rgba(0,0,0,0.12)',
              border: `1px solid ${L.border}`,
              background: 'var(--bg-surface)',
            }}>
              {/* Browser chrome bar */}
              <div style={{
                background: 'var(--bg-surface-2)',
                borderBottom: `1px solid ${L.border}`,
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['#ff5f57','#febc2e','#28c840'].map(c => (
                    <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
                  ))}
                </div>
                <div style={{ flex: 1, background: 'var(--bg-app)', borderRadius: 6, height: 22, maxWidth: 280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                  <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="var(--fg-4)" strokeWidth={2}><circle cx={12} cy={12} r={10}/><path d="M2 12h20"/></svg>
                  <span style={{ fontSize: 10, color: 'var(--fg-4)', fontFamily: 'monospace' }}>app.treeelivine.com</span>
                </div>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={isDark ? '/dashboard-dark.png' : '/dashboard-light.png'}
                alt="Treeelivine Dashboard"
                style={{ width: '100%', display: 'block' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ STATS STRIP ═══════════════════ */}
      <div style={{ borderTop: `1px solid ${L.border}` }} />
      <section className="reveal-section" style={{ padding: '40px clamp(16px,4vw,24px)', background: L.surface }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24, textAlign: 'center' }} className="stats-row">
          {stats.map((s, i) => (
            <div key={i} style={{ transitionDelay: `${i * 80}ms` }} className="aw-wrap">
              <div style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 800, color: L.olive, fontVariantNumeric: 'tabular-nums', marginBottom: 4 }}>
                <AnimatedWords text={s.value} baseDelay={i * 60} />
              </div>
              <div style={{ fontSize: 12, color: L.fg4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>
      <div style={{ borderTop: `1px solid ${L.border}` }} />

      {/* ═══════════════════ FEATURES ═══════════════════ */}
      <section id="features" style={{ padding: 'clamp(56px,8vw,96px) clamp(16px,4vw,24px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="reveal-section" style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: L.olive, marginBottom: 14 }}>المميزات</div>
            <h2 style={{ fontSize: 'clamp(22px,3.5vw,38px)', fontWeight: 700, color: L.fg1, letterSpacing: '-0.015em', marginBottom: 12 }}>
              <AnimatedWords text="كل ما تحتاجه لإدارة شركتك" />
            </h2>
            <p style={{ fontSize: 14, color: L.fg3, maxWidth: 520, margin: '0 auto', lineHeight: 1.75 }}>
              <AnimatedWords text="منصة متكاملة تجمع كل أدوات إدارة الأعمال في مكان واحد" baseDelay={300} />
            </p>
          </div>
          <div className="cards-container features-g" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
            {features.map((f, i) => <FeatureCard key={i} {...f} />)}
          </div>
        </div>
      </section>

      {/* ═══════════════════ MODULES ═══════════════════ */}
      <section id="modules" style={{ padding: 'clamp(56px,8vw,96px) clamp(16px,4vw,24px)', background: L.surface, borderTop: `1px solid ${L.border}`, borderBottom: `1px solid ${L.border}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="reveal-section" style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: L.olive, marginBottom: 14 }}>الوحدات</div>
            <h2 style={{ fontSize: 'clamp(22px,3.5vw,38px)', fontWeight: 700, color: L.fg1, letterSpacing: '-0.015em', marginBottom: 12 }}>
              <AnimatedWords text="نظام متكامل من 9 وحدات" />
            </h2>
            <p style={{ fontSize: 14, color: L.fg3, maxWidth: 520, margin: '0 auto', lineHeight: 1.75 }}>
              <AnimatedWords text="كل وحدة مصممة لتحل مشكلة محددة وتتكامل مع باقي الوحدات" baseDelay={280} />
            </p>
          </div>
          <div className="cards-container modules-g" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 12 }}>
            {modules.map((m, i) => <ModuleBadge key={i} {...m} />)}
          </div>
        </div>
      </section>

      {/* ═══════════════════ DEMO CTA ═══════════════════ */}
      <section id="pricing" style={{ padding: 'clamp(56px,8vw,96px) clamp(16px,4vw,24px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="reveal-section" style={{
            background: L.surface, border: `1px solid ${L.border2}`, borderRadius: 20,
            padding: 'clamp(28px,5vw,56px)', position: 'relative', overflow: 'hidden',
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center',
          }}>
            <div style={{ position: 'absolute', top: -80, insetInlineEnd: -80, width: 280, height: 280, borderRadius: '50%', background: L.oliveL, pointerEvents: 'none' }} />
            <div style={{ position: 'relative' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: L.olive, marginBottom: 14 }}>⚡ جرّب الآن</div>
              <h2 style={{ fontSize: 'clamp(20px,3vw,32px)', fontWeight: 700, color: L.fg1, marginBottom: 14, lineHeight: 1.25, letterSpacing: '-0.015em' }}>
                <AnimatedWords text="جرّب Treeelivine ERP بدون إنشاء حساب" />
              </h2>
              <p style={{ color: L.fg3, lineHeight: 1.7, marginBottom: 24, fontSize: 13 }}>بيانات تجريبية كاملة — عملاء، مشاريع، مهام، وفواتير — جاهزة فوراً.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <button onClick={handleDemo} disabled={demoLoading} className="btn-primary" style={{ opacity: demoLoading ? 0.75 : 1 }}>
                  {demoLoading ? 'جاري الفتح...' : 'ابدأ الديمو الآن'}
                </button>
                <Link href="/register" className="btn-secondary">إنشاء حساب</Link>
              </div>
            </div>
            <div style={{ background: L.bg, border: `1px solid ${L.border}`, borderRadius: 12, padding: 20, position: 'relative' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', color: L.olive, marginBottom: 16 }}>بيانات الدخول التجريبية</div>
              {[
                { label: 'البريد', value: 'demo@treeelivine.com' },
                { label: 'كلمة المرور', value: 'demo1234' },
                { label: 'الدور', value: 'Admin — صلاحيات كاملة' },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: L.surface, borderRadius: 6, fontSize: 13, marginBottom: 8 }}>
                  <span style={{ color: L.fg4 }}>{r.label}</span>
                  <span style={{ color: L.fg1, fontWeight: 600, direction: 'ltr', fontFamily: 'monospace', fontSize: 12 }}>{r.value}</span>
                </div>
              ))}
              <button onClick={handleDemo} disabled={demoLoading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 4, opacity: demoLoading ? 0.75 : 1 }}>
                {demoLoading ? 'جاري فتح الديمو...' : 'افتح الديمو →'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ TESTIMONIALS ═══════════════════ */}
      <section style={{ padding: 'clamp(56px,8vw,96px) clamp(16px,4vw,24px)', background: L.surface, borderTop: `1px solid ${L.border}`, borderBottom: `1px solid ${L.border}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="reveal-section" style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: L.olive, marginBottom: 14 }}>آراء العملاء</div>
            <h2 style={{ fontSize: 'clamp(22px,3.5vw,38px)', fontWeight: 700, color: L.fg1, letterSpacing: '-0.015em' }}>
              <AnimatedWords text="ماذا يقول مستخدمونا" />
            </h2>
          </div>
          <div className="cards-container testimonials-g" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
            {testimonials.map((t, i) => <TestimonialCard key={i} {...t} />)}
          </div>
        </div>
      </section>

      {/* ═══════════════════ FAQ ═══════════════════ */}
      <section id="faq" style={{ padding: 'clamp(56px,8vw,96px) clamp(16px,4vw,24px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="reveal-section" style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: L.olive, marginBottom: 14 }}>FAQ</div>
            <h2 style={{ fontSize: 'clamp(22px,3.5vw,38px)', fontWeight: 700, color: L.fg1, letterSpacing: '-0.015em' }}>
              <AnimatedWords text="أجوبة على أكثر الأسئلة شيوعاً" />
            </h2>
          </div>
          <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {faqs.map((f, i) => <FAQItem key={i} {...f} />)}
          </div>
        </div>
      </section>

      {/* ═══════════════════ FINAL CTA ═══════════════════ */}
      <section style={{ padding: 'clamp(72px,10vw,110px) clamp(16px,4vw,24px)', background: '#4f6831', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.06, pointerEvents: 'none' }}>
          <svg viewBox="0 0 800 400" style={{ width: '100%', height: '100%' }} fill="white">
            <circle cx={200} cy={100} r={180} />
            <circle cx={650} cy={320} r={220} />
          </svg>
        </div>
        <div className="reveal-section" style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'inline-block', padding: '4px 16px', borderRadius: 999, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', fontSize: 12, color: 'white', fontWeight: 500, marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            ابدأ الآن
          </div>
          <h2 style={{ fontSize: 'clamp(24px,4.5vw,46px)', fontWeight: 800, color: 'white', marginBottom: 16, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
            <AnimatedWords text="جاهز لإدارة شركتك بذكاء؟" />
          </h2>
          <p style={{ fontSize: 'clamp(14px,1.8vw,17px)', color: 'rgba(255,255,255,0.75)', maxWidth: 460, margin: '0 auto 36px', lineHeight: 1.7 }}>
            انضم إلى مئات الشركات التي تستخدم Treeelivine ERP لتبسيط عملياتها.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={handleDemo} disabled={demoLoading} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '14px 30px', background: 'white', color: '#4f6831', borderRadius: 10, fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer', opacity: demoLoading ? 0.75 : 1, transition: 'transform 0.12s', fontFamily: 'inherit' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'}>
              {demoLoading ? '...' : 'جرّب الديمو'}
            </button>
            <Link href="/register" style={{ display: 'inline-flex', alignItems: 'center', padding: '14px 28px', background: 'rgba(255,255,255,0.15)', color: 'white', borderRadius: 10, fontSize: 15, fontWeight: 600, border: '1px solid rgba(255,255,255,0.3)', textDecoration: 'none' }}>
              إنشاء حساب
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer style={{ borderTop: `1px solid ${L.border}`, padding: '40px clamp(16px,4vw,24px) 28px', background: L.surface }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="footer-g" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 32, marginBottom: 32 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <BrandMark size={22} />
                <span style={{ fontSize: 15, fontWeight: 700, color: L.fg1, letterSpacing: '-0.01em' }}>treeelivine</span>
              </div>
              <p style={{ color: L.fg4, fontSize: 13, lineHeight: 1.7, maxWidth: 220 }}>منصة ERP متكاملة لإدارة وكالات التسويق والشركات الخدمية.</p>
            </div>
            {[
              { title: 'المنتج',  links: [{ l: 'المميزات', h: '#features' }, { l: 'الوحدات', h: '#modules' }, { l: 'الأسعار', h: '#pricing' }, { l: 'FAQ', h: '#faq' }] },
              { title: 'الحساب', links: [{ l: 'تسجيل الدخول', h: '/login' }, { l: 'إنشاء حساب', h: '/register' }, { l: 'الديمو', h: '#pricing' }] },
              { title: 'الدعم',  links: [{ l: 'سياسة الخصوصية', h: '/privacy' }, { l: 'الشروط والأحكام', h: '/terms' }, { l: 'الدعم الفني', h: '/support' }] },
            ].map((col, i) => (
              <div key={i}>
                <p style={{ fontWeight: 600, fontSize: 11, color: L.fg3, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{col.title}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {col.links.map((lk, j) => <a key={j} href={lk.h} className="ln-link" style={{ padding: 0 }}>{lk.l}</a>)}
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: `1px solid ${L.border}`, paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ fontSize: 12, color: L.fg5 }}>© {new Date().getFullYear()} treeelivine ERP. جميع الحقوق محفوظة.</p>
            <div style={{ display: 'flex', gap: 16 }}>
              {[{ l: 'سياسة الخصوصية', h: '/privacy' }, { l: 'الشروط', h: '/terms' }].map((lk, i) => (
                <a key={i} href={lk.h} style={{ fontSize: 12, color: L.fg5, textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = L.fg3}
                  onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = L.fg5}
                >{lk.l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
