<script setup>
import { ref, watch, computed, onUnmounted, onMounted  } from 'vue';
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/Auth';
import Logout from './Navigation/Auth/Logout.vue';
import Mobile from './Navigation/Mobile/Mobile.vue';
import Hamburger from './Navigation/Mobile/HamburgerMenu.vue';
import Desktop from './Navigation/Desktop/DesktopNavigation.vue';
import { useAboutStore } from '@/stores/NavItems/About';
import CountdownBanner from './Cards/CountdownBanner.vue';

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
let lastScrollY = ref(0);

const SCROLL_THRESHOLD = 20;
const TOP_THRESHOLD = 20;  
const DEBOUNCE_TIME = 50; 
const HYSTERESIS_BUFFER = 15; 

let scrollTimeout = null;
let ticking = false;
let transitionInProgress = false;
let transitionTimeout = null;


const handleScroll = () => {
  lastScrollY.value = window.scrollY;
  
  // Use requestAnimationFrame for smoother visual updates
  if (!ticking) {
    window.requestAnimationFrame(() => {
      if (!transitionInProgress) {
        updateNavState();
      }
      ticking = false;
    });
    ticking = true;
  }
};

const updateNavState = () => {
  // Clear any existing timeouts
  if (scrollTimeout) {
    window.clearTimeout(scrollTimeout);
  }
  
  scrollTimeout = window.setTimeout(() => {
    const currentScrollY = lastScrollY.value;
    
    // Apply different thresholds based on current state (hysteresis)
    if (isAtTop.value) {
      // When nav is expanded, require more scroll down to collapse
      if (currentScrollY > TOP_THRESHOLD + HYSTERESIS_BUFFER) {
        setNavState(false);
      }
    } else {
      // When nav is collapsed, require scrolling almost to top to expand
      if (currentScrollY < TOP_THRESHOLD - HYSTERESIS_BUFFER) {
        setNavState(true);
      }
    }
  }, DEBOUNCE_TIME);
};


const setNavState = (atTop) => {
  if (isAtTop.value === atTop) return;
  
  // Lock transitions to prevent multiple state changes during transition
  transitionInProgress = true;
  isAtTop.value = atTop;
  
  // Allow transitions again after animation completes
  // Add 50ms buffer to the duration to ensure transition completes
  if (transitionTimeout) {
    clearTimeout(transitionTimeout);
  }
  
  transitionTimeout = setTimeout(() => {
    transitionInProgress = false;
  }, 250); // Match to your CSS transition duration
};

let resizeObserver = null;

onMounted(() => {
  // Use passive listener for better performance
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Initial state check
  lastScrollY.value = window.scrollY;
  isAtTop.value = lastScrollY.value < TOP_THRESHOLD;
  
  // Optional: Reset on resize for consistent behavior
  resizeObserver = new ResizeObserver(() => {
    // Recalculate state after resize
    lastScrollY.value = window.scrollY;
    updateNavState();
  });
  
  resizeObserver.observe(document.documentElement);
});

// Cleanup on unmount
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  
  if (scrollTimeout) {
    window.clearTimeout(scrollTimeout);
  }
  
  if (transitionTimeout) {
    clearTimeout(transitionTimeout);
  }
  
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});

watch(isMenuOpen, (newValue) => {
  document.body.style.overflow = newValue ? 'hidden' : 'auto';
});
</script>

<template>
  <div class="header-wrapper">
    <CountdownBanner :persist-closed="false"/>
    <nav class="nav-gradient" :class="[
      'w-full top-0 z-[1000]',
      'transition-all duration-200 ease-out',
      isAtTop ? 'h-[140px] pt-4 pb-7 md:py-6 lg:py-6' : 'h-[60px] py-3 md:py-3'
    ]">
      <div class="max-w-screen-xl h-full mx-auto text-white relative z-10 px-4">
        <div class="flex items-center justify-between h-full">
          <RouterLink :to="{ name: 'home' }" class="flex items-center gap-1 h-full">
            <div class="flex items-center h-full gap-2">
              <img
                :src="isAtTop ? '/src/assets/img/CCS-Logo.svg' : '/src/assets/img/CCS-Logo-lineless.svg'"
                :class="[
                  'transition-all duration-200 ease-out',
                  isAtTop ? 'w-9 md:w-16 lg:w-16' : 'w-6 md:w-12 lg:w-12'
                ]"
                alt="church-logo"
              >

              <div class="flex flex-col justify-center h-full text-start overflow-hidden transition-all duration-200 ease-out"
                   :style="{
                     maxWidth: isAtTop ? '400px' : '0',
                     opacity: isAtTop ? '1' : '0',
                   }">
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

          <Logout 
            class="h-full flex items-center"
            :is-logged-in="isAuthenticated" 
            :username="authStore.user?.name || ''" 
            :on-logout="handleLogout" 
            :loading="authStore.isLoading" 
          />

          <Hamburger 
            class="h-full flex items-center"
            :is-open="isMenuOpen" 
            @toggle="isMenuOpen = !isMenuOpen" 
          />

          <Desktop 
            class="h-full flex items-center relative z-20"
            v-model="submenuOpen" 
            :about-items="aboutItems" 
          />
        </div>

        <Mobile 
          :is-menu-open="isMenuOpen" 
          :header-height="isAtTop ? 140 : 60" 
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
  will-change: height, padding, transform;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: top;
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

.nav-gradient {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
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
  margin-top: -1px;
  position: relative;
  z-index: 1;
}
</style>