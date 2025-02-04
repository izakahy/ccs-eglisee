<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="currentSection">
      <h1 class="text-4xl font-bold mb-8">{{ pageTitle }}</h1>
     
      <div class="prose max-w-none">
        <slot>
          <!-- Default content can be customized based on route -->
          <div v-if="content" v-html="content"></div>
          <div v-else class="text-gray-600">
            Content for {{ pageTitle }} will be added soon.
          </div>
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
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNavigationStore } from '@/stores/NavItems/Navigation';
import NotFoundView from '@/views/NotFoundView.vue';

const route = useRoute()
const router = useRouter()
const navStore = useNavigationStore()

const isNavigating = ref(false);

const currentSection = computed(() => {
    const path = route.path.split('/')[1];
    return navStore.routes[path]
})

const pageTitle = computed(() => {
    const pathParts = route.path.split('/')

    if (pathParts.length > 2) {
        const section = navStore.routes[pathParts[1]]
        const item = section?.items.find(item => item.path === route.path)

        return item?.label || ''
    }

    return currentSection.value?.label || ''
})

watch(currentSection, (newSection) => {
  if (!newSection) {
    isNavigating.value = true
    router.replace({ name: 'notFound' })
    isNavigating.value = false
  }
}), { immediate: true }

defineProps({
    content: {
        type: String,
        default: ''
    }
})
</script>