import React, { createContext, useContext, useState, useEffect } from 'react'
import { getSettings } from '../api'

const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(null)
  const [lang, setLangState] = useState(localStorage.getItem('lang') || 'ar')
  const [theme, setThemeState] = useState(localStorage.getItem('theme') || 'light')

  useEffect(() => {
    getSettings().then(res => setSettings(res.data.data)).catch(() => {})
  }, [])

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
    localStorage.setItem('lang', lang)
  }, [lang])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const setLang = (l) => setLangState(l)
  const setTheme = (t) => setThemeState(t)

  return (
    <SettingsContext.Provider value={{ settings, setSettings, lang, setLang, theme, setTheme }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)
