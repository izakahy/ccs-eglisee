<script setup>
import { ref, watch, computed, onUnmounted, onMounted  } from 'vue';
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


const isAtTop = ref(true);
let lastScrollY = ref(window.scrollY);
const SCROLL_DELTA = 5;
const TOP_BUFFER = 20; 
const THRESHOLD_BUFFER = 10; // Buffer to prevent flickering near threshold
let scrollTimeout = null;

const handleScroll = () => {
  // Clear existing timeout
  if (scrollTimeout) {
    window.clearTimeout(scrollTimeout);
  }

  // Set new timeout
  scrollTimeout = window.setTimeout(() => {
    const currentScrollY = window.scrollY;
    
    // Only update if we've moved significantly from last position
    if (Math.abs(currentScrollY - lastScrollY.value) < SCROLL_DELTA) return;

    // Add hysteresis to prevent flickering near the threshold
    if (isAtTop.value) {
      // When nav is expanded, require more scroll to collapse
      if (currentScrollY > TOP_BUFFER + THRESHOLD_BUFFER) {
        isAtTop.value = false;
      }
    } else {
      // When nav is collapsed, require scrolling almost to top to expand
      if (currentScrollY < TOP_BUFFER - THRESHOLD_BUFFER) {
        isAtTop.value = true;
      }
    }
    
    lastScrollY.value = currentScrollY;
  }, 10); // Increased debounce time for more stability
};


onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  if (scrollTimeout) {
    window.clearTimeout(scrollTimeout);
  }
});

watch(isMenuOpen, (newValue) => {
  document.body.style.overflow = newValue ? 'hidden' : 'auto';
});
</script>

<template>
  <div class="header-wrapper">
    <nav class="nav-gradient" :class="[
      'w-full top-0 z-[1000]',
      'transition-[height,padding] cubic-bezier(0.4, 0, 0.2, 1) duration-200',
      isAtTop ? 'h-[140px] pt-4 pb-7 md:py-6 lg:py-6' : 'h-[60px] py-3 md:py-3'
    ]">
      <div class="max-w-screen-xl h-full mx-auto text-white relative z-10 px-4">
        <div class="flex items-center justify-between h-full">
          <!-- Logo with smooth transitions -->
          <RouterLink :to="{ name: 'home' }" class="flex items-center gap-1 transition-all duration-300 h-full">
            <div class="flex items-center h-full">
              <img
                :src="isAtTop ? '/src/assets/img/CCS-Logo.svg' : '/src/assets/img/CCS-Logo-lineless.svg'"
                :class="[
                  'transition-all duration-300',
                  isAtTop ? 'w-9 md:w-16 lg:w-16' : 'w-6 md:w-12 lg:w-12'
                ]"
                alt="church-logo"
              >
              <!-- Text with opacity transition -->
              <div class="flex flex-col justify-center h-full text-start overflow-hidden transition-all duration-300"
                  :class="isAtTop ? 'max-w-[400px] opacity-100' : 'max-w-0 opacity-0'">
                <div class="font-['Cinzel'] whitespace-nowrap lg:text-base">
                  <p class="text-[0.58rem] md:text-base lg:text-lg xl:text-xl leading-tight">
                    COMMUNAUTÉ DE LA
                  </p>
                  <p class="text-[0.58rem] md:text-base lg:text-lg xl:text-xl leading-tight">
                    <span class="text-[#fbd160] font-['Quintessential']">COMPASSION,</span> SHEDIAC
                  </p>
                </div>
              </div>
            </div>
          </RouterLink>

          <!-- Login component with height inheritance -->
          <Logout 
            class="h-full flex items-center"
            :is-logged-in="isAuthenticated" 
            :username="authStore.user?.name || ''" 
            :on-logout="handleLogout" 
            :loading="authStore.isLoading" 
          />

          <!-- Hamburger Menu Button with height inheritance -->
          <Hamburger 
            class="h-full flex items-center"
            :is-open="isMenuOpen" 
            @toggle="isMenuOpen = !isMenuOpen" 
          />

          <!-- Desktop Navigation with height inheritance -->
          <Desktop 
            class="h-full flex items-center relative z-20"
            v-model="submenuOpen" 
            :about-items="aboutItems" 
          />
        </div>

        <!-- Mobile Navigation -->
        <Mobile 
          :is-menu-open="isMenuOpen" 
          :header-height="isAtTop ? 88 : 60" 
          @close-menu="isMenuOpen = false"
        />
      </div>
    </nav>
  </div>
</template>


<style scoped>
.header-wrapper {
  @apply sticky top-0;
}

.nav-gradient {
  position: sticky;
  top: -1px; /* Fixes 1px gap at top */
  background-color: #021a21; /* Base dark color */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: height, padding;
}

.nav-gradient::before,
.nav-gradient::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}


.nav-gradient::before {
  z-index: -1;
  background: 
    radial-gradient(
      800px circle at 50% 40%,
      rgba(4, 78, 75, 0.9) 0%,
      rgba(3, 62, 63, 0.8) 25%,
      rgba(2, 26, 33, 0.6) 50%,
      rgba(2, 26, 33, 0.4) 75%,
      rgba(2, 26, 33, 0.2) 100%
    ),
    linear-gradient(
      45deg,
      rgba(3, 62, 63, 0.4) 0%,
      rgba(4, 78, 75, 0.4) 50%,
      rgba(2, 26, 33, 0.4) 100%
    ),
    radial-gradient(
      600px circle at 70% 50%,
      rgba(4, 78, 75, 0.5) 0%,
      transparent 70%
    ),
    radial-gradient(
      500px circle at 30% 50%,
      rgba(3, 62, 63, 0.5) 0%,
      transparent 70%
    );
}

/* Add a subtle noise texture overlay */
.nav-gradient::after {
  background: url('data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noise)" opacity="1"/%3E%3C/svg%3E');
  opacity: 0.15;
  mix-blend-mode: overlay;
}

:deep(.router-view-container) {
  margin-top: -1px; /* Fixes 1px gap during transition */
}
</style>