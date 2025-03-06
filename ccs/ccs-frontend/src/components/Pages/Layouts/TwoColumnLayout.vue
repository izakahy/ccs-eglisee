<template>
    <div class="mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8" :class="{ 'max-w-6xl' : isAuthenticated }">
      <div class="md:col-span-2 bg-white shadow-md rounded-lg p-6">
        <div v-html="contents.content1" class="editor-content"></div>
      </div>
      <aside class="md:col-span-1 bg-gray-100  rounded-lg p-6">
        <div v-html="contents.content2" class="editor-content"></div>
      </aside>
    </div>
  </template>
  
<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/Auth';


const props = defineProps(['contents']);
const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.checkAuth());
</script>