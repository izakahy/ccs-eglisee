import { useI18n } from 'vue-i18n'
import { ref, watch } from 'vue'
import { useNavigationStore } from '@/stores/NavItems/Navigation'
import { useRouter } from 'vue-router'
import { updateDocumentTitle } from '@/router'

export function useLanguage() {
  const { locale, t, te } = useI18n()
  const currentLocale = ref(locale.value)
  const router = useRouter()
  
  const toggleLanguage = () => {
    locale.value = locale.value === 'en' ? 'fr' : 'en'
    currentLocale.value = locale.value
    localStorage.setItem('userLanguage', locale.value)
    
    updateDocumentTitle(router.currentRoute.value)
  }
  
  watch(() => locale.value, (newLocale) => {
    currentLocale.value = newLocale
  })
  
  const translateText = (key, fallback = key, params = {}) => {
    if (!key || typeof key !== 'string') return fallback;
    
    return te(key) ? t(key, params) : fallback;
  }
  
  return {
    currentLocale,
    toggleLanguage,
    translateText
  }
}