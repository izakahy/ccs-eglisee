<template>
    <ul class="hidden md:flex space-x-8 text-2xl">
    <DropdownMenuItem
      label="ABOUT"
      href="#about"
      :is-open="dropdownStates.aboutRoute"
      :items="aboutItems"
      @update:is-open="(value) => HandleDropdownToggle('aboutRoute', value)"
    >
      <!-- Admin Controls (outside regular items) -->
      <div v-if="isAuthenticated" class="p-6 space-y-4 border-t border-gray-400 mt-4 w-full max-w-2xl mx-auto rounded-xl shadow-md">
        <!-- Add/Edit Form -->
        <div class="flex gap-2">
          <input
            v-model="newItem.label"
            placeholder="Label (ex: 'story' or 'mission')"
            class="px-2 py-2 bg-gray-50 border border-gray-300 rounded-lg text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200 ease-in-out"
          >
          <button
            title="Add or Update"
            @click="editingIndex === -1 ? handleAdd() : handleUpdate()"
            class="p-2 text-white bg-green-500 hover:bg-green-600 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <PencilSquareIcon class="w-5 h-5" />
          </button>
        </div>

        <!-- Items List -->
        <div v-for="(item, index) in aboutItems" :key="index" class="flex items-center gap-2">
          <span class="flex-1 text-sm text-white">{{ item.label }}</span>
          <RouterLink :to="item.path">{{ item.label }}</RouterLink>
          <button
            title="Update"
            @click="editingIndex = index; newItem = { label: item.label }"
            class="text-gray-900 p-1 bg-blue-400 hover:bg-blue-500 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <PencilIcon class="w-4 h-4" />
          </button>
          <button
            title="Delete"
            @click="handleDelete(index)"
            class="text-white p-1 bg-red-500 hover:bg-red-600 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <TrashIcon class="w-4 h-4" />
          </button>
        </div>
      </div>
    </DropdownMenuItem>
    
    <!-- Other menu items -->
    <ul>
      <DropdownMenuItem
       label="CONNECT"
       href="/posts"
       :is-open="dropdownStates.connectRoute"
       :items="[]"
       @update:is-open="(value) => HandleDropdownToggle('connectRoute', value)"
      >
        <li><RouterLink :to="{ name: 'posts' }">CONNECT</RouterLink></li>
      </DropdownMenuItem>
    </ul>
    <li><RouterLink :to="{ name: 'create' }">EVENT</RouterLink></li>
    <li><a target="_blank" href="https://www.youtube.com/@CommunauteCompassionShediac">WATCH</a></li>
    <li><RouterLink :to="{ name: 'create' }">FORWARD</RouterLink></li>
    <li><RouterLink :to="{ name: 'create' }">GIVE</RouterLink></li>
  </ul>
  </template>
  
<script setup>
  import { ref, computed, reactive } from 'vue';
  import { RouterLink } from 'vue-router'
  import DropdownMenuItem from './DropdownMenuItem.vue';
  import { useAboutStore } from '@/stores/NavItems/About';
  import { useAuthStore } from '@/stores/Auth';
  import { PencilSquareIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline';


  const authStore = useAuthStore();
  const aboutStore = useAboutStore();
  
  const newItem = ref({ label: ''})
  const editingIndex = ref(-1)
  
  const dropdownStates = reactive({
    aboutRoute: false,
    connectRoute: false
  })

  const isAuthenticated = computed(() => authStore.checkAuth());
  
  const HandleDropdownToggle = (dropdown, value) => {
    dropdownStates[dropdown] = value

    if (value && dropdown === 'about') {
      newItem.value = { label: ''}
      editingIndex.value = -1
    }
  }

  const showAlert = (msg) => {
    const wasOpen = dropdownStates.aboutRoute

    alert(msg)
    dropdownStates.aboutRoute = wasOpen
  }

  const generatePath = (label) => {
    const labelPath = label.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

    return `/about/${labelPath}`
  }

  const handleAdd = () => {
    if (!newItem.value.label.trim()) {
      showAlert("Please enter a label.")
      return
    }

    const generatedPath = generatePath(newItem.value.label)

    const isDuplicateLabel = aboutStore.items.some(item => 
      item.label.toLowerCase() === newItem.value.label.toLowerCase()
    );
    
    if (isDuplicateLabel) {
      showAlert('Label already exists. Please choose a unique label.');
      return;
    }

    aboutStore.addItem({
      label: newItem.value.label,
      path: generatedPath 
    })
    newItem.value = { label: '', path: '' }
  }

  const handleUpdate = () => {
    if (!newItem.value.label.trim()) {
      showAlert("Please enter a label.")
      return
    }
    
    const generatedPath = generatePath(newItem.value.label)
    
    const isDuplicateLabel = aboutStore.items.some((item, index) => {
      // Skip comparing with the item being edited
      if (index === editingIndex.value) return false;
      return item.label.toLowerCase() === newItem.value.label.toLowerCase();
    });

    if (isDuplicateLabel) {
      showAlert('Label already exists. Please choose a unique label.');
      return;
    }
    
    // Update the item
    aboutStore.updateItem(editingIndex.value, {
      label: newItem.value.label,
      path: generatedPath,
    });

    // Reset the editing state
    editingIndex.value = -1;
    newItem.value = { label: ''};
  };

  const handleDelete = (index) => {
    const wasOpen = dropdownStates.aboutRoute
    const shouldDelete = confirm("Are you sure you want to delete this?")
    dropdownStates.aboutRoute = wasOpen

    if (shouldDelete) aboutStore.deleteItem(index)
  }
  
  defineProps({
    modelValue: {
      type: Object,
      required: true
    },
    aboutItems: {
      type: Array,
      required: true
    }
  })
  
  defineEmits(['update:modelValue'])
  </script>