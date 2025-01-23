<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/Auth';

const authStore = useAuthStore();

onMounted(() => {
    authStore.handleCallBack(); // Ensure this matches the method name in your store
});
</script>

<template>
    <div class="min-h-screen flex items-center justify-center">
        <div class="text-center">
            <h2 class="text-xl">Processing login...</h2>
            <div class="mt-4 text-red-600" v-if="authStore.errors.auth">
                {{ authStore.errors.auth }}
            </div>
        </div>
    </div>
</template>
