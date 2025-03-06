<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="currentSection">
      <h1 v-if="!hasContent" class="text-4xl font-bold mb-8">{{ pageTitle }}</h1>
     
      <div class="prose max-w-none">
        <slot>
          <!-- Default content can be customized based on route -->
          <PageEditor v-if="hasContent" />
          
          <slot v-else>
            <div v-if="content" v-html="content"></div>
            <div v-else class="text-gray-600">
              Content for {{ pageTitle }} will be added soon.
            </div>
            <PageEditor v-if="isAuthenticated || hasContent"/>
          </slot>
        </slot>
      </div>
    </div>

    <div v-else-if="!isNavigating">
      <NotFoundView />
    </div>

    <div v-else class="text-center py-8">
      <!-- Loading spinner -->
      <svg class="animate-spin h-8 w-8 text-gray-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNavigationStore } from '@/stores/NavItems/Navigation';
import { useContentStore } from '@/stores/Content';
import NotFoundView from '@/views/NotFoundView.vue';
import PageEditor from './PageEditor.vue';
import { useAuthStore } from '@/stores/Auth';
import layouts from '@/stores/layout';

const route = useRoute();
const router = useRouter();
const navStore = useNavigationStore();
const contentStore = useContentStore()
const authStore = useAuthStore()
const loading = ref(true);
const isNavigating = ref(false);
const retryCount = ref(0);
const maxRetries = 3;

defineProps({
    content: {
        type: String,
        default: ''
    }
});

const isAuthenticated = computed(() => authStore.checkAuth())
const currentPath = computed(() => route.path)
const hasContent = computed(() => {
  return contentStore.getPageContent(currentPath.value)
})

const currentSection = computed(() => {
    const path = route.path.split('/')[1];
    return navStore.routes[path];
});

const pageTitle = computed(() => {
    const pathParts = route.path.split('/');
    if (pathParts.length > 2) {
        const item = currentSection.value?.items?.find(
            item => item.path === route.path
        );
        return item?.label || '';
    }
    return currentSection.value?.label || '';
});

const checkRouteValidity = async () => {
  loading.value = true;
  isNavigating.value = true;
  
  try {
    // Only fetch if not already loaded
    if (!navStore.initialized) {
      await navStore.getSection();
    }
    
    // Get the section key from the path
    const sectionKey = route.path.split('/')[1];
    
    // Check if the section exists
    if (!navStore.routes[sectionKey]) {
      // Retry a few times with delay before giving up
      if (retryCount.value < maxRetries) {
        retryCount.value++;
        await new Promise(resolve => setTimeout(resolve, 300));
        loading.value = false;
        isNavigating.value = false;
        return checkRouteValidity();
      }
      
      console.log(`Section not found after retries: ${sectionKey}`);
      router.replace({ name: 'notFound' });
      return;
    }
    
    // For item routes, check if the item exists
    if (route.path.split('/').length > 2) {
      const itemExists = navStore.routes[sectionKey]?.items?.some(
        item => item.path === route.path
      );
      
      if (!itemExists) {
        console.log(`Item not found in section ${sectionKey}: ${route.path}`);
        router.replace({ name: 'notFound' });
        return;
      }
    }
  } catch (error) {
    console.error('Route validation error:', error);
    // Only redirect if we're not already on notFound
    if (route.name !== 'notFound') {
      router.replace({ name: 'notFound' });
    }
  } finally {
    loading.value = false;
    isNavigating.value = false;
    retryCount.value = 0;
  }
};

onMounted(async () => {
  await checkRouteValidity();
  await contentStore.loadPageContent()
});


watch(() => route.path, checkRouteValidity);

// Only check after initialization
watch(() => navStore.initialized, (initialized) => {
    if (initialized) checkRouteValidity();
});
</script>