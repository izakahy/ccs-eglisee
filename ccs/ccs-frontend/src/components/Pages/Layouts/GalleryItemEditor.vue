<template>
    <div class="p-6 space-y-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-medium text-indigo-800">Photo Gallery Items</h3>
        <button
          @click="addItem"
          class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Add Photo
        </button>
      </div>
      
      <!-- Gallery Items Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="(item, index) in modelValue" :key="index" 
             class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <!-- Image Preview -->
          <div class="aspect-square bg-gray-100 rounded-md mb-4 overflow-hidden relative">
            <img v-if="item.image" :src="item.image" alt="Preview" 
                 class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="ml-2">No Image</span>
            </div>
            
            <!-- Upload Button Overlay -->
            <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <button 
                @click="$emit('trigger-upload', index)" 
                class="bg-white text-gray-800 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
              >
                Upload Image
              </button>
            </div>
          </div>
          
          <!-- Image URL Input -->
          <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input
              v-model="item.image"
              type="text"
              placeholder="https://example.com/image.jpg"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          
          <!-- Title Field -->
          <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              v-model="item.title"
              type="text"
              placeholder="Enter title"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          
          <!-- Description Field -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              v-model="item.description"
              rows="2"
              placeholder="Enter description"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>
          
          <!-- Item Actions -->
          <div class="flex items-center justify-between border-t pt-3 mt-2">
            <div>
              <button
                @click="moveItem(index, index - 1)"
                :disabled="index === 0"
                class="text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed mr-2"
                title="Move Up"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                </svg>
              </button>
              
              <button
                @click="moveItem(index, index + 1)"
                :disabled="index === modelValue.length - 1"
                class="text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Move Down"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            <button
              @click="removeItem(index)"
              class="text-red-600 hover:text-red-800"
              title="Remove"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-if="!modelValue || modelValue.length === 0" class="bg-gray-50 rounded-lg p-10 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-600 mb-2">No Photos Added</h3>
        <p class="text-gray-500 mb-4">Add photos to create your gallery</p>
        <button
          @click="addItem"
          class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Add Your First Photo
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    modelValue: {
      type: Array,
      default: () => []
    },
    scripture: {
      type: Object,
      default: () => ({
        verse: '',
        reference: ''
      })
    }
  });
  
  const emit = defineEmits(['update:modelValue', 'update:scripture', 'trigger-upload']);
  
  const addItem = () => {
    const newItems = [...(props.modelValue || [])];
    newItems.push({ image: '', title: '', description: '' });
    emit('update:modelValue', newItems);
  };
  
  const removeItem = (index) => {
    const newItems = [...props.modelValue];
    newItems.splice(index, 1);
    emit('update:modelValue', newItems);
  };
  
  const moveItem = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= props.modelValue.length) return;
    
    const newItems = [...props.modelValue];
    const item = newItems.splice(fromIndex, 1)[0];
    newItems.splice(toIndex, 0, item);
    emit('update:modelValue', newItems);
  };
  </script>
  
  <style scoped>
  /* Transitions and animations for a smoother UX */
  .grid-enter-active,
  .grid-leave-active {
    transition: all 0.3s ease;
  }
  .grid-enter-from,
  .grid-leave-to {
    opacity: 0;
    transform: translateY(30px);
  }
  </style>