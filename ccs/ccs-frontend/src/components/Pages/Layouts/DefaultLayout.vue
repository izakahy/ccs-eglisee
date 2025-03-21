<template>
  <div class="relative w-full overflow-hidden">
    <div class="group relative w-full overflow-hidden h-[62.5dvh] shadow-lg transition-all duration-300 hover:shadow-xl">
      <div class="relative h-full w-full overflow-hidden">
        <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
        
        <img 
          :src="contents.bgIMG?.src || contents.bgIMG" 
          @load="loading = false"
          class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          :class="{ 'opacity-0': loading, 'opacity-100': !loading }"
          alt="Featured image"
        />
        
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-80"></div>
      </div>

      <div 
        v-if="contents.bgIMG?.caption"
        class="absolute inset-0 flex items-center justify-center p-4 transition-all duration-300"
      >
        <div class="text-center space-y-3  px-6 py-4">
          <span v-if="contents.bgIMG?.category" class="inline-block rounded-full bg-primary/80 px-3 py-1 text-sm font-medium text-white">
            {{ contents.bgIMG.category }}
          </span>
          
          <h3 class="text-2xl font-bold  text-white drop-shadow-md sm:text-3xl md:text-4xl lg:text-6xl">
            {{ contents.bgIMG.caption }}
          </h3>
          
          <p v-if="contents.bgIMG?.description" class="text-base text-gray-200 opacity-90 sm:text-lg md:text-xl">
            {{ contents.bgIMG.description }}
          </p>
        </div>
      </div>
    </div>
    
    <div class="relative mx-auto max-w-7xl p-8 md:p-8 min-h-[50dvh] bg-white">
      <div 
        v-html="contents.content1" 
        class="editor-content prose prose-lg max-w-none"
      ></div>
    </div>
  </div>
</template>
  
<script setup>
import { ref } from 'vue';

  const props = defineProps(['contents']);

  const loading = ref(true);
  
  defineExpose({
    fullWidthLayout: true
  });
  </script>
  
  <style scoped>
  .editor-content :deep(h1) {
    @apply text-2xl md:text-3xl lg:text-6xl font-bold mb-4 text-gray-800;
  }
  
  .editor-content :deep(p) {
    @apply text-gray-600 text-lg leading-relaxed mb-4;
  }
  
  .editor-content :deep(a) {
    @apply text-blue-600 hover:underline;
  }
  </style>