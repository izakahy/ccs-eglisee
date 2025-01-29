<template>
    <div v-if="currentPage">
        <h1>{{ currentPage.label }}</h1>
        <div>
        <!-- Add your about page content here -->
        <p>This is the {{ currentPage.label }} page</p>
        </div>
    </div>
    <div v-else>
      <h1>Page not found</h1>
    </div>
</template>


<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router';
import { useAboutStore } from '@/stores/NavItems/About';

const route = useRoute();
const aboutStore = useAboutStore();

const currentPage = computed(() => {
    const pagePath = `/about/${route.params.page}`
    return aboutStore.items.find(item => item.path === pagePath)
});
</script>