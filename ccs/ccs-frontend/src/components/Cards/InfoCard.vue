<template>
    <div class="max-w-4xl mx-auto text-center">
      <h2 class="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
        <span class="block">{{ ($te('serviceTimes') ? t('serviceTimes') : title).toUpperCase() }}</span>
      </h2>
      <p class="mt-4 text-xl font-semibold text-gray-600">
        {{ $te('address') ? $t('address') : title }}
      </p>
      <div class="mt-10">
        <button
          class="btn-secondary"
        >
          {{ $te('learnMore') ? t('learnMore') : 'Learn More'}}
        </button>
      </div>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { useLanguage } from '@/composables/useLanguage';

const { t, locale } = useI18n();
const { currentLocale, toggleLanguage } = useLanguage()


const props = defineProps({
  title: {
    type: String,
    default: 'SERVICE TIMES'
  },
  address: {
    type: String,
    default: '58 FESTIVAL STREET, SHEDIAC, NB E4P IS4'
  }
});
</script> 