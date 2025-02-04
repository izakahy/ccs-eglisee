<template>
    <li class="w-full">
      <div class="relative w-full">
        <div 
          class="block w-full py-2 text-center font-bold text-white text-2xl hover:bg-gray-700 cursor-pointer"
          @click="isOpen = !isOpen"
        >
          {{ label }}
          <svg
            class="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-transform"
            :class="{ 'rotate-180': isOpen }"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      <ul
        v-show="isOpen"
        class="w-full bg-gray-950 space-y-2 overflow-hidden transition-all duration-300 ease-in-out"
        :class="{ 'max-h-0': !isOpen, 'max-h-[500px] py-2': isOpen }"
      >
        <li v-for="item in items" :key="item.path" class="w-full">
          <RouterLink
            :to="item.path"
            class="block w-full py-2 text-center text-xl text-gray-300 hover:bg-gray-700"
            @click="$emit('close-menu')"
          >
            {{ item.label }}
          </RouterLink>
        </li>
      </ul>
    </li>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

defineProps({
  label: String,
  items: Array
})

const isOpen = ref(false)
defineEmits(['close-menu'])
</script>