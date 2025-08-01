<template>
  <div class="max-w-4xl mx-auto py-8 bg-white" :class="{ 'px-6 shadow-md rounded-lg': isAuthenticated }">
    <div v-html="contents.content1" class="editor-content"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/Auth';

const props = defineProps(['contents']);

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.checkAuth());
</script>
