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
    <NotFoundView v-else />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useNavigationStore } from '@/stores/NavItems/Navigation';
import NotFoundView from '@/views/NotFoundView.vue';

const route = useRoute()
const navStore = useNavigationStore()

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


defineProps({
    content: {
        type: String,
        default: ''
    }
})
</script>