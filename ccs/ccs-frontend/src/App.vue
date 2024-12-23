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

// toggale
const toggleSubmenu = (key) => {
  submenuOpen.value[key] = !submenuOpen.value[key]
}
</script>

<template>
  <header>
    <nav class="bg-black dark:bg-gray-50 p-7">
        <div class="max-w-screen-xl px-4 py-3 mx-auto text-white">
            <div class="flex items-center">
                <div>
                  <RouterLink :to="{ name: 'home' }" class="">
                     <img class=" img-fluid w-20" src="https://images.vexels.com/content/129738/preview/catholic-church-icon-2b5772.png" alt="church-logo" srcset="">
                  </RouterLink> 
                </div>
                <ul class="flex flex-row font-normal mt-0 space-x-8 ml-auto text-2xl">
                    <li class="relative">
                      <div class="flex items-center cursor-pointer" @click="toggleSubmenu('home')">
                      <RouterLink :to="{ name: 'home' }" class="">ABOUT</RouterLink> 
                      <span class="ml-2">
                      <!-- Toggle arrow icons -->
                      <svg
                        v-if="submenuOpen.home"
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 3a1 1 0 01.7.3l5 5a1 1 0 11-1.4 1.4L10 5.4 5.7 9.7a1 1 0 11-1.4-1.4l5-5A1 1 0 0110 3z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <svg
                        v-else
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 17a1 1 0 01-.7-.3l-5-5a1 1 0 011.4-1.4L10 14.6l4.3-4.3a1 1 0 011.4 1.4l-5 5a1 1 0 01-.7.3z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </span>
                  </div>
                    </li>
                    <li>
                      <RouterLink :to="{ name: 'posts' }" class="">CONNECT</RouterLink>
                    </li>
                    <li>
                      <RouterLink :to="{ name: 'create' }" class="">EVENT</RouterLink>
                    </li>
                    <li>
                      <RouterLink :to="{ name: 'create' }" class="">WATCH</RouterLink>
                    </li>
                    <li>
                      <RouterLink :to="{ name: 'create' }" class="">FORWARD</RouterLink>
                    </li>
                    <li>
                      <RouterLink :to="{ name: 'create' }" class="">GIVE</RouterLink>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
  </header>

  <RouterView />
</template>
