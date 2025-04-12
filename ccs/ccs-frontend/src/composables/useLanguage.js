import { useI18n } from 'vue-i18n'
import { ref, watch } from 'vue'

export function useLanguage() {
  const { locale, t, te } = useI18n()
  const currentLocale = ref(locale.value)
  
  const toggleLanguage = () => {
    locale.value = locale.value === 'en' ? 'fr' : 'en'
    currentLocale.value = locale.value
    localStorage.setItem('userLanguage', locale.value)
  }
  
  // Watch for changes in locale from other components
  watch(() => locale.value, (newLocale) => {
    currentLocale.value = newLocale
  })
  
  const translateText = (key, fallback = key) => {
    if (!key || typeof key !== 'string') return fallback;
    
    return te(key) ? t(key) : fallback;
  }
  return {
    currentLocale,
    toggleLanguage,
    translateText
  }
}