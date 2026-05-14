import { useSettings } from '../contexts/SettingsContext'
import ar from '../i18n/ar'
import en from '../i18n/en'

export function useTranslation() {
  const ctx = useSettings()
  const lang = ctx?.lang || 'ar'
  const t = lang === 'ar' ? ar : en
  return { t, lang }
}
