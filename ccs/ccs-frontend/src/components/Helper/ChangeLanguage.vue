<template>
     <div class="relative text-sm">
      <button 
        @click="toggleLanguage" 
        class="flex items-center space-x-2 px-3 text-white bg-transparent hover:bg-blue-600 rounded-lg transition-all duration-200 ease-in-out"
        :title="locale === 'en' 
          ? `${translateText('toolTipMsg.frLabel', 'Switch to French')}` 
          : `${translateText('toolTipMsg.egLabel','Switch to English')}`"
      >
        <i class="fa-solid fa-language text-xl"></i>
        <span>{{ locale === 'en' ? 'EN' : 'FR' }}</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { useLanguage } from '@/composables/useLanguage';

const { locale } = useI18n();
const { toggleLanguage, translateText } = useLanguage()
</script>