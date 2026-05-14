'use client'
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import ar from '@/i18n/ar'
import en from '@/i18n/en'

interface User {
  _id: string
  email: string
  name?: string
  role: string
  isActive: boolean
  referenceId?: string
  effectivePermissions: string[]
  isDemo?: boolean
}

interface AppContextType {
  user: User | null
  loading: boolean
  lang: string
  theme: string
  t: Record<string, any>
  settings: any
  setSettings: (s: any) => void
  setLang: (l: string) => void
  setTheme: (t: string) => void
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  hasPermission: (perm: string) => boolean
  setUser: (u: User | null) => void
}

const AppContext = createContext<AppContextType | null>(null)

function flattenTranslations(obj: Record<string, any>): Record<string, string> {
  const result: Record<string, string> = {}
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      result[key] = value
    } else if (typeof value === 'object' && value !== null) {
      for (const [subKey, subVal] of Object.entries(value)) {
        if (typeof subVal === 'string') {
          result[subKey] = subVal
          result[`${key}.${subKey}`] = subVal
        }
      }
    }
  }
  return result
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [lang, setLangState] = useState('ar')
  const [theme, setThemeState] = useState('dark')
  const [settings, setSettings] = useState<any>(null)

  useEffect(() => {
    const savedLang = localStorage.getItem('lang') || 'ar'
    const savedTheme = localStorage.getItem('theme') || 'dark'
    setLangState(savedLang)
    setThemeState(savedTheme)
    document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = savedLang
    document.documentElement.setAttribute('data-theme', savedTheme)
  }, [])

  useEffect(() => {
    fetch('/api/auth/session', { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setUser(data.user)
          fetch('/api/settings').then(r => r.json()).then(s => { if (s.success) setSettings(s.data) }).catch(() => {})
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const setLang = (l: string) => {
    setLangState(l)
    localStorage.setItem('lang', l)
    document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = l
  }

  const setTheme = (th: string) => {
    setThemeState(th)
    localStorage.setItem('theme', th)
    document.documentElement.setAttribute('data-theme', th)
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!data.success) return false
      setUser(data.user)
      fetch('/api/settings').then(r => r.json()).then(s => { if (s.success) setSettings(s.data) }).catch(() => {})
      return true
    } catch {
      return false
    }
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    setUser(null)
    setSettings(null)
  }

  const hasPermission = useCallback((perm: string) => {
    if (!user) return false
    if (user.role === 'admin') return true
    return (user.effectivePermissions || []).includes(perm)
  }, [user])

  const rawT = lang === 'ar' ? ar : en
  const t: Record<string, any> = flattenTranslations(rawT as any)

  return (
    <AppContext.Provider value={{ user, loading, lang, theme, t, settings, setSettings, setLang, setTheme, login, logout, hasPermission, setUser }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
