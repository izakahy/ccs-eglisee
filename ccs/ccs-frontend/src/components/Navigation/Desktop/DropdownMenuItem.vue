<template>
    <li 
      ref="parentRef"
      class="relative"
      @mouseenter="openDropdown"
      @mouseleave="handleMouseLeave"
      :class="{ 'dropdown-active': isParentActive }"
    >
      <div class="flex items-center cursor-pointer">
        <RouterLink 
          :to="href"
          :class="{ 'text-gray-300 font-semibold': isParentActive }"
        >
          {{ label }}
        </RouterLink>
        <span
        v-if="shouldShowDropdownIcon" 
        class="ml-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 transition-transform duration-200"
            :class="{'rotate-180': isOpen}"
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
      <div 
      ref="dropdownRef"
      v-show="isOpen && shouldShowDropdown"
      class="absolute z-10 left-0  -translate-x-2  rounded-lg shadow-lg min-w-[240px] transition-all ease-in-out"
    >
      <div
      
       class="p-2 dropdown-gradient"
      >
        <!-- Regular Items -->
        <ul class="space-y-1">
          <li
           v-for="item in items"
           :key="item.path"
           @mouseenter="handleItemHover"
          >
            <RouterLink 
              :to="item.external ? { path: item.path } : item.path"
              :target="{'_blank' : item.external }"
              :class="[
                'flex items-center justify-between px-4 py-2 rounded-md transition-colors ease-in',
                isActive(item.path) 
                  ? 'bg-[#f5f4f4] !text-gray-950' 
                  : [
                      'text-white',
                      { 'hover:bg-[#f5f4f4] hover:text-gray-950': !item.external },
                      { 'hover:bg-[#FF0000]' : item.external && item.label === 'YouTube' },
                      { 'hover:bg-[#1877F2]' : item.external && item.label === 'Facebook' }
                    ]
              ]"
              @click="$emit('update:isOpen', false)"
            >
              <span>{{ item.label }}</span>
              <ArrowTopRightOnSquareIcon v-if="item.external" class="w-6 h-6" />
            </RouterLink>
          </li>
          
        </ul>
        
        <!-- Slot for Admin Controls -->
        <div v-if="$slots.default" class=" border-gray-700">
          <slot />
        </div>
      </div>
    </div>
    
    </li>
  </template>
  
  <script setup>
  import { ref, useSlots, computed } from 'vue'
  import { RouterLink, useRoute } from 'vue-router'
  import { useAuthStore } from '@/stores/Auth'
  import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline'

  const authStore = useAuthStore()
  const route = useRoute()
  const slots = useSlots()

  const parentRef = ref(null)
  const dropdownRef = ref(null)

  const isAuthenticated = computed(() => authStore.checkAuth())
  
  const props = defineProps({
    label: {
      type: String,
      required: true
    },
    href: {
      type: String,
      
    },
    isOpen: {
      type: Boolean,
      required: true,
      default: false
    },
    items: {
      type: Array,
      default: () => []
    },
    sectionKey: {
      type: String,
      required: true
    }
  })

  const shouldShowDropdown = computed(() => {
    return props.items.length > 0 || isAuthenticated.value
  })

  const shouldShowDropdownIcon = computed(() => {
    return shouldShowDropdown.value
  })

  const hasDropdownItems = computed(() => {
    return props.items.length > 0 || socialItems.length > 0
  })

  const currentSection = computed(() => {
    return route.path.split('/')[1] // Extract section from URL (/about/team -> 'about')
  })

  const isParentActive = computed(() => {
    return route.path.startsWith(props.href)
  })

  const isActive = (path) => {
    // Match exact path or nested paths
    return route.path === path || route.path.startsWith(`${path}/`)
  }
  
  const emit = defineEmits(['update:isOpen'])
  const closeTimeout = ref(null)
  const isHoveringDropdown = ref(false)


  const openDropdown = () => {
    emit('update:isOpen', true)
  }

  const handleMouseLeave = (event) => {
    const isLeavingToDropdown = dropdownRef.value?.contains(event.relatedTarget)
    const isLeavingToParent = parentRef.value?.contains(event.relatedTarget)

    if (!isLeavingToDropdown && !isLeavingToParent) {
      emit('update:isOpen', false)
    }
  }

  const handleItemHover = () => {
    if (closeTimeout.value) {
      clearTimeout(closeTimeout.value)
    }
  }
  </script>

<style scoped>
.dropdown-gradient {
  position: relative;
  background-color: rgba(2, 26, 33, 0.95); /* Base dark color with slight transparency */
  overflow: hidden;
}

.dropdown-gradient::before,
.dropdown-gradient::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.dropdown-gradient::before {
  background: 
    radial-gradient(
      400px circle at 50% 50%,
      rgba(4, 78, 75, 0.7) 0%,
      rgba(3, 62, 63, 0.6) 25%,
      rgba(2, 26, 33, 0.5) 50%,
      rgba(2, 26, 33, 0.4) 75%,
      rgba(2, 26, 33, 0.3) 100%
    ),
    linear-gradient(
      45deg,
      rgba(3, 62, 63, 0.3) 0%,
      rgba(4, 78, 75, 0.3) 50%,
      rgba(2, 26, 33, 0.3) 100%
    );
}

.dropdown-gradient::after {
  background: url('data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%" height="100%" filter="url(%23noise)" opacity="0.05"/%3E%3C/svg%3E');
  opacity: 0.1;
  mix-blend-mode: overlay;
}

.dropdown-gradient ul li a,
.dropdown-gradient > :not(ul) {
  position: relative;
  z-index: 1;
}
</style>