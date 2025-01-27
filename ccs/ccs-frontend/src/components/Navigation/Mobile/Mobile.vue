<template>
    <div 
      class="md:hidden fixed top-[88px] z-10 right-0 h-[calc(100vh-88px)] w-full bg-black opacity-90 overflow-y-auto transform transition-transform duration-300 ease-in-out"
      :class="{ 'translate-x-0': isMenuOpen, 'translate-x-full': !isMenuOpen }"
    >
        <ul class="flex flex-col font-bold items-center mt-5 lg:mt-0 space-y-4 pt-4 text-3xl">
            <li class="relative">
              <!-- <div class="flex items-center cursor-pointer" @click="toggleSubmenu('home')">
                <a href="#about">ABOUT</a>
                <span class="ml-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 transition-transform duration-200"
                    :class="{ 'rotate-180': submenuOpen.home }"
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
              </div> -->
            </li>
            <li><RouterLink :to="{ name: 'posts' }">CONNECT</RouterLink></li>
            <li><RouterLink :to="{ name: 'create' }">EVENT</RouterLink></li>
            <li><a href="https://www.youtube.com/@CommunauteCompassionShediac">WATCH</a></li>
            <li><RouterLink :to="{ name: 'create' }">FORWARD</RouterLink></li>
            <li><RouterLink :to="{ name: 'create' }">GIVE</RouterLink></li>
        </ul>
    </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  isMenuOpen: {
    type: Boolean,
    required: true
  }
});

</script>