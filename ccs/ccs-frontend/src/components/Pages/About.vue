<template>
  <div v-if="currentPage">
    <!-- Outer container to center everything vertically and horizontally -->
    <div class="flex flex-col items-center justify-center min-h-[80vh]">
            <div>
                <h1 class="text-5xl font-extrabold text-center">{{ currentPage.label }}</h1>
            </div>
            <!-- Content Section -->
            <div class="mt-4">
                <p class="text-center text-md">This is the {{ currentPage.label }} page</p>
            </div>
        </div>
    </div>
    <NotFoundView v-else />
</template>


<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router';
import { useAboutStore } from '@/stores/NavItems/About';
import NotFoundView from '@/views/NotFoundView.vue';

const route = useRoute();
const aboutStore = useAboutStore();

const currentPage = computed(() => {
    const pagePath = `/about/${route.params.page}`
    return aboutStore.items.find(item => item.path === pagePath)
});
</script>