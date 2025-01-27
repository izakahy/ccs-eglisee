<script setup>
import { RouterView } from 'vue-router'
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
</script>

<template>
    <div class="min-h-screen w-full flex flex-col">
        <AppHeader class="w-full" />
        <RouterView class="flex-grow w-full" />
        <AppFooter class="w-full"  />
    </div>
</template>
