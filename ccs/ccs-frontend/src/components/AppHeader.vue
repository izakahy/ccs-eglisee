<script setup>
import { ref, watch, computed } from 'vue';
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/Auth';
import Logout from './Navigation/Auth/Logout.vue';
import Mobile from './Navigation/Mobile/Mobile.vue';
import Hamburger from './Navigation/Mobile/HamburgerMenu.vue';
import Desktop from './Navigation/Desktop/DesktopNavigation.vue';
import { useAboutStore } from '@/stores/NavItems/About';

const authStore = useAuthStore();
const aboutStore = useAboutStore();

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
const aboutItems = computed(() => 
  aboutStore.items.map(item => ({
    ...item,
    href: item.path
  }))
)

// Logout function
const handleLogout = async () => {
    if (authStore.checkAuth()) {
      await authStore.logout(); 
      alert('Seccessfully logged out!')
    }
};

const isAuthenticated = computed(() => authStore.checkAuth());

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

          <Logout 
            :is-logged-in="isAuthenticated"
            :username="authStore.user?.name || ''"
            :on-logout="handleLogout"
            :loading="authStore.isLoading"
          />

          <!-- Hamburger Menu Button -->
          <Hamburger 
            :is-open="isMenuOpen"
            @toggle="isMenuOpen = !isMenuOpen"
          />

          <!-- Desktop Navigation -->
          <Desktop
            v-model="submenuOpen"
            :about-items="aboutItems" 
          />
        </div>
        
        <!-- Mobile Navigation -->
        <Mobile 
          :is-menu-open="isMenuOpen"
          @close-menu="isMenuOpen = false"
        />
      </div>
    </nav>
  </header>
</template>