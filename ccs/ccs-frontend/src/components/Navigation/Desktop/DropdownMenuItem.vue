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
        v-if="items.length > 0" 
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
      v-show="isOpen"
      class="absolute z-10 left-0  -translate-x-2  bg-black rounded-lg shadow-lg min-w-[240px] transition-all ease-in-out"
     
    >
      <div class="p-2">
        <!-- Regular Items -->
        <ul class="space-y-1">
          <li
           
           v-for="item in items"
           :key="item.path"
           @mouseenter="handleItemHover"
          >
            <RouterLink 
              :to="item.path"
              :class="[
                'block px-4 py-2 text-white hover:bg-gray-800 rounded-md',
                { 'bg-gray-900': isActive(item.path) }
              ]"
              @click="$emit('update:isOpen', false)"
            >
              {{ item.label }}
            </RouterLink>
          </li>
        </ul>

        <!-- Slot for Admin Controls -->
        <slot />
      </div>
    </div>
    </li>
  </template>
  
  <script setup>
  import { ref, useSlots, computed } from 'vue'
  import { RouterLink, useRoute } from 'vue-router'
  import { useAuthStore } from '@/stores/Auth'

  const authStore = useAuthStore()
  const route = useRoute()
  const slots = useSlots()

  const parentRef = ref(null)
  const dropdownRef = ref(null)
  
  const isAuthenticated = computed(() => authStore.checkAuth)
  const shouldApplyPadding = computed(() => {
    return !isAuthenticated.value || !slots.default
  })

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