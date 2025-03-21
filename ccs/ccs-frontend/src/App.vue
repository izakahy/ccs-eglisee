<template>
  <div class="min-h-screen w-full flex flex-col">
    <AppHeader class="sticky w-full top-0 transition-all duration-300 z-[10]" />
    
    <!-- Loading Overlay -->
    <div v-if="!navStore.initialized" class="">
      <div class="flex flex-col items-center p-6 rounded-lg">
        <svg class="animate-spin h-12 w-12 text-indigo-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="mt-4 text-sm font-medium text-gray-700">Loading...</span>
      </div>
    </div>
    
    <main class="flex-grow">
      <RouterView />
    </main>
    <AppFooter class="w-full" />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import { useNavigationStore } from './stores/NavItems/Navigation';

const navStore = useNavigationStore();
</script>

<style>

</style>