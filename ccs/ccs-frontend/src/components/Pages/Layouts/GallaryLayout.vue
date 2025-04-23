<template>
  <div class="mx-auto">
    <!-- Gallery Header Section -->
    <div class="text-center">
      <div v-if="contents.bgIMG && contents.bgIMG.src" class="mb-8 relative overflow-hidden">
        <img :src="contents.bgIMG.src" alt="Gallery Header" class="w-full h-64 md:h-96 object-cover" />
        <div v-if="contents.bgIMG.caption" class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-3">
          {{ contents.bgIMG.caption }}
        </div>
      </div>  
      
      <!-- Main Content/Description Area -->
      <div v-if="contents.content1 && contents.content1.replace(/<[^>]*>/g, '').trim() !== ''" class="max-w-3xl mx-auto">
        <span>{{ console.log() }}</span>
        <div v-html="contents.content1" class="editor-content prose lg:prose-xl mx-auto"></div>
      </div>
    </div>
    
    <!-- Gallery Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 m-4">
      <div 
        v-for="(item, index) in contents.galleryItems" 
        :key="index" 
        class="group relative overflow-hidden rounded-lg shadow-md cursor-pointer transition-transform hover:scale-[1.02]"
        @click="openLightbox(index)"
      >
        <img 
          :src="item.image" 
          :alt="item.title || 'Gallery image'" 
          class="w-full h-64 object-cover" 
          loading="lazy"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div class="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 v-if="item.title" class="font-semibold text-lg mb-1">{{ item.title }}</h3>
            <p v-if="item.description" class="text-sm opacity-90">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Scripture Quote (Optional) -->
    <div v-if="contents.scripture && contents.scripture.verse" class="mt-12 bg-indigo-50 border border-indigo-100 rounded-xl p-6 text-center max-w-4xl mx-auto">
      <p class="italic text-indigo-800 font-light text-lg">"{{ contents.scripture.verse }}"</p>
      <p class="text-indigo-600 text-sm mt-2">— {{ contents.scripture.reference }}</p>
    </div>
    
    <!-- Lightbox Modal -->
    <div 
      v-if="isLightboxOpen" 
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
      @click.self="closeLightbox"
    >
      <div class="relative w-full max-w-6xl">
        <!-- Close Button -->
        <button 
          @click="closeLightbox" 
          class="absolute top-4 right-4 z-50 bg-white/10 hover:bg-white/20 rounded-full p-2 text-white"
          aria-label="Close lightbox"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <!-- Carousel Navigation -->
        <button 
          @click="prevImage" 
          class="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-white/10 hover:bg-white/20 rounded-full p-2 text-white"
          aria-label="Previous image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button 
          @click="nextImage" 
          class="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-white/10 hover:bg-white/20 rounded-full p-2 text-white"
          aria-label="Next image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        <!-- Current Image -->
        <div class="h-[70vh] flex items-center justify-center">
          <img 
            :src="currentImage.image" 
            :alt="currentImage.title || 'Gallery image'" 
            class="max-h-full max-w-full object-contain"
          />
        </div>
        
        <!-- Caption -->
        <div v-if="currentImage.title || currentImage.description" class="mt-4 text-center text-white p-4">
          <h3 v-if="currentImage.title" class="font-semibold text-xl">{{ currentImage.title }}</h3>
          <p v-if="currentImage.description" class="text-gray-300 mt-2">{{ currentImage.description }}</p>
        </div>
        
        <!-- Image Counter -->
        <div class="text-white text-center mt-2 text-sm">
          {{ currentImageIndex + 1 }} / {{ contents.galleryItems?.length || 0 }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '@/stores/Auth';

const props = defineProps(['contents']);
const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.checkAuth());

// Lightbox state
const isLightboxOpen = ref(false);
const currentImageIndex = ref(0);

const currentImage = computed(() => {
  if (!props.contents.galleryItems || !props.contents.galleryItems.length) {
    return { image: '', title: '', description: '' };
  }
  return props.contents.galleryItems[currentImageIndex.value] || { image: '', title: '', description: '' };
});

const openLightbox = (index) => {
  if (props.contents.galleryItems && props.contents.galleryItems.length > index) {
    currentImageIndex.value = index;
    isLightboxOpen.value = true;
    // Prevent body scrolling when lightbox is open
    document.body.style.overflow = 'hidden';
  }
};

const closeLightbox = () => {
  isLightboxOpen.value = false;
  // Restore body scrolling
  document.body.style.overflow = '';
};

const nextImage = () => {
  if (!props.contents.galleryItems || !props.contents.galleryItems.length) return;
  currentImageIndex.value = (currentImageIndex.value + 1) % props.contents.galleryItems.length;
};

const prevImage = () => {
  if (!props.contents.galleryItems || !props.contents.galleryItems.length) return;
  currentImageIndex.value = (currentImageIndex.value - 1 + props.contents.galleryItems.length) % props.contents.galleryItems.length;
};

// Listen for keyboard navigation
const handleKeyDown = (e) => {
  if (!isLightboxOpen.value) return;
  
  if (e.key === 'ArrowRight') {
    nextImage();
  } else if (e.key === 'ArrowLeft') {
    prevImage();
  } else if (e.key === 'Escape') {
    closeLightbox();
  }
};

// Add and remove event listeners
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
  // Make sure to restore body scrolling if component is unmounted while lightbox is open
  document.body.style.overflow = '';
});
</script>

<style scoped>
.editor-content :deep(h1) {
  @apply text-3xl font-bold text-indigo-900 mb-4;
}
.editor-content :deep(h2) {
  @apply text-2xl font-semibold text-indigo-800 mb-3;
}
.editor-content :deep(p) {
  @apply text-gray-700 mb-4;
}
</style>