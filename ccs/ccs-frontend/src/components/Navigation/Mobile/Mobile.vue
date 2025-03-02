<template>
  <div 
    class="md:hidden fixed z-10 right-0 w-full nav-gradient-mobile overflow-y-auto transform transition-transform duration-300 ease-in-out"
    :style="{ 
      top: headerHeight + 'px',
      height: `calc(100dvh - ${headerHeight}px)`
    }"
    :class="{ 'translate-x-0': isMenuOpen, 'translate-x-full': !isMenuOpen }"
  >
    <transition :name="transitionDirection">
      <div 
        v-if="currentView"
        key="subView"
        class="absolute top-0 left-0 w-full"
      >
        <!-- Submenu Header -->
        <div class="flex items-center justify-center px-4 py-2 border-b border-gray-800">
          <button
            class="absolute left-4 text-white"
            @click="popView"
          >
            <svg
              class="h-7 w-7 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 class="text-white text-4xl font-bold w-1/2 text-center">
            {{ currentView.label }}
          </h2>
        </div>

        <!-- Submenu Items -->
        <ul class="space-y-4 pt-4 w-1/2 mx-auto">
          <li
            v-for="(item, index) in currentView.items"
            :key="item.path"
            class="w-full"
          >
            <RouterLink
              :to="item.path"
              class="block w-full py-3 text-center text-2xl text-gray-300 hover:text-[clamp(2rem,3vw,4rem)]"
              @click="handleLinkClick"
            >
              {{ item.label }}
            </RouterLink>
            <hr class="border-gray-50 w-full my-2" />
          </li>
        </ul>
      </div>

      <!-- Main Menu -->
      <div 
        v-else
        key="mainView"
        class="absolute top-0 left-0 w-full"
      >
        <ul class="flex flex-col items-center justify-center w-full mt-5 space-y-4 pt-4">
          <!-- Dynamic Sections -->
          <template v-for="(section, key, index) in navStore.routes" :key="key">
            <li class="font-bold w-full">
              <div 
                v-if="section.items.length > 0"
                class="relative w-1/2 mx-auto cursor-pointer"
                @click="pushView(section)"
                @touchstart.passive="startLongPress(section, key, $event)"
                @touchend="cancelLongPress"
                @mousedown="startLongPress(section, $event)"
                @mouseup="cancelLongPress"
                @mouseleave="cancelLongPress"
              >
                <div 
                class="block w-full py-3 text-center text-3xl text-white"
                :class="{ 
                  'animate-shake' : activeSectionKey === key,
                  'text-[clamp(2rem,3vw,4rem)]' : activeSectionKey === key
                }">
                  {{ section.label }}
                  
                   <!-- Progress indicator -->
                  <div 
                     v-if="activeSectionKey === key"
                    class="absolute bottom-0 left-0 h-1 bg-white transition-all duration-500 ease-linear"
                    :style="{ width: pressProgress + '%' }"
                  ></div>
                  <svg
                    class="absolute right-0 top-1/2 transform -translate-y-1/2 h-5 w-5 stroke-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <RouterLink
                v-else
                :to="section.path"
                class="block w-1/2 mx-auto py-3 text-center text-3xl text-white hover:text-[clamp(2rem,3vw,4rem)]"
                @click="handleLinkClick"
              >
                {{ section.label }}
              </RouterLink>
            </li>
            <hr class="border-gray-700 w-1/2 mx-auto my-2" />
          </template>

          <!-- Static Sections -->
          <li class="w-full font-bold">
            <div class="relative w-1/2 mx-auto">
              <a
                href="https://www.youtube.com/@CommunauteCompassionShediac"
                class="block w-full py-3 text-center text-3xl text-white hover:text-[clamp(2rem,3vw,4rem)]"
              >
                WATCH
              </a>
            </div>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useNavigationStore } from '@/stores/NavItems/Navigation'
import { RouterLink } from 'vue-router'
import router from '@/router'

const navStore = useNavigationStore()
const emit = defineEmits(['close-menu'])

const navigationStack = ref([])
const transitionDirection = ref('slide-left')

const longPressTimer = ref(null)
const longPressDuration = 500 
const pressProgress = ref(0)
const progressInterval = ref(null)
const activeSectionKey = ref(null)

const currentView = computed(() => 
  navigationStack.value[navigationStack.value.length - 1]
)

function pushView(section) {
  transitionDirection.value = 'slide-left'
  navigationStack.value.push(section)
}

function popView() {
  transitionDirection.value = 'slide-right'
  navigationStack.value.pop()
}

const startLongPress = (section, key, event) => {
  if (event?.cancelable) event?.preventDefault()

  activeSectionKey.value = key
  pressProgress.value = 0
  
  // animate
  progressInterval.value = setInterval(() => {
    pressProgress.value += (100 / (longPressDuration / 50))  
  }, 50)

  // haptic for android or iphone
  if (navigator.vibrate) {
    navigator.vibrate(200)
  } else if (window.webkit?.messageHandlers) {
    window.webkit.messageHandlers.vibrate.postMessage(200)
  }

  longPressTimer.value = setTimeout(() => {
    handlePressAction(section)
  }, longPressDuration)
}

const cancelLongPress = () => {
  activeSectionKey.value = null
  pressProgress.value = 0

  clearInterval(progressInterval.value)
  if (longPressTimer.value) {
    clearTimeout(longPressTimer.value)
    longPressTimer.value = null
  }

  // Stop any ongoing vibration
  if (navigator.vibrate) navigator.vibrate(0)
}

const handlePressAction = (section) => {
  if (section.path) {
    router.push(section.path)
    emit('close-menu')
  }
  cancelLongPress()
}

const props = defineProps({
  isMenuOpen: {
    type: Boolean,
    required: true
  },
  headerHeight: {
    type: Number,
    default: 88
  }
})

const handleLinkClick = () => {
  emit('close-menu')
}

watch(() => props.isMenuOpen, (newVal) => {
  if (!newVal) {
    navigationStack.value = []
  }
})
</script>

<style scoped>
/* Transition styles */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
}

.slide-left-enter-from {
  transform: translateX(100%);
}

.slide-left-leave-to {
  transform: translateX(-100%);
}

.slide-right-enter-from {
  transform: translateX(-100%);
}

.slide-right-leave-to {
  transform: translateX(100%);
}

/* Shake animation */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-3px); }
  75% { transform: translateX(3px); }
}

.animate-shake {
  animation: shake 0.15s cubic-bezier(.36,.07,.19,.97) infinite;
}

/* Progress bar */
.progress-bar {
  height: 2px;
  background: rgba(255,255,255,0.8);
  transition: width 0.3s ease-out;
}

.nav-gradient-mobile {
  opacity: 1;
  background-color: #021a21;
  transition: 
    transform 0.3s ease-in-out,
    top 0.3s ease-in-out,
    height 0.3s ease-in-out;
}

.nav-gradient-mobile::before,
.nav-gradient-mobile::after {
  pointer-events: none; /* Allow clicks through the gradient */
}


.nav-gradient-mobile::before {
  content: '';
  @apply absolute inset-0 -z-10;
  background: radial-gradient(800px circle at 50% 40%, rgba(4, 78, 75, 0.9) 0%, rgba(3, 62, 63, 0.8) 25%, rgba(2, 26, 33, 0.6) 50%, rgba(2, 26, 33, 0.4) 75%, rgba(2, 26, 33, 0.2) 100%),
    linear-gradient(45deg, rgba(3, 62, 63, 0.4) 0%, rgba(4, 78, 75, 0.4) 50%, rgba(2, 26, 33, 0.4) 100%),
    radial-gradient(600px circle at 70% 50%, rgba(4, 78, 75, 0.5) 0%, transparent 70%),
    radial-gradient(500px circle at 30% 50%, rgba(3, 62, 63, 0.5) 0%, transparent 70%);
}

.nav-gradient-mobile::after {
  content: '';
  @apply absolute inset-0;
  background-image: url('data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%" height="100%" filter="url(%23noise)" opacity="0.05"/%3E%3C/svg%3E');
  mix-blend-mode: overlay;
  opacity: 0.15;
}
</style>
