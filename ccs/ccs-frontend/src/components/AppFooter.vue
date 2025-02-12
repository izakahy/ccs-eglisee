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
  <footer class="bg-black w-full p-8 text-gray-100">
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