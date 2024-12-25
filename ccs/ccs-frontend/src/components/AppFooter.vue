<script setup>
import { PhoneIcon, EnvelopeIcon, ClockIcon, HomeIcon } from '@heroicons/vue/24/outline'
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

      <div class="flex justify-end space-x-3">
        <p class="text-end text-sm">&copy; {{ new Date().getFullYear() }} Communauté De La Compassion, Shediac</p>
      </div>
    </div>
  </footer>
</template>