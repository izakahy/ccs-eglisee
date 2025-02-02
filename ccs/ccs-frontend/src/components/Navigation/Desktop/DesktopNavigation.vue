<template>
    <ul class="hidden md:flex space-x-8 text-2xl">
    
    <template v-for="(section, key) in navStore.routes" :key="key">
      <DropdownMenuItem
      :label="section.label"
      :href="section.path"
      :is-open="dropdownStates[key]"
      :items="section.items"
      :section-key="key"
      @update:is-open="(value) => HandleDropdownToggle(key, value)"
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
            @click="editingIndex === -1 ? handleAdd(key) : handleUpdate(key)"
            class="p-2 text-white bg-green-500 hover:bg-green-600 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <PencilSquareIcon class="w-5 h-5" />
          </button>
        </div>

        <!-- Items List -->
        <div v-for="(item, index) in section.items" :key="index" class="flex items-center gap-2">
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
            @click.stop.prevent="handleDelete(key, index)"
            class="text-white p-1 bg-red-500 hover:bg-red-600 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <TrashIcon class="w-4 h-4" />
          </button>
        </div>
      </div>
    </DropdownMenuItem>
    </template>
    
    <li><RouterLink :to="{ name: 'create' }">EVENT</RouterLink></li>
    <li><a target="_blank" href="https://www.youtube.com/@CommunauteCompassionShediac">WATCH</a></li>
    <li><RouterLink :to="{ name: 'create' }">FORWARD</RouterLink></li>
    <li><RouterLink :to="{ name: 'create' }">GIVE</RouterLink></li>
  
     <!-- Add Section Form -->
      <div v-if="isAuthenticated" class="items-center">
        <div v-if="isAddingSectionMode" class="flex gap-2 items-center">
          <input
            v-model="newSection.label"
            placeholder="Section Label (e.g. 'SERVICES')"
            class="px-2 py-2 bg-gray-50 border border-gray-300 rounded-lg text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
          <button
            @click="handleAddSection"
            class="p-2 text-white bg-green-500 hover:bg-green-600 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <PencilSquareIcon class="w-5 h-5" />
          </button>
          <button
            @click="isAddingSectionMode = false"
            class="p-2 text-white bg-red-500 hover:bg-red-600 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>
        <button
          v-else
          @click="isAddingSectionMode = true"
          class="p-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          title="Add Section"
        >
          <PlusIcon class="w-5 h-5" />
        </button>
    </div>
  </ul>
</template>
  
<script setup>
  import { ref, computed, reactive, shallowRef } from 'vue';
  import { RouterLink } from 'vue-router'
  import DropdownMenuItem from './DropdownMenuItem.vue';
  import { useAboutStore } from '@/stores/NavItems/About';
  import { useAuthStore } from '@/stores/Auth';
  import { PencilSquareIcon, PencilIcon, TrashIcon,PlusIcon, XMarkIcon } from '@heroicons/vue/24/outline';
  import { useNavigationStore } from '@/stores/NavItems/Navigation';
  import { addDynamicRoutes } from '@/router';
  import DynamicPage from '../Pages/DynamicPage.vue';


  const navStore = useNavigationStore();
  const authStore = useAuthStore();
  const aboutStore = useAboutStore();
  
  const newItem = shallowRef({ label: ''})
  const editingIndex = ref(-1)
  const isAddingSectionMode = ref(false);
  const dropdownStates = reactive({})
  const newSection = reactive({
    label: ''
  });

  Object.keys(navStore.routes).forEach(key => {
    dropdownStates[key] = false
  })

  const isAuthenticated = computed(() => authStore.checkAuth());
  
  const HandleDropdownToggle = (key, value) => {
    dropdownStates[key] = value

    if (value) {
      newItem.value = { label: ''}
      editingIndex.value = -1
    }
  }

  const showAlert = (msg, sectionKey) => {
    const wasOpen = dropdownStates[sectionKey];
    alert(msg);
    dropdownStates[sectionKey] = wasOpen;
  }

  const handleAdd = (sectionKey) => {
    const validation = navStore.validateItem(sectionKey, newItem.value.label);
    if (!newItem.value.label.trim()) {
      showAlert("Please enter a label.");
      return;
    }

    if (!validation.isValid) {
      showAlert('Label already exists. Please choose a unique label.');
      return;
    }

    try {
      navStore.addItem(sectionKey, {
        label: newItem.value.label,
        path: newItem.value.label.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')
      });
      addDynamicRoutes()
      newItem.value = { label: '' };
    } catch (error) {
      showAlert(error.message);
    }
  }

  const handleUpdate = (sectionKey) => {
    if (!newItem.value.label.trim()) {
      showAlert("Please enter a label.");
      return;
    }

    try {
      const validation = navStore.validateItemUpdate(
        sectionKey, 
        editingIndex.value, 
        newItem.value.label
      );

      if (!validation.isValid) {
        showAlert('Label or path already exists in this section');
        return;
      }

      navStore.updateItem(sectionKey, editingIndex.value, {
        label: newItem.value.label,
        path: newItem.value.label.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')
      });
      addDynamicRoutes();
      editingIndex.value = -1;
      newItem.value = { label: '' };
    } catch (error) {
      showAlert(error.message);
    }
  };

  const handleDelete = (sectionKey, index) => {
    const wasOpen = dropdownStates[sectionKey]
    
    const confrimed = confirm("Are you sure you want to delete this?")
    dropdownStates[sectionKey] = wasOpen
    if (confrimed) {
      navStore.deleteItem(sectionKey, index);
      addDynamicRoutes();

      dropdownStates[sectionKey] = true;
    }
  };

  const handleAddSection = () => {
    if (!newSection.label.trim()) {
      alert('Please enter a section label');
      return;
    }

    // Generate the section key from the label
    const sectionKey = newSection.label
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-');
    
    try {
      navStore.addSection(sectionKey, {
        label: newSection.label.toUpperCase(),
        component: DynamicPage
      });
      
      // Reset form
      newSection.label = '';
      isAddingSectionMode.value = false;
      
      // Update routes
      addDynamicRoutes();
    } catch (error) {
      console.error(error.message)
    }
  };

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