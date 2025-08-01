<script setup>
import { PhoneIcon, EnvelopeIcon, ClockIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/Auth';
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useLanguage } from '@/composables/useLanguage';


const { t, locale } = useI18n();
const { currentLocale, toggleLanguage, translateText } = useLanguage()
const authStore = useAuthStore();
const isLoggedIn = ref(false);
const currentYear = new Date().getFullYear();

onMounted(() => {
  isLoggedIn.value = authStore.checkAuth();
});

const capitalizeWordsAtIndices = (str, indices) => {
  const words = str.split(' ');
  indices.forEach(index => {
    if (words.length > index) {
      words[index] = words[index].charAt(0).toUpperCase() + words[index].slice(1);
    }
  });
  return words.join(' ');
}



const handleLogin = () => {
  authStore.googleLogin();
}
</script>

<template>
  <footer class="nav-gradient w-full py-12 text-gray-100">
    <div class="max-w-screen-xl mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-10">
        <!-- <div>
          <h3 class="text-white font-semibold text-lg mb-4">Communauté De La Compassion</h3>
          <p class="text-gray-300 text-sm leading-relaxed">
            Lorem ipsum dolor sit amet consectetur. Vitae vitae amet nunc orci sit pharetra adipiscing
          </p>
        </div> -->
        
        <div>
          <h3 class="text-white font-semibold text-lg mb-4">{{ translateText('contactUs', 'Contact Us')}}</h3>
          <div class="space-y-3">
            <div class="flex items-center space-x-3 group">
              <PhoneIcon class="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
              <p class="text-gray-300 group-hover:text-white transition-colors">506-588-7802</p>
            </div>
            
            <div class="flex items-center space-x-3 group">
              <EnvelopeIcon class="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
              <a href="mailto:INFO@CCS-EGLISE.ORG" class="text-gray-300 group-hover:text-white transition-colors">
                INFO@CCS-EGLISE.ORG
              </a>
            </div>
          </div>
        </div>
        
        <div>
          <h3 class="text-white font-semibold text-lg mb-4">
            {{ capitalizeWordsAtIndices(translateText('serviceTimes', 'Service Times 10:30 Am'), [0,1]) }}
          </h3>
          <div class="flex items-center space-x-3">
            <ClockIcon class="h-5 w-5 text-gray-400" />
            <p class="cursor-pointer text-gray-300 hover:text-white transition-colors">{{ translateText('everySunday', 'Every Sunday')}}</p>
          </div>
        </div>
        
        <div>
          <h3 class="text-white font-semibold text-lg mb-4">{{ translateText('connectWithUs', 'Connect With Us')}}</h3>
          <div class="flex space-x-4 mb-4">
            <a href="https://www.youtube.com/@CommunauteCompassionShediac" 
              target="_blank"
               class="text-gray-400 hover:text-[#FF0000] transition-colors">
              <i class="fa-brands fa-youtube text-3xl hover:-translate-y-1 transition-all ease-in-out"></i>
            </a>
            <a href="https://www.facebook.com/people/Communaut%C3%A9-de-la-Compassion-Shediac/61556619750757/"
              target="_blank" 
               class="text-gray-400 hover:text-[#1877F2] transition-colors">
              <i class="fa-brands fa-facebook text-3xl hover:-translate-y-1 transition-all ease-in-out"></i>
            </a>
          </div>
        </div>
      </div>
      
      <div class="pt-6 border-t border-gray-800">
        <div class="flex flex-col items-center text-center sm:text-left sm:items-start">
          <p class="text-gray-400 text-sm mb-2">
            &copy; {{ currentYear }} Communauté De La Compassion, Shediac
          </p>
          <a 
            @click="handleLogin" 
            class="text-gray-500 text-xs hover:text-gray-400 cursor-pointer transition-colors"
          >
            Admin
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.nav-gradient {
  position: sticky;
  top: -1px; /* Fixes 1px gap at top */
  background-color: #021a21; /* Base dark color */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: height, padding;
}

.nav-gradient::before,
.nav-gradient::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}


.nav-gradient::before {
  z-index: -1;
  background: 
    linear-gradient(
      45deg,
      rgba(3, 62, 63, 0.4) 0%,
      rgba(4, 78, 75, 0.4) 50%,
      rgba(2, 26, 33, 0.4) 100%
    ),
    radial-gradient(
      600px circle at 70% 50%,
      rgba(4, 78, 75, 0.5) 0%,
      transparent 70%
    ),
    radial-gradient(
      500px circle at 30% 50%,
      rgba(3, 62, 63, 0.5) 0%,
      transparent 70%
    );
}

/* Add a subtle noise texture overlay */
.nav-gradient::after {
  background: url('data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%" height="100%" filter="url(%23noise)" opacity="0.05"/%3E%3C/svg%3E');
  opacity: 0.15;
  mix-blend-mode: overlay;
}
</style>