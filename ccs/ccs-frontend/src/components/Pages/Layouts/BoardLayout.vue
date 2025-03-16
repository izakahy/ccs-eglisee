<template>
    <div class="relative w-full overflow-hidden">
        <div v-if="contents.bgIMG && contents.bgIMG.src" class="group relative w-full overflow-hidden h-[50dvh] shadow-lg">
        <div class="relative h-full w-full overflow-hidden">
            <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
            <img
            :src="contents.bgIMG.src"
            @load="loading = false"
            class="h-full w-full object-cover"
            :class="{ 'opacity-0': loading, 'opacity-100': !loading }"
            alt="Board of Directors"
            />
            <div class="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
        </div>
        <div class="absolute inset-0 flex items-center justify-center p-4">
            <div class="text-center space-y-4 max-w-3xl">
            <span v-if="contents.bgIMG.category" class="inline-block rounded-full bg-primary/90 px-4 py-1.5 text-sm font-medium text-white tracking-wider">
                {{ contents.bgIMG.category || "LEADERSHIP" }}
            </span>
            <h1 class="text-3xl font-bold text-white drop-shadow-md sm:text-4xl md:text-5xl lg:text-6xl">
                {{ contents.bgIMG.caption || "Board of Directors" }}
            </h1>
            <p v-if="contents.bgIMG.description" class="text-base text-gray-100 opacity-90 sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                {{ contents.bgIMG.description || "Meet the dedicated individuals who provide vision and guidance for our church community." }}
            </p>
            </div>
        </div>
        </div>
    
      <!-- Board Members Section -->
      <div class="relative mx-auto max-w-6xl py-16 px-6 md:px-8 bg-white">
        <div v-if="contents.content1" class="text-center mb-12">
            <div v-html="contents.content1" class="prose prose-lg max-w-none"></div>
        </div>
        
        <div class="flex flex-col gap-16">
          <div
            v-for="(item, index) in contents.boardItems"
            :key="index"
            class="flex flex-col md:flex-row gap-8 items-center"
            :class="{ 'md:flex-row-reverse': index % 2 !== 0 }"
          >
            <div class="w-full md:w-1/3 flex justify-center">
              <div class="relative">
                <div class="w-64 h-64 md:w-72 md:h-72 rounded-full overflow-hidden border-4 border-gray-100 shadow-lg">
                  <img
                    :src="item.pfp"
                    alt="Board member"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div class="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-primary text-white text-sm font-semibold py-2 px-6 rounded-full shadow-md">
                  {{ item.role }}
                </div>
              </div>
            </div>
            
            <div class="w-full md:w-2/3 text-center md:text-left" :class="{ 'md:text-right': index % 2 !== 0 }">
              <h3 class="text-2xl font-bold text-gray-800 mb-3">{{ item.name }}</h3>
              <div class="w-16 h-0.5 bg-primary mx-auto md:mx-0 mb-4" :class="{ 'md:ml-auto': index % 2 !== 0 }"></div>
              <p class="text-gray-600 leading-relaxed">
                {{ item.bio || "Serving with dedication and faith, bringing years of experience and a heart for ministry to our church community." }}
              </p>
              <div class="mt-6 space-x-3">
                <a v-if="item.email" :href="`mailto:${item.email}`" class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-600 hover:bg-primary hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>
                <a v-if="item.phone" :href="`tel:${item.phone}`" class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-600 hover:bg-primary hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
<!--         
        <div class="text-center mt-16">
          <a href="#contact" class="inline-block bg-primary hover:bg-primary-dark text-white font-medium py-3 px-8 rounded-full transition-colors shadow-md">
            Contact Our Leadership
          </a>
        </div> -->
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  defineProps(['contents']);
  defineExpose({ fullWidthLayout: true });
  
  const loading = ref(true);
  </script>
  
  <style scoped>
  .bg-primary {
    background-color: #3b5b92;
  }
  .bg-primary-dark {
    background-color: #2a4270;
  }
  .text-primary {
    color: #3b5b92;
  }
  .border-primary {
    border-color: #3b5b92;
  }
  .hover\:bg-primary-dark:hover {
    background-color: #2a4270;
  }
  </style>