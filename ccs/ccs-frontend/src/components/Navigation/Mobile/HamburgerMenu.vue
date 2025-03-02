<template>
    <button
      class="lg:hidden relative w-10 h-10 text-white focus:outline-none"
      @click="$emit('toggle')"
      aria-label="Toggle menu"
    >
      <div class="absolute w-6 transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
        <span
          class="absolute h-0.5 w-6 bg-white transform transition duration-300 ease-in-out"
          :class="{'rotate-45': isOpen, '-translate-y-1.5': !isOpen}"
        ></span>
        <span
          class="absolute h-0.5 w-6 bg-white transform transition-all duration-200 ease-in-out"
          :class="{'opacity-0': isOpen}"
        ></span>
        <span
          class="absolute h-0.5 w-6 bg-white transform transition duration-300 ease-in-out"
          :class="{'-rotate-45': isOpen, 'translate-y-1.5': !isOpen}"
        ></span>
      </div>
    </button>
  </template>
  
  <script setup>
  defineProps({
    isOpen: {
      type: Boolean,
      required: true
    }
  })
  
  defineEmits(['toggle'])
  </script>