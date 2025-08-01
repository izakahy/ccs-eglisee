<script setup>
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useNavigationStore } from '@/stores/NavItems/Navigation'
import { updateDocumentTitle } from '@/router'

const i18n = useI18n()
const router = useRouter()
const navigationStore = useNavigationStore()
const { t, te } = useI18n();

watch(() => i18n.locale.value, (newLocale) => {
  navigationStore.updateTranslations()
  
  const currentRoute = router.currentRoute.value
  
  if (currentRoute.meta && currentRoute.meta.title) {
    const titleKey = `navigation.${currentRoute.meta.title}`
    currentRoute.meta.translatedTitle = te(titleKey) 
      ? t(titleKey) 
      : currentRoute.meta.title
  }
  
  updateDocumentTitle(currentRoute)
}, { immediate: true })
</script>

<template>
</template>