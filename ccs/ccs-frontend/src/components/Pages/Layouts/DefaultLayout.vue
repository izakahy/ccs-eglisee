<template>
    <div class="relative w-full overflow-hidden rounded-lg">
      <!-- Background image container -->
      <div class="relative h-64 md:h-96 w-full overflow-hidden">
        <div 
          v-html="contents.bgIMG" 
          class="editor-content w-full h-full object-cover bg-cover bg-center"
        ></div>
        <!-- Optional overlay to improve text visibility if needed -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>
      
      <!-- Text content container -->
      <div class="relative p-6 md:p-8 bg-white">
        <div 
          v-html="contents.content1" 
          class="editor-content prose prose-lg max-w-none"
        ></div>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps(['contents']);
  </script>
  
  <style scoped>
  /* You can add any additional custom styles here if needed */
  .editor-content :deep(h1) {
    @apply text-2xl md:text-3xl font-bold mb-4 text-gray-800;
  }
  
  .editor-content :deep(p) {
    @apply text-gray-600 leading-relaxed mb-4;
  }
  
  .editor-content :deep(a) {
    @apply text-blue-600 hover:underline;
  }
  </style>