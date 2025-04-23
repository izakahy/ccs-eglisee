<template>
    <div v-if="!closed" class="bg-[#edc24c] text-gray-100 p-3 shadow-md relative">
      <div class="container mx-auto flex items-center justify-between flex-wrap md:flex-nowrap">
        <div class="flex items-center space-x-2 mb-2 md:mb-0">
          <h3 class="font-bold text-xl">{{ translateText('sundayService', props.sundayServiceMsg) }}</h3>
        </div>
        
        <div class="flex items-center font-bold space-x-2 mb-2 md:mb-0">
          <div class="text-center">
            <p class="text-sm">{{ translateText('nextService', props.nextServiceMsg) }}:</p>
          </div>
          <div class="font-mono text-lg text-[#347055] bg-white bg-opacity-20 px-3 py-1 rounded">
            {{ displayTime }}
          </div>
        </div>
        
        <div class="mb-2 md:mb-0">
          <button class="bg-white text-[#347055] px-5 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors duration-200 shadow-sm">
            {{ translateText('joinUs', props.joinMsg) }}
          </button>
        </div>
        
        <div>
          <button 
            @click="closeBanner"
            class="flex items-center justify-center bg-white w-8 h-8 text-black hover:bg-gray-200 transition-colors rounded-full shadow-sm"
            :title="translateText('toolTipMsg.close', 'Close')">
            <i class="fa-solid fa-x"></i>
          </button>
        </div>
      </div>
    </div>
  </template>
    
  <script setup>
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useLanguage } from '@/composables/useLanguage';
  
  const { t, locale } = useI18n();
  const { currentLocale, toggleLanguage, translateText } = useLanguage();
    
  const props = defineProps({
    nextServiceMsg: {
      type: String,
      default: 'Next service in',
      required: true
    },
    sundayServiceMsg: {
      type: String,
      default: 'Sunday Service',
      required: true
    },
    joinMsg: {
      type: String,
      default: 'Join Us Sunday at 10:00 AM',
      required: true
    },
    closable: {
      type: Boolean,
      default: true
    },
    persistClosed: {
      type: Boolean,
      default: true
    }
  });
    
  const closed = ref(false);
  const timeRemaining = ref({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  const persistedStateChecked = ref(false);
    
  const displayTime = computed(() => {
    const { days, hours, minutes, seconds } = timeRemaining.value;
    
    if (days > 0) {
      return `${days}${translateText('time.days', 'd')} ${hours}h ${minutes}${translateText('time.minutes','m')} ${seconds}s`;
    } else {
      return `${hours}h ${minutes}m ${seconds}s`;
    }
  });
    
  function getNextSunday() {
    const now = new Date();
    const today = now.getDay(); 
    
    let daysUntilSunday = 7 - today;
    if (today === 0) {
      if (now.getHours() < 10 || (now.getHours() === 10 && now.getMinutes() === 0 && now.getSeconds() === 0)) {
        daysUntilSunday = 0;
      } else {
        daysUntilSunday = 7; 
      }
    }
    
    const nextSunday = new Date(now);
    nextSunday.setDate(now.getDate() + daysUntilSunday);
    nextSunday.setHours(10, 0, 0, 0);
    
    return nextSunday;
  }
    
  function updateCountdown() {
    const now = new Date();
    const targetDate = getNextSunday();
    const diff = targetDate - now;
    
    if (diff <= 0) {
      updateCountdown();
      return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    timeRemaining.value = { days, hours, minutes, seconds };
  }
    
  function closeBanner() {
    closed.value = true;
    
    if (props.persistClosed) {
      localStorage.setItem('serviceBannerClosed', 'true');
    }
  }
    
  function checkPersistedState() {
    if (props.persistClosed) {
      const savedState = localStorage.getItem('serviceBannerClosed');
      if (savedState === 'true') {
        closed.value = true;
      }
    }
    persistedStateChecked.value = true;
  }
    
  let countdownInterval;
    
  onMounted(() => {
    checkPersistedState();
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
  });
    
  onBeforeUnmount(() => {
    if (countdownInterval) {
      clearInterval(countdownInterval);
    }
  });
  </script>