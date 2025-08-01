<template>
  <div :class="containerClass">
    <!-- Type 1: Simple Content Card -->
    <div v-if="type === 'content'" class="flex flex-col justify-evenly ps-3 min-h-[300px] md:min-h-[380px] lg:min-h-[510px]">
      <h1 id="about" class="h-about-pastor" :class="titleClass">{{ translateText('invitationCard.title.aboutPastor', title) }}</h1>
      
      <div class="pl-0 p-2">
        <slot></slot>
      </div>
      
      <div v-if="showButton" class="text-center lg:text-start transition duration-500 ease-in-out">
        <button class="btn-primary">
          {{ translateText('learnMore', buttonText ) }}
        </button>
      </div>
    </div>

    <!-- Type 2: Full-width Image -->
    <div v-else-if="type === 'image'" class="relative w-full h-64 md:h-96 lg:h-[32rem]">
      <img 
        class="absolute inset-0 w-full h-full object-cover" 
        :src="image" 
        :alt="imageAlt"
        loading="lazy"
      >
    </div>

    <div v-else-if="type === 'image-card'" 
         class="relative" 
         :class="[contentClass, getImageCardClass()]">
      <div class="relative z-10 flex justify-center items-center">
        <slot name="highlight-content"></slot>
      </div>
      
      <img 
        :class="['absolute inset-0 w-full object-cover blur-sm', locale === 'en' ? 'h-full' : 'h-auto']"
        :src="image" 
        :alt="imageAlt"
        loading="lazy"
      >
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { useLanguage } from '@/composables/useLanguage';
import { computed } from 'vue';

const i18n = useI18n();
const { t, te } = i18n;
const locale = computed(() => i18n.locale.value);
const { currentLocale, toggleLanguage, translateText } = useLanguage();

const props = defineProps({
  type: {
    type: String,
    default: 'content', // 'content' | 'image' | 'image-card'
    validator: (val) => ['content', 'image', 'image-card'].includes(val)
  },
  title: String,
  image: String,
  imageAlt: String,
  containerClass: String,
  contentClass: {
    type: String,
    default: 'p-8 sm:p-16 md:p-32 lg:p-48'
  },
  titleClass: String,
  showButton: Boolean,
  buttonText: {
    type: String,
    default: 'Learn more'
  }
});

const getImageCardClass = () => {
  if (locale.value === 'en') {
    return 'min-h-[200px] md:min-h-[250px] lg:min-h-[300px]';
  } else {
    return 'min-h-[240px] md:min-h-[280px] lg:min-h-[340px]';
  }
};
</script>