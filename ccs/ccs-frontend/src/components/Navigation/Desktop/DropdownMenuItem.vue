<template>
    <li 
      class="relative"
      @mouseenter="$emit('update:isOpen', true)"
      @mouseleave="$emit('update:isOpen', false)"
    >
      <div class="flex items-center cursor-pointer">
        <a :href="href">{{ label }}</a>
        <span class="ml-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 transition-transform duration-200"
            :class="{'rotate-180': isOpen}"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
      </div>
  
      <!-- Dropdown Menu -->
      <div 
        v-if="isOpen"
        class="absolute z-10 left-0 -translate-x-2 bg-black divide-y rounded-lg shadow w-44 dark:bg-gray-700"
      >
        <div class="absolute w-full h-2 -top-2"></div>
        <ul class="py-2 text-base text-white font-semibold dark:text-gray-200">
          <li v-for="item in items" :key="item.path">
            <RouterLink 
              :to="item.path"
              class="block px-4 py-2 hover:bg-gray-800"
            >
              {{ item.label }}
            </RouterLink>
          </li>
        </ul>
      </div>
    </li>
  </template>
  
  <script setup>
  import { RouterLink } from 'vue-router'
  
  defineProps({
    label: {
      type: String,
      required: true
    },
    href: {
      type: String,
      required: true
    },
    isOpen: {
      type: Boolean,
      required: true
    },
    items: {
      type: Array,
      required: true
    }
  })
  
  defineEmits(['update:isOpen'])
  </script>