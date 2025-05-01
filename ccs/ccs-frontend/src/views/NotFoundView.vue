<template>
    <div class="flex flex-col items-center justify-center  min-h-[80vh]">
        <h1 class="text-5xl font-bold text-center">{{ translateText("page.notFound", "Page not found (Error 404).")}}</h1>
        <div class="m-10">
            <RouterLink class="btn-primary" :to="{ name: 'home' }">{{ translateText("page.goHome", "Go Home")}}</RouterLink>
        </div>
    </div>
</template>
<script setup>
import { RouterLink } from 'vue-router';
import { useLanguage } from '@/composables/useLanguage';

const { translateText } = useLanguage();
</script>