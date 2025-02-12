<template>
    <div class="flex flex-col items-center justify-center  min-h-[80vh]">
        <h1 class="text-5xl font-bold text-center">Oops 404, Page not found</h1>
        <div class="m-10">
            <RouterLink class="btn-primary" :to="{ name: 'home' }">Go Home</RouterLink>
        </div>
    </div>
</template>
<script setup>
import { RouterLink } from 'vue-router';
</script>