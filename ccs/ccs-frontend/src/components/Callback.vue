<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/Auth';

const authStore = useAuthStore();

onMounted(() => {
    authStore.handleCallBack(); 
});
</script>

<template>
<div class="flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-[70%]">
      <div class="text-center">
        <h2 v-if="!authStore.alertMsg" class="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100">
          Processing login...
        </h2>
        <transition
          enter-active-class="transition ease-out duration-300"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-200"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <div 
            v-if="authStore.alertMsg"
            :class="[
              'mt-4 p-4 rounded-md shadow-md',
              authStore.alertType === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            ]"
          >
            <p class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center font-bold break-words">
              {{ authStore.alertMsg.split('+').join(" ") }}
            </p>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>
