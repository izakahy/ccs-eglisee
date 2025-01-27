<template>
    <div :class="containerClass">
      <!-- Type 1: Simple Content Card -->
      <div v-if="type === 'content'" class="flex flex-col justify-evenly ps-3 min-h-[300px] md:min-h-[380px] lg:min-h-[510px]">
        <h1 class="h-about-pastor" :class="titleClass">{{ title }}</h1>
        
        <div class="pl-0 p-2">
          <slot></slot>
        </div>
  
        <div v-if="showButton" class="text-center lg:text-start transition duration-500 ease-in-out">
          <button class="btn-primary">
            {{ buttonText }}
          </button>
        </div>
      </div>
  
      <!-- Type 2: Full-width Image -->
      <div v-else-if="type === 'image'" class="relative w-full h-64 md:h-96 lg:h-[32rem]">
        <img 
          class="absolute inset-0 w-full h-full object-cover" 
          :src="image" 
          :alt="imageAlt"
          loading="lazy"
        >
      </div>
  
      <!-- Type 3: Image Background Card -->
      <div v-else-if="type === 'image-card'" class="relative" :class="contentClass">
        <div class="relative z-10 flex justify-center items-center">
          <slot name="highlight-content"></slot>
        </div>
        
        <img 
          class="absolute inset-0 w-full h-full object-cover blur-sm"
          :src="image" 
          :alt="imageAlt"
          loading="lazy"
        >
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    type: {
      type: String,
      default: 'content', // 'content' | 'image' | 'image-card'
      validator: (val) => ['content', 'image', 'image-card'].includes(val)
    },
    title: String,
    image: String,
    imageAlt: String,
    containerClass: String,
    contentClass: {
      type: String,
      default: 'p-8 sm:p-16 md:p-32 lg:p-48'
    },
    titleClass: String,
    showButton: Boolean,
    buttonText: {
      type: String,
      default: 'Learn more'
    }
  });
  </script>
  