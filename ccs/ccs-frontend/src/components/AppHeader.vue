<script setup>
import { ref, watch } from 'vue';
import { RouterLink, RouterView } from 'vue-router'

// Track which submenu is open
const submenuOpen = ref({
  about: false,
  connect: false,
  event: false,
  watch: false,
  forward: false,
  give: false
});
const isMenuOpen = ref(false);
const aboutItems = [
  { label: 'Our Story', path: '/about/story' },
  { label: 'Mission', path: '/about/mission' },
  { label: 'Team', path: '/about/team' }
]

// toggale
const toggleSubmenu = (key) => {
  submenuOpen.value[key] = !submenuOpen.value[key]
}



watch(isMenuOpen, (newValue) => {
  document.body.style.overflow = newValue ? 'hidden' : 'auto';
});

</script>

<template>
   <header class="w-full">
    <nav class="bg-black dark:bg-gray-900 p-4 md:p-7">
      <div class="max-w-screen-xl mx-auto text-white">
        <div class="flex items-center justify-between">
          <!-- Logo -->
          <div class="text-center">
            <RouterLink :to="{ name: 'home' }" class="block">
              <img 
                class="w-16 md:w-20" 
                src="https://images.vexels.com/content/129738/preview/catholic-church-icon-2b5772.png" 
                alt="church-logo"
              >
            </RouterLink>
          </div>

          <!-- Hamburger Menu Button -->
          <button 
            class="md:hidden relative w-10 h-10 text-white focus:outline-none"
            @click="isMenuOpen = !isMenuOpen"
            aria-label="Toggle menu"
          >
            <div class="absolute w-6 transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
              <span 
                class="absolute h-0.5 w-6 bg-white transform transition duration-300 ease-in-out"
                :class="{'rotate-45': isMenuOpen, ' -translate-y-1.5': !isMenuOpen}"
              ></span>
              <span 
                class="absolute h-0.5 w-6 bg-white transform transition-all duration-200 ease-in-out"
                :class="{'opacity-0': isMenuOpen}"
              ></span>
              <span 
                class="absolute h-0.5 w-6 bg-white transform transition duration-300 ease-in-out"
                :class="{'-rotate-45': isMenuOpen, 'translate-y-1.5': !isMenuOpen}"
              ></span>
            </div>
          </button>

          <!-- Desktop Navigation -->
          <ul class="hidden md:flex space-x-8 text-2xl">
            <li 
              class="relative"
              @mouseenter="submenuOpen.about = true"
              @mouseleave="submenuOpen.about = false"  
            >
              <div class="flex items-center cursor-pointer">
                <a href="#about">ABOUT</a>
                <span class="ml-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 transition-transform duration-200"
                    :class="{'rotate-180': submenuOpen.about}"
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
              <div v-if="submenuOpen.about" 
                class="absolute z-10 left-0 -translate-x-2  bg-black divide-y  rounded-lg shadow w-44 dark:bg-gray-700">
                <div class="absolute w-full h-2 -top-2"></div>
                <ul class="py-2 text-base text-white font-semibold dark:text-gray-200">
                    <li v-for="item in aboutItems" :key="item.path">
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
            <li><RouterLink :to="{ name: 'posts' }">CONNECT</RouterLink></li>
            <li><RouterLink :to="{ name: 'create' }">EVENT</RouterLink></li>
            <li><a target="_blank" href="https://www.youtube.com/@CommunauteCompassionShediac">WATCH</a></li>
            <li><RouterLink :to="{ name: 'create' }">FORWARD</RouterLink></li>
            <li><RouterLink :to="{ name: 'create' }">GIVE</RouterLink></li>
          </ul>
        </div>

        <!-- Mobile Navigation -->
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
      </div>
    </nav>
  </header>
</template>