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
const isMenuOpen = ref(false)

// toggale
const toggleSubmenu = (key) => {
  submenuOpen.value[key] = !submenuOpen.value[key]
}

</script>

<template>
   <header class="w-full">
    <nav class="bg-black dark:bg-gray-900 p-4 md:p-7">
      <div class="max-w-screen-xl mx-auto text-white">
        <div class="flex items-center justify-between">
          <!-- Logo -->
          <div>
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
            <li class="relative">
              <div class="flex items-center cursor-pointer" @click="toggleSubmenu('home')">
                <a href="#about">ABOUT</a>
                <span class="ml-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 transition-transform duration-200"
                    :class="{'rotate-180': submenuOpen.home}"
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
            </li>
            <li><RouterLink :to="{ name: 'posts' }">CONNECT</RouterLink></li>
            <li><RouterLink :to="{ name: 'create' }">EVENT</RouterLink></li>
            <li><RouterLink :to="{ name: 'create' }">WATCH</RouterLink></li>
            <li><RouterLink :to="{ name: 'create' }">FORWARD</RouterLink></li>
            <li><RouterLink :to="{ name: 'create' }">GIVE</RouterLink></li>
          </ul>
        </div>

        <!-- Mobile Navigation -->
        <div 
          class="md:hidden transition-all duration-300 ease-in-out"
          :class="{'opacity-100 max-h-96': isMenuOpen, 'opacity-0 max-h-0 overflow-hidden': !isMenuOpen}"
        >
          <ul class="flex flex-col space-y-4 pt-4 text-xl">
            <li class="relative">
              <div class="flex items-center cursor-pointer" @click="toggleSubmenu('home')">
                <a href="#about">ABOUT</a>
                <span class="ml-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 transition-transform duration-200"
                    :class="{'rotate-180': submenuOpen.home}"
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
            </li>
            <li><RouterLink :to="{ name: 'posts' }">CONNECT</RouterLink></li>
            <li><RouterLink :to="{ name: 'create' }">EVENT</RouterLink></li>
            <li><RouterLink :to="{ name: 'create' }">WATCH</RouterLink></li>
            <li><RouterLink :to="{ name: 'create' }">FORWARD</RouterLink></li>
            <li><RouterLink :to="{ name: 'create' }">GIVE</RouterLink></li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>