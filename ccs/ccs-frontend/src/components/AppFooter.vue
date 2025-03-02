<script setup>
import { PhoneIcon, EnvelopeIcon, ClockIcon, UserIcon } from '@heroicons/vue/24/outline'
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/Auth';

const authStore = useAuthStore();

const handleLogin = () => {
  if (authStore.checkAuth()) {
    alert("You are already logged in")
    return
  }
  authStore.googleLogin();
}
</script>

<template>
  <footer class="nav-gradient w-full p-8 text-gray-100">
    <div class="max-w-screen-xl mx-auto grid grid-rows-1 md:grid-rows-2 lg:grid-rows-4 gap-6">
      <div class="flex items-center space-x-3">
        <PhoneIcon class="h-5 w-5" />
        <p>506-588-7802</p>
      </div>
      
      <div class="flex items-center space-x-3">
        <EnvelopeIcon class="h-5 w-5" />
        <a href="mailto:INFO@CCS-EGLISE.ORG" class="hover:text-white transition-colors">INFO@CCS-EGLISE.ORG</a>
      </div>
      
      <div class="flex items-center space-x-3">
        <ClockIcon class="h-5 w-5" />
        <p>Every Sunday</p>
      </div>

      <div class="flex flex-col lg:flex-row md:justify-between lg:justify-between md:items-center lg:items-center text-gray-200 transition-all duration-500 ease-in-out">
        <div class="flex items-center space-x-2">
          <UserIcon class="h-5 w-5" />
          <a
          type="button" @click="handleLogin"
          class="text-gray-400 hover:text-white cursor-pointer active:text-yellow-300 active:font-bold transition duration-300">
              <p class="text-sm truncate">Admin</p>
          </a>  
        </div>
        <div class="">
          <p class="text-start md:text-end lg:text-end text-xs m-0">
            &copy; {{ new Date().getFullYear() }} Communauté De La Compassion, Shediac
          </p>
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